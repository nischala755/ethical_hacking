from __future__ import annotations

import argparse
import csv
import ipaddress
import re
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


SUSPICIOUS_WORDS = {
    "account",
    "bank",
    "confirm",
    "free",
    "gift",
    "login",
    "password",
    "prize",
    "secure",
    "signin",
    "support",
    "update",
    "verify",
    "wallet",
}

SHORTENERS = {
    "bit.ly",
    "cutt.ly",
    "goo.gl",
    "is.gd",
    "rebrand.ly",
    "shorturl.at",
    "t.co",
    "tinyurl.com",
}

POPULAR_BRANDS = {
    "amazon",
    "apple",
    "facebook",
    "google",
    "instagram",
    "microsoft",
    "netflix",
    "paypal",
    "whatsapp",
}


@dataclass(frozen=True)
class Finding:
    points: int
    message: str


def normalize_url(raw_url: str) -> str:
    raw_url = raw_url.strip()
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", raw_url):
        return f"http://{raw_url}"
    return raw_url


def host_without_www(hostname: str) -> str:
    return hostname.removeprefix("www.").lower()


def is_ip_address(hostname: str) -> bool:
    try:
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False


def deobfuscate_hostname(hostname: str) -> str:
    translation = str.maketrans({"0": "o", "1": "l", "3": "e", "5": "s", "7": "t"})
    return hostname.translate(translation)


def analyze_url(raw_url: str) -> tuple[int, str, list[Finding]]:
    url = normalize_url(raw_url)
    parsed = urlparse(url)
    hostname = host_without_www(parsed.hostname or "")
    path_and_query = f"{parsed.path}?{parsed.query}".lower()
    full_text = url.lower()
    findings: list[Finding] = []

    if parsed.scheme != "https":
        findings.append(Finding(15, "URL does not use HTTPS"))

    if "@" in parsed.netloc:
        findings.append(Finding(25, "URL contains @, which can hide the real destination"))

    hostname_is_ip = is_ip_address(hostname)
    if hostname_is_ip:
        findings.append(Finding(25, "Domain is an IP address instead of a readable name"))

    if not hostname_is_ip and hostname.count(".") >= 3:
        findings.append(Finding(10, "URL uses many subdomains"))

    if len(url) > 75:
        findings.append(Finding(10, "URL is unusually long"))

    if "-" in hostname:
        findings.append(Finding(8, "Domain contains hyphens"))

    if hostname in SHORTENERS:
        findings.append(Finding(18, "URL uses a link shortener"))

    suspicious_hits = sorted(word for word in SUSPICIOUS_WORDS if word in full_text)
    if suspicious_hits:
        words = ", ".join(suspicious_hits[:5])
        findings.append(Finding(min(20, len(suspicious_hits) * 5), f"Contains suspicious words: {words}"))

    readable_hostname = deobfuscate_hostname(hostname)
    brand_hits = [brand for brand in POPULAR_BRANDS if brand in readable_hostname]
    if brand_hits and not any(hostname.endswith(f"{brand}.com") for brand in brand_hits):
        findings.append(Finding(15, "Brand name appears in an unusual domain"))

    if re.search(r"%[0-9a-fA-F]{2}", path_and_query):
        findings.append(Finding(8, "URL contains encoded characters"))

    score = min(100, sum(finding.points for finding in findings))
    if score >= 50:
        risk = "High"
    elif score >= 25:
        risk = "Medium"
    else:
        risk = "Low"
    return score, risk, findings


def print_result(url: str) -> None:
    score, risk, findings = analyze_url(url)
    print(f"\nURL: {url}")
    print(f"Risk: {risk} ({score}/100)")
    if findings:
        print("Reasons:")
        for finding in findings:
            print(f"- +{finding.points}: {finding.message}")
    else:
        print("Reasons: No major phishing indicators found.")


def analyze_file(path: Path) -> None:
    with path.open(newline="", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)
        if "url" not in reader.fieldnames:
            raise SystemExit("CSV file must contain a 'url' column.")

        for row in reader:
            print_result(row["url"])


def main() -> None:
    parser = argparse.ArgumentParser(description="Simple phishing URL detection challenge tool.")
    parser.add_argument("--url", help="Analyze one URL")
    parser.add_argument("--file", type=Path, help="Analyze URLs from a CSV file with a url column")
    args = parser.parse_args()

    if not args.url and not args.file:
        parser.error("provide --url or --file")

    if args.url:
        print_result(args.url)

    if args.file:
        analyze_file(args.file)


if __name__ == "__main__":
    main()
