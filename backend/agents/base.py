from crewai import Agent, LLM
import os
import dotenv
dotenv.load_dotenv()
class BaseAgent:
    def __init__(self):
        # Using OpenAI-compatible endpoint for Gemini to bypass native provider bugs
        self.llm = LLM(
            model="gemini-2.5-flash",
            provider="openai",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            api_key=os.getenv("GEMINI_API_KEY")
        )


    def get_agent(self) -> Agent:
        raise NotImplementedError
