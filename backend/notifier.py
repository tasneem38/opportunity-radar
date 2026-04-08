"""
notifier.py — Opportunity Radar Alert Dispatcher
Channels:
  - Email via Resend (score >= 7)
  - WhatsApp via Twilio sandbox (score >= 9)
"""

import os
from loguru import logger  # type: ignore
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
    """Returns (subject, html_body) styled after the PRD's Sample Alert Card."""
    symbol   = signal.get("company_name", signal.get("stocks", {}).get("symbol", signal.get("stock_symbol", "UNKNOWN")))
    score    = signal.get("conviction_score", 0)
    summary  = signal.get("signal_summary", "")
    action   = signal.get("action_suggestion", "Review the signal on the dashboard.")
    sector   = signal.get("sector", "")
    metadata = signal.get("metadata", {})

    emoji = "🔴" if score >= 9 else "🟠" if score >= 7 else "🟡"
    sector_line = f"Sector: {sector}" if sector else ""

    # Build SIGNALS DETECTED from metadata fields
    signals_html = ""
    category = metadata.get("category", "") if metadata else ""
    sentiment = metadata.get("sentiment", "") if metadata else ""
    filing    = metadata.get("filing", "")   if metadata else ""
    severity  = metadata.get("severity", "") if metadata else ""

    if category:
        signals_html += f"<li style='margin-bottom:6px;'>📌 <b>Category:</b> {category}</li>"
    if sentiment:
        color = "#34d399" if "bull" in sentiment.lower() else "#f87171" if "bear" in sentiment.lower() else "#94a3b8"
        signals_html += f"<li style='margin-bottom:6px;'>📌 <b>Sentiment:</b> <span style='color:{color};'>{sentiment}</span></li>"
    if severity:
        signals_html += f"<li style='margin-bottom:6px;'>📌 <b>Severity:</b> {severity}/5</li>"
    if filing and filing != summary:
        short_filing = str(filing)
        if len(short_filing) > 120:
            short_filing = short_filing[0:120] + "..."  # type: ignore
        signals_html += f"<li style='margin-bottom:6px;'>📌 <b>Signal:</b> {short_filing}</li>"
    if not signals_html:
        signals_html = f"<li style='margin-bottom:6px;'>📌 {summary if summary else 'Material filing detected.'}</li>"

    subject = f"{emoji} Opportunity Radar: {symbol} — Score {score:.1f}/10"
    html = f"""
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 620px; margin: auto; padding: 0; background: #0f172a; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 28px 32px; border-bottom: 2px solid #334155;">
        <div style="font-size:13px; color:#64748b; text-transform:uppercase; letter-spacing:2px; margin-bottom:6px;">Opportunity Radar</div>
        <h1 style="margin:0; font-size:22px; color:#f8fafc;">{emoji} HIGH CONVICTION SIGNAL — {symbol}</h1>
        <div style="margin-top:8px; font-size:15px; color:#94a3b8;">Score: <span style='color:#34d399; font-weight:bold;'>{score:.1f}/10</span>&nbsp;&nbsp;|&nbsp;&nbsp;{sector_line}</div>
      </div>

      <!-- Signals Detected -->
      <div style="padding: 24px 32px; border-bottom: 1px solid #1e293b;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#64748b; margin-bottom:12px;">Signals Detected</div>
        <ul style="margin:0; padding-left:8px; list-style:none; color:#cbd5e1; font-size:14px; line-height:1.8;">
          {signals_html}
        </ul>
      </div>

      <!-- What This Means -->
      <div style="padding: 24px 32px; border-bottom: 1px solid #1e293b;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#64748b; margin-bottom:12px;">What This Means</div>
        <p style="margin:0; font-size:14px; color:#cbd5e1; line-height:1.7;">{summary if summary else action}</p>
      </div>

      <!-- Action -->
      <div style="padding: 24px 32px; border-bottom: 1px solid #1e293b;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#64748b; margin-bottom:12px;">Recommended Action</div>
        <p style="margin:0; font-size:14px; color:#f8fafc; font-weight:500;">{action}</p>
      </div>

      <!-- Footer -->
      <div style="padding: 16px 32px; background: #020617;">
        <p style="margin:0; font-size:11px; color:#475569;">⚠️ Not financial advice. Research before investing. | Opportunity Radar</p>
      </div>
    </div>
    """
    return subject, html


def send_email_alert(signal: dict) -> bool:
    """Send a signal alert via Resend email. Returns True on success."""
    if not RESEND_API_KEY or not ALERT_EMAIL:
        logger.warning("Email alert skipped: RESEND_API_KEY or ALERT_EMAIL not set.")
        return False

    try:
        import resend  # type: ignore
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
    """Returns a multi-section WhatsApp message matching the PRD's Alert Card format."""
    symbol   = signal.get("company_name", signal.get("stocks", {}).get("symbol", signal.get("stock_symbol", "UNKNOWN")))
    score    = signal.get("conviction_score", 0)
    summary  = signal.get("signal_summary", "")
    action   = signal.get("action_suggestion", "Review the dashboard.")
    metadata = signal.get("metadata", {})
    sector   = metadata.get("sector", "") if metadata else ""

    emoji = "🔴" if score >= 9 else "🟠" if score >= 7 else "🟡"

    # Build SIGNALS DETECTED from metadata fields
    category = metadata.get("category", "") if metadata else ""
    sentiment = metadata.get("sentiment", "") if metadata else ""
    filing    = metadata.get("filing", "")   if metadata else ""
    severity  = metadata.get("severity", "") if metadata else ""

    signals_lines = []
    if category:  signals_lines.append(f"  📌 Category: {category}")
    if sentiment: signals_lines.append(f"  📌 Sentiment: {sentiment}")
    if severity:  signals_lines.append(f"  📌 Severity: {severity}/5")
    if filing and filing != summary:
        short_filing = str(filing)
        if len(short_filing) > 100:
            short_filing = short_filing[0:100] + "..."  # type: ignore
        signals_lines.append(f"  📌 Signal: {short_filing}")
    if not signals_lines:
        signals_lines.append(f"  📌 {summary if summary else 'Material filing detected.'}")

    sector_line = f"Sector: {sector}  |  " if sector else ""
    signals_block = "\n".join(signals_lines)

    return (
        f"{emoji} *HIGH CONVICTION SIGNAL — {symbol}*\n"
        f"Score: *{score:.1f}/10*  |  {sector_line}Opportunity Radar\n\n"
        f"*SIGNALS DETECTED*\n"
        f"{signals_block}\n\n"
        f"*WHAT THIS MEANS*\n"
        f"{summary if summary else action}\n\n"
        f"*RECOMMENDED ACTION*\n"
        f"{action}\n\n"
        f"⚠️ Not financial advice. Research before investing."
    )


def send_whatsapp_alert(signal: dict) -> bool:
    """Send a WhatsApp message via Twilio REST API (no SDK needed). Returns True on success."""
    if not TWILIO_SID or not TWILIO_TOKEN or not ALERT_WHATSAPP:
        logger.warning("WhatsApp alert skipped: Twilio credentials or ALERT_WHATSAPP not set.")
        return False

    try:
        import httpx  # type: ignore

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
