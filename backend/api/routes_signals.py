from fastapi import APIRouter
from db.supabase_client import db
from data.yfinance_client import YFinanceClient

router = APIRouter()

@router.get("")
def get_signals():
    # Return most recent signals first for live updates
    signals = db.get_top_signals(limit=20)
    return signals or []

@router.get("/price/{symbol}")
def get_price_history(symbol: str):
    data = YFinanceClient.get_stock_data(symbol, period="1mo")
    if not data or "history" not in data:
        return []
    
    # Convert history dataframe to list of {time, price}
    hist = data["history"]
    chart_data = []
    for date, row in hist.iterrows():
        chart_data.append({
            "time": date.strftime("%Y-%m-%d"),
            "price": round(float(row["Close"]), 2)
        })
    return chart_data

@router.get("/watchlist")

def get_watchlist():
    items = db.get_watchlist()
    # Enrich with live prices
    enriched = []
    for item in items:
        stock = item.get("stocks")
        if stock:
            symbol = stock.get("symbol")
            price_data = YFinanceClient.get_stock_data(symbol, period="1d")
            change = YFinanceClient.get_price_change_pct(symbol)
            # Fetch actual AI Sentiment from the latest signal
            res_signal = db.client.table("signals").select("historical_context").eq("stock_id", stock["id"]).order("created_at", desc=True).limit(1).execute()
            ai_sentiment = res_signal.data[0].get("historical_context", "Neutral") if res_signal.data else ("Bullish" if change > 0 else "Neutral")

            enriched.append({
                "symbol": symbol,
                "price": price_data.get("current_price", 0),
                "change": f"{'+' if change >= 0 else ''}{round(change, 2)}%",
                "sentiment": ai_sentiment
            })
    return enriched

@router.post("/watchlist/{symbol}")
def add_to_watchlist(symbol: str):
    # Find stock_id for symbol
    res = db.client.table("stocks").select("id").eq("symbol", symbol).execute()
    if res.data:
        stock_id = res.data[0]["id"]
        db.client.table("watchlist").upsert({"stock_id": stock_id}).execute()
        return {"status": "success"}
    return {"status": "error", "message": "Stock not found"}

@router.get("/market-stats")
def get_market_stats():
    # Fetch Index Data
    nifty = YFinanceClient.get_stock_data("^NSEI", period="2d")
    sensex = YFinanceClient.get_stock_data("^BSESN", period="2d")
    
    nifty_price = nifty.get("current_price", 24350.0) 
    sensex_price = sensex.get("current_price", 80100.0)
    
    nifty_change = YFinanceClient.get_price_change_pct("^NSEI")
    sensex_change = YFinanceClient.get_price_change_pct("^BSESN")
    
    signals_count = db.get_signals_count_24h()
    
    return {
        "nifty": {
            "price": f"{nifty_price:,.2f}",
            "change": f"{'+' if nifty_change >= 0 else ''}{round(nifty_change, 2)}%"
        },
        "sensex": {
            "price": f"{sensex_price:,.2f}",
            "change": f"{'+' if sensex_change >= 0 else ''}{round(sensex_change, 2)}%"
        },
        "signals_count": signals_count
    }

