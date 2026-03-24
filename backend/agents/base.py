from crewai import Agent

import os
import dotenv
from langchain_openai import ChatOpenAI
from crewai import LLM  # imported for native Gemini support

dotenv.load_dotenv()

class BaseAgent:
    def __init__(self):
        # Primary LLM: Sarvam-M (24B) for deep reasoning & scoring
        self.llm = ChatOpenAI(
            model="openai/sarvam-m",
            openai_api_base="https://api.sarvam.ai/v1",
            openai_api_key=os.getenv("SARVAM_API_KEY")
        )
        
        # Secondary LLM: Gemini 1.5 Flash for high-volume classification
        self.fast_llm = LLM(
            model="gemini-2.5-flash",
            provider="openai",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            api_key=os.getenv("GEMINI_API_KEY")
        )

    def get_agent(self) -> Agent:

        raise NotImplementedError
