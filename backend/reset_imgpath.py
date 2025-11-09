from google.cloud import firestore
import time

# Initialize Firestore client
db = firestore.Client(
    project="hackutd2025-477622",
    database="hackutd25"
)

def reset_all_img_paths():
    """Reset all img_path fields to empty string in Firestore"""
    
    cars_ref = db.collection("cars")
    docs = cars_ref.stream()
    
    count = 0
    batch = db.batch()
    batch_size = 0
    max_batch_size = 500  # Firestore batch limit
    
    print("Starting to reset img_path fields...")
    
    for doc in docs:
        # Add update to batch
        batch.update(doc.reference, {"img_path": ""})
        batch_size += 1
        count += 1
        
        # Commit batch when it reaches max size
        if batch_size >= max_batch_size:
            batch.commit()
            print(f"Committed batch of {batch_size} updates. Total so far: {count}")
            batch = db.batch()
            batch_size = 0
            time.sleep(0.5)  # Small delay to avoid rate limits
    
    # Commit any remaining updates
    if batch_size > 0:
        batch.commit()
        print(f"Committed final batch of {batch_size} updates.")
    
    print(f"\n✓ Successfully reset img_path for {count} cars")

if __name__ == "__main__":
    confirm = input("This will reset ALL img_path fields to blank. Continue? (yes/no): ")
    if confirm.lower() == "yes":
        reset_all_img_paths()
    else:
        print("Operation cancelled.")