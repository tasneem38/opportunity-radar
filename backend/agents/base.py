from crewai import Agent, LLM
import os
import dotenv
dotenv.load_dotenv()

class BaseAgent:
    def __init__(self):
        # Sarvam-M: 24B instruction-tuned model, OpenAI-compatible endpoint
        self.llm = LLM(
            model="openai/sarvam-m",
            base_url="https://api.sarvam.ai/v1",
            api_key=os.getenv("SARVAM_API_KEY")
        )

    def get_agent(self) -> Agent:
        raise NotImplementedError
