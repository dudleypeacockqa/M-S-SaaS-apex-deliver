from pathlib import Path
bt = chr(96)
path = Path('docs/TECHNICAL_IMPLEMENTATION_GUIDE.md')
text = path.read_text()
start = text.index('### 2. Contact Pipeline')
end = text.index('### 3. Newsletter Opt-In')
new = (
    "### 2. Contact Pipeline\n"
    f"- **Build:** Implement {bt}/api/marketing/contact{bt} with validation + email/CRM notification. Wire the form to call the endpoint with optimistic UI feedback.\n"
    "- **Measure:** Record submission counts vs. network failures using logging middleware. Add Playwright coverage that verifies success + error states.\n"
    "- **Analyze:** Review error logs daily; ensure conversion funnels in analytics reflect successful submissions.\n"
    "- **Decide:** Keep feature behind temporary flag until QA verifies RED → GREEN cycles locally and in staging.\n\n"
)
path.write_text(text[:start] + new + text[end:])
