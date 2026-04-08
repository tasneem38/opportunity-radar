from crewai import Agent, LLM
import os
from dotenv import load_dotenv

load_dotenv()

class BaseAgent:
    def __init__(self):
        # Primary LLM: Sarvam-M (24B) for deep reasoning & scoring
        # Setting provider="openai" bypasses litellm and forces the native OpenAI SDK
        self.llm = LLM(
            model="sarvam-m",
            provider="openai",
            base_url="https://api.sarvam.ai/v1",
            api_key=os.getenv("SARVAM_API_KEY")
        )
        
        # Secondary LLM: Gemini 2.5 Flash for high-volume classification
        self.fast_llm = LLM(
            model="gemini-2.5-flash",
            provider="openai",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            api_key=os.getenv("GEMINI_API_KEY")
        )

    def get_agent(self) -> Agent:

        raise NotImplementedError
