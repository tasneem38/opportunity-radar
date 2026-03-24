from db.supabase_client import db

def seed_watchlist():
    stocks = ["KPITTECH", "DIXON", "INFY"]
    for s in stocks:
        # Find stock id
        res = db.client.table("stocks").select("id").eq("symbol", s).execute()
        if res.data:
            stock_id = res.data[0]["id"]
            db.client.table("watchlist").upsert({"stock_id": stock_id}).execute()
            print(f"Added {s} to watchlist.")
        else:
            # Create stock first if missing
            res = db.client.table("stocks").insert({"symbol": s, "company_name": s}).execute()
            if res.data:
                stock_id = res.data[0]["id"]
                db.client.table("watchlist").upsert({"stock_id": stock_id}).execute()
                print(f"Created and added {s} to watchlist.")

if __name__ == "__main__":
    seed_watchlist()
