import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, LLM

load_dotenv()

def test_llm(model_string):
    print(f"\n--- Testing with model string: {model_string} ---")
    try:
        llm = LLM(model=model_string)
        agent = Agent(
            role="Test",
            goal="Test",
            backstory="Test",
            llm=llm,
            verbose=True
        )
        task = Task(description="Say hello", agent=agent, expected_output="A greeting")
        crew = Crew(agents=[agent], tasks=[task])
        
        print(f"Kicking off {model_string}...")
        result = crew.kickoff()
        print(f"SUCCESS with {model_string}: {result}")
        return True
    except Exception as e:
        print(f"FAILED with {model_string}: {e}")
        return False

# Try variations (removed emojis to avoid Windows encoding issues)
if not test_llm("gemini/gemini-1.5-flash"):
    if not test_llm("google_genai/gemini-1.5-flash"):
        test_llm("gemini-1.5-flash")
