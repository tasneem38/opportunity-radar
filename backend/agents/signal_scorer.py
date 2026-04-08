from crewai import Agent
from agents.base import BaseAgent


class SignalScorerAgent(BaseAgent):
    def get_agent(self) -> Agent:
        return Agent(
            role="Signal Conviction Scorer",
            goal="Synthesize outputs from all other agents into a single conviction score (0–10).",
            backstory="Final intelligence layer that identifies reliable signal combinations and risk flags.",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )