from crewai import Agent
from .base import BaseAgent


class DealTrackerAgent(BaseAgent):
    def get_agent(self) -> Agent:
        return Agent(
            role="Institutional Deal Flow Analyst",
            goal="Identify institutional accumulation or distribution patterns in NSE bulk and block deals.",
            backstory="Specialist in tracking smart money movements and supply absorption patterns.",
            llm=self.fast_llm,
            verbose=True,
            allow_delegation=False
        )