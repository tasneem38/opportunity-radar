import json
from crewai import Task, Agent

class TaskBuilder:
    @staticmethod
    def filing_task(agent: Agent, filings: list) -> Task:
        filings_json = json.dumps(filings[:10], indent=2)
        return Task(
            description=f"Analyze these BSE filings for MATERIAL disclosures: {filings_json}",
            agent=agent,
            expected_output="JSON array of material filing signals with stock_symbol, category, sentiment, action, and score (0-10 based on investor impact)."

        )

    @staticmethod
    def deal_flow_task(agent: Agent, deals: list) -> Task:
        deals_json = json.dumps(deals[:20], indent=2)
        return Task(
            description=f"Analyze these NSE bulk deals for institutional accumulation: {deals_json}",
            agent=agent,
            expected_output="JSON array of deal signals with pattern, sentiment, and conviction."
        )

    @staticmethod
    def scoring_task(agent: Agent, symbol: str, agent_outputs: list) -> Task:
        outputs_json = json.dumps(agent_outputs, indent=2)
        return Task(
            description=f"Synthesize these agent outputs for {symbol} into a final score: {outputs_json}",
            agent=agent,
            expected_output="JSON object with conviction_score, signal_summary, and action_suggestion."
        )
