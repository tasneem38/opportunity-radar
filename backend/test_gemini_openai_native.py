import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, LLM

load_dotenv()

try:
    print("Testing with OpenAI-native provider pointed at Gemini...")
    # This bypasses the Gemini-specific native provider (which has the 404 bug)
    # and use the OpenAI native provider which is very stable.
    llm = LLM(
        model="gemini-2.5-flash",
        provider="openai", # Force OpenAI native class
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
