import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, LLM

load_dotenv()

try:
    print("Testing with Gemini v1 endpoint explicitly...")
    llm = LLM(
        model="gemini/gemini-1.5-flash",
        api_key=os.getenv("GEMINI_API_KEY"),
        base_url="https://generativelanguage.googleapis.com/v1"
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
    # import traceback
    # traceback.print_exc()
