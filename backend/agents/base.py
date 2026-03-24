from crewai import Agent
import os
import dotenv

# Use Langchain's OpenAI client to connect to Sarvam's OpenAI-compatible endpoint
# This bypasses CrewAI's internal litellm dependency and its Windows long-path install issues.
from langchain_openai import ChatOpenAI

dotenv.load_dotenv()

class BaseAgent:
    def __init__(self):
        # Sarvam-M: 24B instruction-tuned model, OpenAI-compatible endpoint
        self.llm = ChatOpenAI(
            model="openai/sarvam-m",
            openai_api_base="https://api.sarvam.ai/v1",
            openai_api_key=os.getenv("SARVAM_API_KEY")
        )

    def get_agent(self) -> Agent:

        raise NotImplementedError
