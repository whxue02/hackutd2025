# rag_engine.py
from sentence_transformers import SentenceTransformer
import chromadb
import google.generativeai as genai
import pandas as pd
import pickle
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.Client()

VECTORS_PKL = "data/car_vectors.pkl"

# Load and embed your data once (at startup)
def load_data():
    # Check if vectors are already saved
    if os.path.exists(VECTORS_PKL):
        print("Loading pre-computed vectors from pickle file...")
        with open(VECTORS_PKL, "rb") as f:
            data = pickle.load(f)
            texts = data["texts"]
            embeddings = data["embeddings"]
            hack_ids = data["hack_ids"]
    else:
        print("Computing vectors for the first time...")
        df = pd.read_csv("data/car_data_processed.csv")
        
        # Create rich text descriptions for each car
        texts = []
        hack_ids = []
        for _, row in df.iterrows():
            text = (
                f"{row['hack-id']} is from year {row['year']} with an estimated current cost of "
                f"${row['estimated_current_cost']:.2f}. It is estimated that in 2027 the cost will be "
                f"${row['expected_value_2027']:.2f}. It has {row['seats']} seats. It is a {row['type']} "
                f"type of car. This is a {row['make']} {row['model']} {row['trim']}. "
                f"It has a {row['engine_type']} engine with {row['cylinders']} cylinders, "
                f"{row['horsepower_hp']} horsepower, and gets {row['combined_mpg']} MPG combined. "
                f"The MSRP is ${row['msrp']:.2f}."
            )
            texts.append(text)
            hack_ids.append(row['hack-id'])
        
        # Embed all the text descriptions
        embeddings = embedder.encode(texts)
        
        # Save vectors to pickle file
        with open(VECTORS_PKL, "wb") as f:
            pickle.dump({"texts": texts, "embeddings": embeddings, "hack_ids": hack_ids}, f)
        print(f"Vectors saved to {VECTORS_PKL}")
    
    # Create collection and add to ChromaDB with metadata
    collection = chroma_client.create_collection("cars")
    collection.add(
        ids=[str(i) for i in range(len(texts))],
        documents=texts,
        embeddings=embeddings.tolist(),
        metadatas=[{"hack_id": hack_id} for hack_id in hack_ids]
    )
    
    return collection

collection = load_data()  # preload data at app start

def query_rag(question):
    query_emb = embedder.encode([question])
    results = collection.query(query_embeddings=query_emb.tolist(), n_results=5)
    
    # Extract context and hack_ids from results
    context = "\n\n".join(results["documents"][0])
    hack_ids = [meta["hack_id"] for meta in results["metadatas"][0]]

    prompt = f"""
    You are a car expert helping users choose Toyota vehicles.
    Use the following context to answer:
    
    {context}

    Question: {question}
    Answer in a helpful, clear way.
    """

    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    response = model.generate_content(prompt)
    
    return {
        "answer": response.text,
        "hack_ids": hack_ids,
        "descriptions": results["documents"][0]
    }