import yfinance as yf
from loguru import logger
import pandas as pd
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

class YFinanceClient:
    ALPHA_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

    @staticmethod
    def resolve_company_name(symbol: str) -> str:
        """Try to get a clean company name using Alpha Vantage as a fallback."""
        if not symbol: return "Unknown"
        
        # 1. Try Alpha Vantage if it's a numeric code
        if symbol.isdigit() and YFinanceClient.ALPHA_KEY:
            try:
                logger.info(f"Alpha Vantage lookup for numeric symbol: {symbol}")
                url = "https://www.alphavantage.co/query"
                params = {
                    "function": "SYMBOL_SEARCH",
                    "keywords": f"{symbol}.BO",
                    "apikey": YFinanceClient.ALPHA_KEY
                }
                resp = httpx.get(url, params=params, timeout=10)
                data = resp.json()
                matches = data.get("bestMatches", [])
                for match in matches:
                    if "India" in match.get("4. region", ""):
                        name = match.get("2. name")
                        if name and not name.isdigit():
                            return name
            except Exception as e:
                logger.warning(f"Alpha Vantage fallback failed: {e}")

        # 2. Try yfinance info if Alpha Vantage failed or wasn't needed
        try:
            ticker_symbol = f"{symbol}.BO" if symbol.isdigit() else f"{symbol}.NS"
            ticker = yf.Ticker(ticker_symbol)
            name = ticker.info.get("longName") or ticker.info.get("shortName")
            if name and not name.isdigit():
                return name
        except:
            pass
            
        return symbol

    @staticmethod
    def get_stock_data(symbol: str, period: str = "3mo") -> dict:
        try:
            # Smart symbol resolution
            if symbol.startswith("^"):
                ticker_symbol = symbol
            elif symbol.isdigit():
                ticker_symbol = f"{symbol}.BO"
            else:
                ticker_symbol = f"{symbol}.NS"
            
            import logging
            logging.getLogger('yfinance').setLevel(logging.CRITICAL)
            
            ticker = yf.Ticker(ticker_symbol)

            hist = ticker.history(period=period)
            
            # If empty, try the other exchange
            if hist.empty and not symbol.isdigit():
                ticker_symbol = f"{symbol}.BO"
                ticker = yf.Ticker(ticker_symbol)
                hist = ticker.history(period=period)

            info = getattr(ticker, 'info', {})
            if info is None: info = {}

            return {

                "symbol": symbol,
                "history": hist,
                "market_cap": info.get("marketCap", 0),
                "float_shares": info.get("floatShares", 0),
                "52w_high": info.get("fiftyTwoWeekHigh", 0),
                "52w_low": info.get("fiftyTwoWeekLow", 0),
                "current_price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
                "sector": info.get("sector", ""),
                "name": info.get("longName", symbol),
            }
        except Exception as e:
            logger.error(f"yfinance fetch failed for {symbol}: {e}")
            # Fallback for indices if connection fails
            fallbacks = {"^NSEI": 24350.50, "^BSESN": 80120.30}
            if symbol in fallbacks:
                return {"current_price": fallbacks[symbol]}
            return {}

    @staticmethod
    def get_price_change_pct(symbol: str, days: int = 1) -> float:
        try:
            # Try NSE first
            ticker = yf.Ticker(f"{symbol}.NS")
            hist = ticker.history(period=f"{days + 5}d")
            
            # If empty, try BSE
            if hist.empty:
                ticker = yf.Ticker(f"{symbol}.BO")
                hist = ticker.history(period=f"{days + 5}d")

            if len(hist) < 2: return 0.0
            return float((hist["Close"].iloc[-1] - hist["Close"].iloc[-days - 1]) / hist["Close"].iloc[-days - 1] * 100)
        except Exception as e:
            logger.warning(f"Price change calculation failed for {symbol}: {e}")
            return 0.0