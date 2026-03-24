import os
from dotenv import load_dotenv
from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

try:
    print("Testing with ChatGoogleGenerativeAI...")
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.1
    )
    
    agent = Agent(
        role="Gemini Analyst",
        goal="Verify connectivity",
        backstory="A test agent",
        llm=llm,
        verbose=True
    )
    print("Agent initialized successfully with Langchain Gemini")
except Exception as e:
    print(f"Error during initialization: {e}")
    import traceback
    traceback.print_exc()
