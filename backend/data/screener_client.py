import httpx
from bs4 import BeautifulSoup
import asyncio
from loguru import logger

class ScreenerClient:
    BASE = "https://www.screener.in"
    HEADERS = {"User-Agent": "Mozilla/5.0"}
    DELAY = 2.0

    async def get_quarterly_results(self, symbol: str) -> dict:
        url = f"{self.BASE}/company/{symbol}/"
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                resp = await client.get(url, headers=self.HEADERS)
                resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            table = soup.find("section", {"id": "quarters"})
            if not table: return {}
            rows = table.find_all("tr")
            headers = [th.text.strip() for th in rows[0].find_all("th")] if rows else []
            data = {}
            for row in rows[1:]:
                cells = [td.text.strip() for td in row.find_all("td")]
                row_name = cells[0] if cells else ""
                if row_name in ["Sales", "Net Profit", "OPM %"]:
                    data[row_name] = dict(zip(headers[1:], cells[1:]))
            await asyncio.sleep(self.DELAY)
            return data
        except Exception as e:
            logger.error(f"Screener fetch failed: {e}")
            return {}

    async def get_concall_transcript(self, symbol: str) -> str:
        url = f"{self.BASE}/company/{symbol}/concalls/"
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                resp = await client.get(url, headers=self.HEADERS)
                resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            items = soup.find_all("div", class_="concall-item")
            if not items: return ""
            latest = items[0]
            transcript = latest.get_text(separator="\n", strip=True)
            await asyncio.sleep(self.DELAY)
            return transcript[:8000]
        except Exception as e:
            return ""