# Generated Results

## Command Used

```bash
python phishing_detector.py --file sample_urls.csv
```

## Output

```text
URL: https://www.google.com/search?q=cybersecurity
Risk: Low (0/100)
Reasons: No major phishing indicators found.

URL: https://www.paypal.com/signin
Risk: Low (5/100)
Reasons:
- +5: Contains suspicious words: signin

URL: http://192.168.1.20/login
Risk: Medium (45/100)
Reasons:
- +15: URL does not use HTTPS
- +25: Domain is an IP address instead of a readable name
- +5: Contains suspicious words: login

URL: http://paypa1-secure-login.example.com/verify/account
Risk: High (58/100)
Reasons:
- +15: URL does not use HTTPS
- +8: Domain contains hyphens
- +20: Contains suspicious words: account, login, secure, verify
- +15: Brand name appears in an unusual domain

URL: https://bit.ly/free-gift-login
Risk: Medium (33/100)
Reasons:
- +18: URL uses a link shortener
- +15: Contains suspicious words: free, gift, login

URL: http://microsoft-support-update.example.net/password-reset
Risk: High (53/100)
Reasons:
- +15: URL does not use HTTPS
- +8: Domain contains hyphens
- +15: Contains suspicious words: password, support, update
- +15: Brand name appears in an unusual domain

URL: https://www.wikipedia.org/
Risk: Low (0/100)
Reasons: No major phishing indicators found.

URL: https://accounts.google.com/
Risk: Low (5/100)
Reasons:
- +5: Contains suspicious words: account
```

## Result Summary

| Risk Level | Count | URLs |
|---|---:|---|
| Low | 4 | Google search, PayPal signin, Wikipedia, Google accounts |
| Medium | 2 | IP-based login URL, shortened free-gift URL |
| High | 2 | PayPal-like fake URL, Microsoft support/update fake URL |

![Result summary chart](images/result_summary_chart.png)

## Generated Pictures

The following pictures are included for the report and presentation:

| Picture | Purpose |
|---|---|
| `images/project_workflow.png` | Shows the steps followed in the project |
| `images/phishing_url_warning_signs.png` | Explains suspicious parts of a phishing URL |
| `images/result_summary_chart.png` | Shows Low, Medium, and High result counts |
| `images/demo_terminal_output.png` | Shows the tool output in a terminal-style format |

## Interpretation

The highest-risk URLs contained multiple phishing indicators at the same time. For example, the PayPal-like sample used HTTP, suspicious words, hyphens, and brand imitation. The Microsoft-like sample also used HTTP, suspicious words, and an unusual domain containing a trusted brand name.

Low-risk URLs had fewer warning signs and used recognizable domains. However, the tool still gave small scores for terms like `signin` and `account` because these words are common in phishing attempts. This shows that phishing detection should consider multiple indicators together instead of depending on one keyword.

## Screenshots to Add

For your final submission, take these screenshots after running the project:

1. Terminal showing the command:
   `python phishing_detector.py --file sample_urls.csv`
2. Terminal showing Low, Medium, and High risk outputs.
3. The project folder showing `phishing_detector.py`, `sample_urls.csv`, `report.md`, and `results.md`.

## Limitations

- The tool checks URL structure only.
- It does not visit websites or inspect page content.
- It cannot confirm whether a website is truly malicious.
- Some legitimate URLs may contain words like `account` or `signin`.
- Real phishing detection should also include browser reputation checks, DNS checks, certificate inspection, email header analysis, and user awareness.

## Final Observation

The activity successfully demonstrates how phishing links can be identified using visible URL indicators. It is suitable for ethical hacking practice because it improves defensive awareness without attacking real systems.
