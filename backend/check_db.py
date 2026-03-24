import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

print("Checking Supabase contents...")
stocks = supabase.table("stocks").select("count", count="exact").execute()
print(f"Stocks count: {stocks.count}")

signals = supabase.table("signals").select("id, conviction_score, signal_summary, stock_id").execute()
print(f"Signals count: {len(signals.data)}")
for s in signals.data:
    print(f" - Signal: {s['signal_summary']} (Score: {s['conviction_score']})")

if len(signals.data) == 0:
    print("\nWARNING: No signals found in database. The orchestrator might not have stored them or the worker failed.")
