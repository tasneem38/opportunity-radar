from crewai import Agent
from agents.base import BaseAgent


class ResultsAnalyzerAgent(BaseAgent):
    def get_agent(self) -> Agent:
        return Agent(
            role="Earnings Quality Analyst",
            goal="Identify earnings beats that the market has underreacted to.",
            backstory="Forensic earnings analyst focusing on margin expansion and guidance quality.",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )