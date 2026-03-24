import asyncio
import json

from datetime import datetime, timedelta
from loguru import logger
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from crewai import Crew, Process

from db.supabase_client import db
from data.bse_client import BSEClient
from data.nse_client import NSEClient
from data.yfinance_client import YFinanceClient
from data.screener_client import ScreenerClient

from agents.filing_watcher import FilingWatcherAgent
from agents.signal_scorer import SignalScorerAgent
from agents.tasks import TaskBuilder

class OpportunityRadarOrchestrator:
    def __init__(self):
        self.bse = BSEClient()
        self.nse = NSEClient()
        self.yf = YFinanceClient()
        self.screener = ScreenerClient()
        self.scheduler = AsyncIOScheduler()
        self.is_running = False
        
        # Initialize AGENTS
        self.filing_agent = FilingWatcherAgent().get_agent()
        self.scorer_agent = SignalScorerAgent().get_agent()

    async def start(self):
        if self.is_running: return
        
        logger.info("Starting Opportunity Radar Orchestrator...")
        
        # 1. Monitoring Filings (Frequent)
        self.scheduler.add_job(
            self.run_filing_pipeline,
            IntervalTrigger(minutes=15),
            id="filing_watcher",
            max_instances=1
        )
        
        # 2. Tracking Bulk Deals & Corporate Events (Less Frequent)
        self.scheduler.add_job(
            self.run_daily_events_pipeline,
            IntervalTrigger(hours=4),
            id="daily_events",
            max_instances=1
        )
        
        self.scheduler.start()
        self.is_running = True
        
        # Initial run for immediate feedback
        asyncio.create_task(self.run_filing_pipeline())
        asyncio.create_task(self.run_daily_events_pipeline())

    async def run_filing_pipeline(self):
        logger.info("Running Filing Watcher Pipeline...")
        try:
            announcements = await self.bse.fetch_announcements(from_date=datetime.now() - timedelta(hours=2))
            if not announcements:
                logger.info("No new announcements found.")
                return

            # Analyze findings with CrewAI
            filing_task = TaskBuilder.filing_task(self.filing_agent, announcements)
            crew = Crew(
                agents=[self.filing_agent],
                tasks=[filing_task],
                verbose=True
            )
            
            result = crew.kickoff()
            logger.info(f"Filing Analysis Complete: {result}")
            
            # Parse and store signals
            try:
                # result is a CrewOutput object in newest versions, result.raw contains the string
                raw_text = str(result.raw if hasattr(result, 'raw') else result)
                
                # Aggressive Cleanup for Markdown-wrapped JSON
                clean_json = raw_text.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_json:
                    clean_json = clean_json.split("```")[1].split("```")[0].strip()
                
                # Remove any leading/trailing text that isn't part of the JSON array/object
                start_idx = min(clean_json.find('['), clean_json.find('{')) if '[' in clean_json and '{' in clean_json else max(clean_json.find('['), clean_json.find('{'))
                if start_idx != -1:
                    clean_json = clean_json[start_idx:]
                    end_idx = max(clean_json.rfind(']'), clean_json.rfind('}'))
                    if end_idx != -1:
                        clean_json = clean_json[:end_idx+1]

                parsed_data = json.loads(clean_json)
                signals = parsed_data if isinstance(parsed_data, list) else parsed_data.get("signals", [])

                
                for s in signals:
                    # 1. Ensure stock exists and get ID
                    symbol = s.get("stock_symbol", s.get("symbol", "UNKNOWN"))
                    # Defensive truncation for VARCHAR(20) if schema isn't updated
                    symbol = str(symbol)[:20].strip().upper()
                    
                    logger.debug(f"Processing symbol: {symbol}")
                    res = db.client.table("stocks").select("id").eq("symbol", symbol).execute()
                    stock_id = res.data[0]["id"] if res.data else None
                    
                    if not stock_id:
                        company_name = str(s.get("company_name", symbol))[:200]
                        res = db.client.table("stocks").insert({"symbol": symbol, "company_name": company_name}).execute()
                        stock_id = res.data[0]["id"] if res.data else None


                    # 2. Store Raw Event for logging
                    raw_event_res = db.client.table("raw_events").insert({
                        "stock_id": stock_id,
                        "event_type": "filing",
                        "raw_data": s,
                        "source": "BSE/NSE Feed"
                    }).execute()
                    raw_event_id = raw_event_res.data[0]["id"] if raw_event_res.data else None

                    # 3. Store Agent Output
                    db.client.table("agent_outputs").insert({
                        "stock_id": stock_id,
                        "agent_name": "Filing Analyzer",
                        "signal_type": s.get("sentiment", "Neutral"),
                        "signal_detail": s.get("action", "No specific action"),
                        "confidence": float(s.get("score") or 7.2) / 10,
                        "raw_event_id": raw_event_id
                    }).execute()

                    # 4. Final Signal
                    db.insert_signal({
                        "stock_id": stock_id,
                        "stock_symbol": symbol,
                        "company_name": s.get("company_name", s.get("stock_symbol", "UNKNOWN")),
                        "category": s.get("category", "General"),
                        "signal_text": s.get("action", s.get("signal", "Check technicals")),
                        "confidence_score": float(s.get("score") or s.get("confidence_score") or s.get("conviction_score") or 7.2),
                        "sentiment": s.get("sentiment", "Neutral"),
                        "metadata": s
                    })
                logger.info(f"Successfully stored {len(signals)} signals in database.")
                
            except Exception as parse_err:
                logger.error(f"Failed to parse or store signals: {parse_err}")
            
        except Exception as e:
            logger.error(f"Filing pipeline failed: {e}")


    async def run_daily_events_pipeline(self):
        logger.info("Running Daily Events Pipeline...")
        try:
            # BSE Corporate Actions
            actions = await self.bse.fetch_corporate_actions()
            logger.info(f"Fetched {len(actions)} corporate actions")
            
            # BSE Results Calendar
            results_cal = await self.bse.fetch_results_calendar()
            logger.info(f"Fetched {len(results_cal)} results calendar entries")
            
            # NSE Bulk Deals
            bulk_deals = await self.nse.fetch_bulk_deals()
            logger.info(f"Fetched {len(bulk_deals)} bulk deal rows")
            
            # Process and cross-reference these events...
            
        except Exception as e:
            logger.error(f"Daily events pipeline failed: {e}")

    def stop(self):
        self.scheduler.shutdown()
        self.is_running = False

orchestrator = OpportunityRadarOrchestrator()
