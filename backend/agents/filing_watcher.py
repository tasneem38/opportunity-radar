from crewai import Agent
from .base import BaseAgent

class FilingWatcherAgent(BaseAgent):

    def get_agent(self) -> Agent:
        return Agent(
            role="BSE Filing Analyst",
            goal="Identify material non-routine corporate disclosures that impact stock price.",
            backstory="Experienced SEBI-certified analyst specializing in corporate announcements. You are highly decisive and provide sharp conviction scores (0-10) based on how 'material' a disclosure really is for an institutional investor.",

            llm=self.fast_llm,
            verbose=True,
            allow_delegation=False
        )