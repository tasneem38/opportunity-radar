import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, LLM

load_dotenv()

try:
    print("Testing with OpenAI-compatible Gemini endpoint...")
    # Gemini OpenAI Compatibility
    llm = LLM(
        model="openai/gemini-1.5-flash",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        api_key=os.getenv("GEMINI_API_KEY")
    )
    
    agent = Agent(
        role="Gemini Analyst",
        goal="Verify connectivity",
        backstory="A test agent",
        llm=llm,
        verbose=True
    )
    task = Task(description="Say hello", agent=agent, expected_output="A greeting")
    crew = Crew(agents=[agent], tasks=[task])
    
    print("Kicking off...")
    result = crew.kickoff()
    print(f"SUCCESS: {result}")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
