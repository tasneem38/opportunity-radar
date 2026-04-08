-- OPPORTUNITY RADAR SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- 1. Stocks Table
CREATE TABLE IF NOT EXISTS stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(100) UNIQUE NOT NULL,
    company_name VARCHAR(200),

    market_cap BIGINT,
    sector VARCHAR(100),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Raw Events Table
CREATE TABLE IF NOT EXISTS raw_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID REFERENCES stocks(id),
    event_type VARCHAR(50),   -- filing | bulk_deal | insider | results | sentiment | regulatory
    raw_data JSONB,
    source VARCHAR(100),
    event_date TIMESTAMPTZ,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Agent Outputs Table
CREATE TABLE IF NOT EXISTS agent_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID REFERENCES stocks(id),
    agent_name VARCHAR(100),
    signal_type VARCHAR(100),   -- bullish | bearish | neutral | watch
    signal_detail TEXT,
    confidence FLOAT,
    raw_event_id UUID REFERENCES raw_events(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Signals Table
CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID REFERENCES stocks(id),
    conviction_score FLOAT,
    signal_summary TEXT,
    contributing_agents JSONB,
    action_suggestion TEXT,
    historical_context TEXT,
    alerted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Alert Log Table
CREATE TABLE IF NOT EXISTS alert_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id UUID REFERENCES signals(id),
    channel VARCHAR(50),
    recipient VARCHAR(200),
    delivered_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(100)
);


-- 6. Watchlist Table
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID REFERENCES stocks(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(stock_id)
);