from crewai import Agent
from .base import BaseAgent


class SentimentAnalyzerAgent(BaseAgent):
    def get_agent(self) -> Agent:
        return Agent(
            role="Management Tone Analyst",
            goal="Detect shifts in management confidence between consecutive earnings calls.",
            backstory="Expert at reading between the lines of management commentary and guidance shifts.",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )