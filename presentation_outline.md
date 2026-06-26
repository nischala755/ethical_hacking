# Presentation Outline

## Slide 1: Title

Phishing Website Detection Challenge

## Slide 2: Aim

To identify phishing indicators in suspicious URLs and recommend safety measures using a controlled, ethical cybersecurity activity.

## Slide 3: Why We Chose This Task

- Medium difficulty
- Easy to implement
- No need to attack or scan real systems
- Very relevant to real-world cybersecurity

## Slide 4: Scenario

An organization wants to train employees to detect phishing links before clicking them. We analyze sample URLs and classify them based on risk.

Picture to add: `images/project_workflow.png`

## Slide 5: Tool Used

- Python 3
- Custom script: `phishing_detector.py`
- Sample URL file: `sample_urls.csv`

## Slide 6: Detection Indicators

- Missing HTTPS
- IP address as domain
- Link shorteners
- Suspicious words
- Brand names in unusual domains
- Long URLs
- Many subdomains
- `@` symbol or encoded characters

Picture to add: `images/phishing_url_warning_signs.png`

## Slide 7: Demonstration

Command:

```bash
python phishing_detector.py --file sample_urls.csv
```

The tool displays each URL, its risk level, score, and reasons.

Picture to add: `images/demo_terminal_output.png`

## Slide 8: Sample Result

Example:

`http://paypa1-secure-login.example.com/verify/account`

Risk: High, 58/100

Reasons:

- Does not use HTTPS
- Contains suspicious words
- Uses brand-like text in an unusual domain
- Contains hyphens in the domain

## Slide 9: Generated Results

| Risk | Count |
|---|---:|
| Low | 4 |
| Medium | 2 |
| High | 2 |

Total URLs tested: 8

Picture to add: `images/result_summary_chart.png`

## Slide 10: Result Analysis

- High-risk URLs had multiple suspicious indicators.
- Medium-risk URLs had warning signs such as IP address domains or link shorteners.
- Low-risk URLs had no major indicators or only one minor keyword.
- Final judgment should consider multiple clues together.

## Slide 11: Risks Identified

- Credential theft
- Fake login pages
- Malware delivery
- Financial fraud
- Account takeover

## Slide 12: Countermeasures

- Verify domain names
- Avoid unknown shortened links
- Use MFA
- Use email filtering
- Train users regularly
- Report suspicious messages

## Slide 13: Limitations

- URL structure analysis only
- Does not open websites
- Does not confirm live malicious activity
- Legitimate URLs may contain words like account or signin

## Slide 14: Ethical Considerations

This activity uses safe sample URLs only. It does not collect credentials, host fake pages, or attack real websites.

## Slide 15: Conclusion

Phishing is common and dangerous, but users can reduce risk by checking URLs carefully and following basic security practices.
