# python
import csv
import argparse
import time
import os
import sys
import requests

DEFAULT_FILE = os.path.join("data", "car_data_processed.csv")
DEFAULT_URL = "http://127.0.0.1:5001/data/cars"


def post_row(url: str, row: dict, retries: int = 3, timeout: float = 5.0) -> requests.Response:
    last_exc = None
    for attempt in range(1, retries + 1):
        try:
            resp = requests.post(url, json=row, timeout=timeout)
            return resp
        except requests.RequestException as exc:
            last_exc = exc
            time.sleep(2 ** (attempt - 1))
    raise last_exc


def main():
    parser = argparse.ArgumentParser(description="Upload CSV rows as JSON to an API.")
    parser.add_argument("--file", "-f", default=DEFAULT_FILE, help="Path to CSV file")
    parser.add_argument("--url", "-u", default=DEFAULT_URL, help="Destination POST URL")
    parser.add_argument("--retries", "-r", type=int, default=3, help="Retries per row on failure")
    args = parser.parse_args()

    if not os.path.isfile(args.file):
        print(f"CSV file not found: {args.file}", file=sys.stderr)
        sys.exit(1)

    with open(args.file, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        if reader.fieldnames is None:
            print("CSV has no header row.", file=sys.stderr)
            sys.exit(1)

        for i, row in enumerate(reader, start=1):
            # skip empty rows
            if not any(v.strip() if isinstance(v, str) else v for v in row.values()):
                continue
            try:
                resp = post_row(args.url, row, retries=args.retries)
            except Exception as e:
                print(f"Row {i}: ERROR - Exception while posting: {e}", file=sys.stderr)
                sys.exit(1)

            if resp is None:
                print(f"Row {i}: ERROR - No response returned from server.", file=sys.stderr)
                sys.exit(1)

            if not resp.ok:
                body = ""
                try:
                    body = resp.text
                except Exception:
                    body = "<could not read response body>"
                print(f"Row {i}: FAIL - HTTP {resp.status_code}. Response: {body}", file=sys.stderr)
                sys.exit(1)

            print(f"Row {i}: OK ({resp.status_code})")


if __name__ == "__main__":
    main()