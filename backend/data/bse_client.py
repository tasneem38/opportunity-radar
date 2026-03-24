import httpx
import json
import re
from datetime import datetime, timedelta
from loguru import logger

class BSEClient:
    BASE_URL = "https://www.bseindia.com/"
    API_BASE = "https://api.bseindia.com/BseIndiaAPI/api"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.3",
        "Accept": "application/json, text/plain, */*",
        "Origin": "https://www.bseindia.com/",
        "Referer": "https://www.bseindia.com/",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive"
    }

    async def _req(self, url: str, params: dict = None) -> httpx.Response:
        async with httpx.AsyncClient(headers=self.HEADERS, timeout=15) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            return resp

    async def lookup_scrip(self, query: str) -> dict:
        """Search for a company and return its BSE Scrip Code, Symbol, and ISIN."""
        url = f"{self.API_BASE}/PeerSmartSearch/w"
        params = {"Type": "SS", "text": query}
        try:
            resp = await self._req(url, params)
            text = resp.text.replace("&nbsp;", " ")
            
            # Example format from repo: <span>HDFC   INE001A01036<strong>500010
            # More common format: <strong>SYMBOL</strong>   ISIN   SCRIPCODE
            
            # Try symbol filter first
            match = re.search(r"<strong>([A-Z0-9]+)</strong>\s+([A-Z0-9]+)\s+(\d{6})", text)
            if not match:
                # Try generic span filter
                match = re.search(r"<span>([A-Z0-9\s]+)\s+([A-Z0-9]+)<strong>(\d{6})", text)
            
            if match:
                return {
                    "symbol": match.group(1).strip(),
                    "isin": match.group(2).strip(),
                    "scrip_code": match.group(3).strip()
                }
            return {}
        except Exception as e:
            logger.error(f"BSE lookup failed for {query}: {e}")
            return {}

    async def fetch_announcements(self, from_date: datetime = None, to_date: datetime = None, scrip_code: str = "") -> list:
        if not from_date: from_date = datetime.now() - timedelta(hours=24)
        if not to_date: to_date = datetime.now()
        
        url = f"{self.API_BASE}/AnnSubCategoryGetData/w"
        params = {
            "pageno": 1,
            "strCat": "-1",
            "strPrevDate": from_date.strftime("%Y%m%d"),
            "strToDate": to_date.strftime("%Y%m%d"),
            "strSearch": "P",
            "strscrip": scrip_code,
            "strType": "C"
        }
        try:
            resp = await self._req(url, params)
            data = resp.json()
            if not data:
                return []
            return data.get("Table", [])
        except httpx.HTTPStatusError as e:
            logger.warning(f"BSE API returned {e.response.status_code}")
            return []
        except Exception as e:
            logger.error(f"BSE announcements fetch failed: {type(e).__name__} - {e}")
            return []


    async def fetch_corporate_actions(self, scrip_code: str = "") -> list:
        """Fetch forthcoming corporate actions (Dividends, Splits, etc.)"""
        url = f"{self.API_BASE}/DefaultData/w"
        params = {
            "ddlcategorys": "E", # Ex-date
            "ddlindustrys": "",
            "segment": "0",      # Equity
            "strSearch": "D",
            "scripcode": scrip_code
        }
        try:
            resp = await self._req(url, params)
            return resp.json()
        except Exception as e:
            logger.error(f"BSE corporate actions fetch failed: {e}")
            return []

    async def fetch_results_calendar(self, scrip_code: str = "") -> list:
        """Fetch forthcoming financial results dates."""
        url = f"{self.API_BASE}/Corpforthresults/w"
        params = {"scripcode": scrip_code}
        try:
            resp = await self._req(url, params)
            if not resp.text.strip(): return []
            return resp.json()
        except Exception as e:
            # Silencing common empty response 'errors' from BSE
            return []

    async def get_live_quote(self, scrip_code: str) -> dict:
        """Get real-time (delayed) quote for a scrip."""
        url = f"{self.API_BASE}/getScripHeaderData/w"
        params = {"scripcode": scrip_code}
        try:
            resp = await self._req(url, params)
            data = resp.json().get("Header", {})
            return {
                "ltp": float(data.get("LTP", 0)),
                "change": float(data.get("Chng", 0)),
                "pchange": float(data.get("ChngPer", 0)),
                "high": float(data.get("High", 0)),
                "low": float(data.get("Low", 0)),
                "prev_close": float(data.get("PrevClose", 0))
            }
        except Exception as e:
            logger.error(f"BSE quote failed for {scrip_code}: {e}")
            return {}