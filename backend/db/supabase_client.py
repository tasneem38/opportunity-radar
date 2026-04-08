import os
from datetime import datetime, timedelta
from typing import Optional
from supabase import create_client, Client
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

class Config:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    ALERT_THRESHOLD = 6.0

class Database:
    def __init__(self):
        self.client: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
        logger.info("Database connected to Supabase")

    def upsert_stock(self, symbol: str, company_name: str = "", market_cap: int = 0, sector: str = "") -> dict:
        result = self.client.table("stocks").upsert({
            "symbol": symbol,
            "company_name": company_name,
            "market_cap": market_cap,
            "sector": sector,
            "last_updated": datetime.utcnow().isoformat()
        }, on_conflict="symbol").execute()
        return result.data[0] if result.data else {}

    def get_stock(self, symbol: str) -> Optional[dict]:
        result = self.client.table("stocks").select("*").eq("symbol", symbol).execute()
        return result.data[0] if result.data else None

    def insert_raw_event(self, stock_id: str, event_type: str, raw_data: dict, source: str, event_date: str) -> dict:
        result = self.client.table("raw_events").insert({
            "stock_id": stock_id,
            "event_type": event_type,
            "raw_data": raw_data,
            "source": source,
            "event_date": event_date,
            "processed": False,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        return result.data[0] if result.data else {}

    def insert_agent_output(self, stock_id: str, agent_name: str, signal_type: str, signal_detail: str, confidence: float, raw_event_id: Optional[str] = None) -> dict:
        result = self.client.table("agent_outputs").insert({
            "stock_id": stock_id,
            "agent_name": agent_name,
            "signal_type": signal_type,
            "signal_detail": signal_detail,
            "confidence": confidence,
            "raw_event_id": raw_event_id,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        return result.data[0] if result.data else {}

    def insert_signal(self, data: dict) -> dict:
        """Helper to upsert stock and insert signal in one go."""
        from data.yfinance_client import YFinanceClient
        symbol = data.get("stock_symbol", "UNKNOWN")
        company = data.get("company_name", symbol)
        
        # 1. Ensure stock exists
        # Use robust resolution if name is missing or numeric
        if not company or company == symbol or symbol.isdigit():
            company = YFinanceClient.resolve_company_name(symbol)
            
        stock = self.upsert_stock(symbol, str(company or symbol))
        stock_id = stock.get("id")
        
        # 2. Insert signal
        result = self.client.table("signals").insert({
            "stock_id": stock_id,
            "conviction_score": data.get("confidence_score", 7.0),
            "signal_summary": data.get("category", "General Opportunity"),
            "contributing_agents": data.get("metadata", {}),
            "action_suggestion": data.get("signal_text", ""),
            "historical_context": data.get("sentiment", "Neutral"),
            "alerted": False,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        return result.data[0] if result.data else {}


    def get_unalerted_signals(self, min_score: float = Config.ALERT_THRESHOLD) -> list:
        result = self.client.table("signals")             .select("*, stocks(symbol, company_name, sector)")             .eq("alerted", False)             .gte("conviction_score", min_score)             .order("conviction_score", desc=True)             .execute()
        return result.data or []

    def log_alert(self, signal_id: str, channel: str, recipient: str, status: str):
        self.client.table("alert_log").insert({
            "signal_id": signal_id,
            "channel": channel,
            "recipient": recipient,
            "delivered_at": datetime.utcnow().isoformat(),
            "status": status
        }).execute()

    def get_recent_agent_outputs(self, stock_id: str, days: int = 7) -> list:
        since = (datetime.utcnow() - timedelta(days=days)).isoformat()
        result = self.client.table("agent_outputs")             .select("*")             .eq("stock_id", stock_id)             .gte("created_at", since)             .execute()
        return result.data or []

    def get_top_signals(self, limit: int = 10) -> list:
        result = self.client.table("signals") \
            .select("*, stocks(symbol, company_name, sector)") \
            .order("created_at", desc=True) \
            .limit(limit) \
            .execute()
        return result.data or []


    def is_duplicate_signal(self, stock_id: str, hours: int = 48) -> bool:
        since = (datetime.utcnow() - timedelta(hours=hours)).isoformat()
        result = self.client.table("signals")             .select("id")             .eq("stock_id", stock_id)             .gte("created_at", since)             .execute()
        return len(result.data) > 0

    def get_watchlist(self, user_id: Optional[str] = None) -> list:
        query = self.client.table("watchlist").select("*, stocks(*)")
        if user_id:
            query = query.eq("user_id", user_id)
        result = query.execute()
        return result.data or []

    def get_signals_count_24h(self) -> int:
        since = (datetime.utcnow() - timedelta(hours=24)).isoformat()
        result = self.client.table("signals").select("id", count="exact").gte("created_at", since).execute()
        return result.count or 0

db = Database()
