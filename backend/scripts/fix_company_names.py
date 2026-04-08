"""Fix company names using Alpha Vantage SYMBOL_SEARCH API."""
import os
import sys
import time
from dotenv import load_dotenv

sys.path.append(os.path.join(os.getcwd(), 'backend'))
load_dotenv('backend/.env')

from db.supabase_client import db
from loguru import logger
import httpx

ALPHA_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")


def search_alpha_vantage(keyword: str) -> str:
    """Use Alpha Vantage SYMBOL_SEARCH to find company name."""
    try:
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "SYMBOL_SEARCH",
            "keywords": keyword,
            "apikey": ALPHA_KEY
        }
        resp = httpx.get(url, params=params, timeout=10)
        data = resp.json()
        matches = data.get("bestMatches", [])
        
        for match in matches:
            region = match.get("4. region", "")
            name = match.get("2. name", "")
            # Prefer Indian (BSE/NSE) matches
            if "India" in region and name:
                return name
        
        # Fallback: return first match name if any
        if matches and matches[0].get("2. name"):
            return matches[0]["2. name"]
    except Exception as e:
        logger.debug(f"Alpha Vantage failed for {keyword}: {e}")
    return ""


def fix_names():
    if not ALPHA_KEY:
        logger.error("ALPHA_VANTAGE_API_KEY not set in .env!")
        return
    
    logger.info("Starting company name fix via Alpha Vantage...")
    
    res = db.client.table("stocks").select("*").execute()
    stocks = res.data or []
    
    logger.info(f"Checking {len(stocks)} stocks...")
    updated_count = 0
    
    for stock in stocks:
        symbol = stock['symbol']
        current_name = stock.get('company_name', '')
        
        # Only fix if name is bad (numerical, missing, same as symbol, or contains commas from bad data)
        name_is_bad = (
            not current_name 
            or current_name == symbol 
            or current_name.replace(' ', '').isdigit() 
            or ',' in current_name
        )
        
        if not name_is_bad:
            continue
        
        logger.info(f"Looking up: {symbol} (current: '{current_name}')...")
        
        # Search with .BO suffix for BSE codes
        search_term = f"{symbol}.BO" if symbol.isdigit() else symbol
        name = search_alpha_vantage(search_term)
        
        if not name or name == symbol:
            # Try without suffix
            name = search_alpha_vantage(symbol)
        
        if name and name != symbol and not name.replace(' ', '').isdigit():
            logger.info(f"  ✅ {symbol} -> {name}")
            db.client.table("stocks").update({"company_name": name}).eq("id", stock["id"]).execute()
            updated_count += 1
        else:
            logger.warning(f"  ❌ Could not resolve: {symbol}")
        
        # Alpha Vantage free tier: 25 requests/day, 5/min
        time.sleep(12)
    
    logger.info(f"Finished. Updated {updated_count} stocks.")


if __name__ == "__main__":
    fix_names()
