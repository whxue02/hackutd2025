from google.cloud import firestore
import csv
import json
import os

db = firestore.Client(
    project="hackutd2025-477718",
    database="hackutd25"
)

# Add export function
def export_firestore_to_csv(output_path="backup.csv"):
    rows = []
    for col in db.collections():
        # Use .path if present, otherwise fall back to .id, otherwise a safe string fallback
        col_path = getattr(col, "path", None)
        if not col_path:
            col_path = getattr(col, "id", None)
        if not col_path:
            col_path = str(getattr(col, "_path", col))

        for doc in col.stream():
            try:
                data = doc.to_dict() or {}
            except Exception:
                data = {}
            rows.append({
                "collection_path": col_path,
                "document_id": doc.id,
                "data": json.dumps(data, default=str)
            })

    fieldnames = ["collection_path", "document_id", "data"]
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Exported {len(rows)} documents to {os.path.abspath(output_path)}")

if __name__ == "__main__":
    export_firestore_to_csv("backup.csv")
