import yfinance as yf

def test_indices():
    for sym in ["^NSEI", "^BSESN"]:
        print(f"Testing {sym}...")
        t = yf.Ticker(sym)
        h = t.history(period="5d")
        print(h)
        if not h.empty:
            print(f"Latest Close: {h['Close'].iloc[-1]}")
        else:
            print("History is EMPTY")

if __name__ == "__main__":
    test_indices()
