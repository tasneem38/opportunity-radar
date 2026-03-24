import asyncio
import httpx
from loguru import logger
from db.supabase_client import db
from data.bse_client import BSEClient
from data.nse_client import NSEClient

async def verify():
    print("\n--- OPPORTUNITY RADAR SYSTEM CHECK ---\n")
    
    # 1. Database Connectivity
    print("[1/4] Checking Supabase Connection...")
    try:
        # Try to fetch count from signals table
        res = db.client.table("signals").select("id", count="exact").limit(1).execute()
        print(f"✅ Database connected. Found {res.count if res.count else 0} signals in DB.")
    except Exception as e:
        print(f"❌ Database error: {e}")

    # 2. BSE Live Data
    print("\n[2/4] Testing BSE Live Data (Scrip Lookup)...")
    bse = BSEClient()
    try:
        info = await bse.lookup_scrip("RELIANCE")
        if info and info.get("scrip_code") == "500325":
            print(f"✅ BSE API working. Found Reliance: {info}")
        else:
            print(f"⚠️ BSE API returned unexpected data: {info}")
    except Exception as e:
        print(f"❌ BSE API error: {e}")

    # 3. NSE Live Data
    print("\n[3/4] Testing NSE Live Data (Bulk Deals)...")
    nse = NSEClient()
    try:
        df = await nse.fetch_bulk_deals()
        if not df.empty:
            print(f"✅ NSE API working. Fetched {len(df)} recent bulk deals.")
        else:
            print("⚠️ NSE API returned empty dataframe (Normal if market is closed or no deals today).")
    except Exception as e:
        print(f"❌ NSE API error: {e}")

    # 4. Backend API Health
    print("\n[4/4] Checking FastAPI Local Server...")
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get("http://localhost:8000/health")
            if resp.status_code == 200:
                print(f"✅ Backend server is ALIVE at http://localhost:8000")
            else:
                print(f"❌ Backend server returned {resp.status_code}")
    except Exception as e:
        print(f"❌ Backend server unreachable: {e}. (Make sure 'python main.py' is running!)")

    print("\n--- CHECK COMPLETE ---")

if __name__ == "__main__":
    asyncio.run(verify())
