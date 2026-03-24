from fastapi import APIRouter
from data.yfinance_client import YFinanceClient
from datetime import datetime
import pandas as pd

router = APIRouter()

@router.get("/run")
def run_backtest(symbol: str, start: str, end: str):
    try:
        # Fetch historical data
        ticker = YFinanceClient.get_stock_data(symbol, period="max")
        hist = ticker.get("history")
        
        if hist is None or hist.empty:
            # Fallback for indices if needed
            import yfinance as yf
            hist = yf.download(symbol, start=start, end=end)

        if hist.empty:
            return {"status": "error", "message": "No historical data found"}

        # Filter by dates
        mask = (hist.index >= start) & (hist.index <= end)
        data = hist.loc[mask].copy()

        if data.empty:
            return {"status": "error", "message": "No data in selected range"}

        # Calculate Technical Indicators for Signal Detection
        data["SMA20"] = data["Close"].rolling(window=20).mean()
        data["SMA50"] = data["Close"].rolling(window=50).mean()
        
        # Detect "Golden Cross" (SMA20 crosses above SMA50)
        data["signal"] = (data["SMA20"] > data["SMA50"]) & (data["SMA20"].shift(1) <= data["SMA50"].shift(1))
        signals = data[data["signal"] == True]
        
        # Equity Curve calculation
        initial_price = data["Close"].iloc[0]
        data["equity"] = (data["Close"] / initial_price) * 100
        
        results = []
        for date, row in data.iterrows():
            results.append({
                "date": date.strftime("%Y-%m-%d"),
                "price": round(row["Close"], 2),
                "equity": round(row["equity"], 2),
                "has_signal": bool(row["signal"])
            })

        # Calculate Success Rate
        # A signal is a "success" if price is higher 5 days later
        success_count = 0
        total_signals = len(signals)
        
        for idx in signals.index:
            try:
                signal_price = data.loc[idx, "Close"]
                # Look ahead up to 5 days
                future_data = data.loc[idx:].iloc[1:6]
                if not future_data.empty and future_data["Close"].max() > signal_price:
                    success_count += 1
            except:
                pass

        success_rate = f"{round((success_count / total_signals * 100), 0)}%" if total_signals > 0 else "N/A"

        summary = {
            "symbol": symbol,
            "period": f"{start} to {end}",
            "start_price": round(initial_price, 2),
            "end_price": round(data["Close"].iloc[-1], 2),
            "total_return": f"{round(((data['Close'].iloc[-1] / initial_price) - 1) * 100, 2)}%",
            "signals_triggered": total_signals,
            "success_rate": success_rate
        }

        return {
            "status": "success",
            "summary": summary,
            "chart_data": results
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}