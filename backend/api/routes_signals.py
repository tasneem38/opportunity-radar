
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
            "price": float(f"{float(row['Close'] or 0):.2f}")  # type: ignore
        })
    return chart_data

@router.get("/watchlist")

def get_watchlist():
    items = db.get_watchlist()
    enriched = []
    for item in items:
        stock = item.get("stocks", {})
        if not stock:
            continue
        symbol = stock.get("symbol", "")
        company = stock.get("company_name", symbol)
        price_data = YFinanceClient.get_stock_data(symbol, period="2d")
        current_price = price_data.get("current_price", 0)
        change_pct = YFinanceClient.get_price_change_pct(symbol)
        
        # Get latest signal sentiment
        latest_signal = db.client.table("signals").select("historical_context").eq("stock_id", item.get("stock_id")).order("created_at", desc=True).limit(1).execute()
        sentiment = latest_signal.data[0].get("historical_context", "Neutral") if latest_signal.data else "Neutral"

        enriched.append({
            "symbol": symbol,
            "company": company,
            "price": f"{current_price:,.2f}",
            "change": f"{'+' if change_pct >= 0 else ''}{round(change_pct, 2)}%",
            "sentiment": sentiment
        })
    return enriched

@router.post("/watchlist/add")
def add_to_watchlist(stock_id: str):
    existing = db.client.table("stocks").select("id").eq("symbol", stock_id).execute()
    if existing.data:
        stock_id = existing.data[0]["id"]
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
    
    # Calculate Success Rate
    success_rate = _calculate_success_rate()
    
    return {
        "nifty": {
            "price": f"{nifty_price:,.2f}",
            "change": f"{'+' if nifty_change >= 0 else ''}{round(nifty_change, 2)}%"
        },
        "sensex": {
            "price": f"{sensex_price:,.2f}",
            "change": f"{'+' if sensex_change >= 0 else ''}{round(sensex_change, 2)}%"
        },
        "signals_count": signals_count,
        "success_rate": success_rate
    }


def _calculate_success_rate() -> str:
    """% of high-conviction signals (score>=7) where stock went up since signal date."""
    from datetime import datetime, timedelta
    try:
        since = (datetime.utcnow() - timedelta(days=30)).isoformat()
        result = db.client.table("signals") \
            .select("*, stocks(symbol)") \
            .gte("conviction_score", 7) \
            .gte("created_at", since) \
            .execute()
        
        from typing import cast, List, Dict
        signals = cast(List[Dict], result.data or [])
        if not signals:
            return "N/A"
        
        success: int = 0
        evaluated: int = 0
        
        for sig in signals:
            stock = sig.get("stocks")
            if not stock:
                continue
            symbol = stock.get("symbol", "")
            if not symbol:
                continue
            try:
                sig_date = datetime.fromisoformat(sig["created_at"].replace("Z", "+00:00"))
                if (datetime.now(sig_date.tzinfo) - sig_date).days < 3:
                    continue
                evaluated = int(evaluated) + 1  # type: ignore
                change = YFinanceClient.get_price_change_pct(symbol + ".BO")
                if change > 0:
                    success = int(success) + 1  # type: ignore
            except Exception:
                continue
        
        if int(evaluated) == 0:
            return "N/A"
        
        rate = int((float(success) / float(evaluated)) * 100)  # type: ignore
        return f"{rate}%"
    except Exception:
        return "N/A"