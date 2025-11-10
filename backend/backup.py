import argparse
import csv
import json
from typing import Any, Dict, List

def _convert_value(val: str) -> Any:
    """Try to convert string to int, float, bool, or None; otherwise return original string."""
    if val is None:
        return None
    v = val.strip()
    if v == "":
        return None
    low = v.lower()
    if low in {"true", "false"}:
        return low == "true"
    # int
    try:
        return int(v)
    except ValueError:
        pass
    # float
    try:
        return float(v)
    except ValueError:
        pass
    return v

def csv_to_json(input_path: str, output_path: str) -> None:
    """Read CSV and write JSON array of objects."""
    rows: List[Dict[str, Any]] = []
    # handle possible BOM with utf-8-sig
    with open(input_path, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for r in reader:
            converted = {k: _convert_value(v) for k, v in r.items()}
            rows.append(converted)
    with open(output_path, "w", encoding="utf-8") as out:
        json.dump(rows, out, ensure_ascii=False, indent=2)

def main():
    parser = argparse.ArgumentParser(description="Convert a CSV backup to JSON.")
    parser.add_argument(
        "-i", "--input", default="backup.csv",
        help="Path to input CSV file (default: backup.csv)"
    )
    parser.add_argument(
        "-o", "--output", default="backup.json",
        help="Path to output JSON file (default: backup.json)"
    )
    args = parser.parse_args()
    csv_to_json(args.input, args.output)

if __name__ == "__main__":
    main()
