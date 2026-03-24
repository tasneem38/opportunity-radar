"""
notifier.py — Opportunity Radar Alert Dispatcher
Channels:
  - Email via Resend (score >= 7)
  - WhatsApp via Twilio sandbox (score >= 9)
"""

import os
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY     = os.getenv("RESEND_API_KEY")
TWILIO_SID         = os.getenv("TWILIO_SID")
TWILIO_TOKEN       = os.getenv("TWILIO_TOKEN")
TWILIO_FROM        = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")
ALERT_EMAIL        = os.getenv("ALERT_EMAIL", "")
ALERT_WHATSAPP     = os.getenv("ALERT_WHATSAPP", "")

EMAIL_THRESHOLD      = 7.0
WHATSAPP_THRESHOLD   = 9.0


def _format_alert_email(signal: dict) -> tuple[str, str]:
    """Returns (subject, html_body) for the signal."""
    symbol  = signal.get("stocks", {}).get("symbol", "UNKNOWN") if signal.get("stocks") else signal.get("stock_symbol", "UNKNOWN")
    score   = signal.get("conviction_score", 0)
    summary = signal.get("signal_summary", "No summary available.")
    action  = signal.get("action_suggestion", "Review the signal on the dashboard.")

    emoji = "🔴" if score >= 9 else "🟠" if score >= 7 else "🟡"

    subject = f"{emoji} Opportunity Radar Alert: {symbol} — Score {score:.1f}/10"
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
      <h2 style="color: #38bdf8;">{emoji} High Conviction Signal Detected</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
        <tr><td style="padding:8px 0; color:#94a3b8;">Symbol</td><td style="font-weight:bold; color:#f8fafc;">{symbol}</td></tr>
        <tr><td style="padding:8px 0; color:#94a3b8;">Conviction Score</td><td style="font-weight:bold; color:#34d399;">{score:.1f} / 10</td></tr>
      </table>
      <p style="background:#1e293b; padding:16px; border-radius:8px; color:#cbd5e1;">{summary}</p>
      <h3 style="color:#f59e0b;">Recommended Action</h3>
      <p style="color:#e2e8f0;">{action}</p>
      <hr style="border-color:#334155; margin:24px 0;" />
      <p style="font-size:11px; color:#475569;">⚠️ Not financial advice. Always do your own research before investing.<br/>
      Opportunity Radar — ET Gen AI Hackathon 2026</p>
    </div>
    """
    return subject, html


def send_email_alert(signal: dict) -> bool:
    """Send a signal alert via Resend email. Returns True on success."""
    if not RESEND_API_KEY or not ALERT_EMAIL:
        logger.warning("Email alert skipped: RESEND_API_KEY or ALERT_EMAIL not set.")
        return False

    try:
        import resend
        resend.api_key = RESEND_API_KEY

        subject, html_body = _format_alert_email(signal)

        resp = resend.Emails.send({
            "from": "Opportunity Radar <onboarding@resend.dev>",
            "to": [ALERT_EMAIL],
            "subject": subject,
            "html": html_body,
        })
        logger.info(f"Email alert sent for signal (ID: {resp})")
        return True
    except ImportError:
        logger.error("Email alert failed: 'resend' package not installed. Run: pip install resend")
        return False
    except Exception as e:
        logger.error(f"Email alert failed: {e}")
        return False


def _format_whatsapp_message(signal: dict) -> str:
    """Returns a 3-line WhatsApp summary string."""
    symbol  = signal.get("stocks", {}).get("symbol", "UNKNOWN") if signal.get("stocks") else signal.get("stock_symbol", "UNKNOWN")
    score   = signal.get("conviction_score", 0)
    action  = signal.get("action_suggestion", "Review the dashboard.")

    return (
        f"🔴 *OPPORTUNITY RADAR — HIGH CONVICTION ALERT*\n"
        f"*{symbol}* | Score: {score:.1f}/10\n"
        f"{action}\n\n"
        f"⚠️ Not financial advice."
    )


def send_whatsapp_alert(signal: dict) -> bool:
    """Send a WhatsApp message via Twilio REST API (no SDK needed). Returns True on success."""
    if not TWILIO_SID or not TWILIO_TOKEN or not ALERT_WHATSAPP:
        logger.warning("WhatsApp alert skipped: Twilio credentials or ALERT_WHATSAPP not set.")
        return False

    try:
        import httpx

        body = _format_whatsapp_message(signal)
        url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_SID}/Messages.json"

        resp = httpx.post(
            url,
            auth=(TWILIO_SID, TWILIO_TOKEN),
            data={"From": TWILIO_FROM, "To": ALERT_WHATSAPP, "Body": body},
            timeout=10
        )
        resp.raise_for_status()
        sid = resp.json().get("sid", "unknown")
        logger.info(f"WhatsApp alert sent: SID={sid}")
        return True
    except Exception as e:
        logger.error(f"WhatsApp alert failed: {e}")
        return False



def dispatch_alert(signal: dict):
    """
    Entry point for the orchestrator.
    Dispatches email and/or WhatsApp based on conviction score thresholds.
    
    PRD §7.3:
      - Dashboard:  all signals >= 6 (handled by Supabase + React)
      - Email:      score >= 7
      - WhatsApp:   score >= 9
    """
    score = float(signal.get("conviction_score", 0))

    if score >= EMAIL_THRESHOLD:
        send_email_alert(signal)

    if score >= WHATSAPP_THRESHOLD:
        send_whatsapp_alert(signal)
