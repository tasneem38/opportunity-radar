import asyncio
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.routes_signals import router as signals_router
from api.routes_watchlist import router as watchlist_router
from api.routes_backtest import router as backtest_router
from loguru import logger

def create_app() -> FastAPI:
    app = FastAPI(title="Opportunity Radar API")
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
    
    app.include_router(backtest_router, prefix="/api/backtest")
    app.include_router(signals_router, prefix="/api/signals")
    app.include_router(watchlist_router, prefix="/api/watchlist")

    @app.on_event("startup")
    async def startup_event():
        try:
            from orchestrator import orchestrator
            asyncio.create_task(orchestrator.start())
            logger.info("Backend services started.")
        except Exception as e:
            logger.error(f"Startup error: {e}")

    @app.get("/health")
    def health(): return {"status": "ok"}
    return app


if __name__ == "__main__":
    logger.add("logs/app.log")
    app = create_app()
    uvicorn.run(app, host="0.0.0.0", port=8000)