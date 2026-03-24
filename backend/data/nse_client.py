import httpx
import pandas as pd
import io
from loguru import logger

class NSEClient:
    URL = "https://nsearchives.nseindia.com/content/equities/bulk.csv"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.3",
        "Accept": "*/*",
        "Referer": "https://www.nseindia.com/"
    }

    async def fetch_bulk_deals(self) -> pd.DataFrame:
        try:
            async with httpx.AsyncClient(headers=self.HEADERS, timeout=30) as client:
                resp = await client.get(self.URL)
                resp.raise_for_status()
                
                df = pd.read_csv(io.StringIO(resp.text), header=0)
                df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
                logger.info(f"NSE bulk deals fetched: {len(df)} rows")
                return df
        except Exception as e:
            logger.error(f"NSE fetch failed: {e}")
            return pd.DataFrame()