# Phishing Website Detection Challenge

This mini project analyzes URLs for common phishing indicators without visiting the websites. It is safe for a classroom lab because it only checks URL structure and known warning signs.

## Why this topic was chosen

Phishing detection is medium difficulty: it includes real cybersecurity reasoning, but it does not require setting up DVWA, scanning networks, or attacking any system. It is easy to demonstrate, explain, and complete ethically.

## Files

- `phishing_detector.py` - Python tool that scores URLs as Low, Medium, or High risk.
- `sample_urls.csv` - Safe sample URLs for testing.
- `report.md` - Finished activity report.
- `presentation_outline.md` - Slide-by-slide presentation content.
- `results.md` - Generated tool output, result summary, limitations, and observations.
- `images/` - Ready-to-use pictures for the report and PPT.

## Pictures Included

- `images/project_workflow.png` - workflow diagram
- `images/phishing_url_warning_signs.png` - phishing URL warning-sign diagram
- `images/result_summary_chart.png` - result summary chart
- `images/demo_terminal_output.png` - terminal output screenshot-style image

## How to run

Analyze one URL:

```bash
python phishing_detector.py --url "http://paypa1-secure-login.example.com/verify/account"
```

Analyze the sample file:

```bash
python phishing_detector.py --file sample_urls.csv
```

## Detection checks used

- Missing HTTPS
- IP address used as the domain
- Link shortener usage
- Too many subdomains
- Suspicious words such as `login`, `verify`, `password`, and `free`
- Popular brand names in unusual domains
- Long URLs, hyphens, `@` symbols, and encoded characters

## Ethical note

This project is for awareness and defensive learning only. It does not collect credentials, host fake login pages, bypass security controls, or attack real websites.
