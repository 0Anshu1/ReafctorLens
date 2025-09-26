import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

# Example: AI-powered code analysis using clustering

def analyze_code(code_snippets):
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(code_snippets)
    kmeans = KMeans(n_clusters=2, random_state=42)
    labels = kmeans.fit_predict(X)
    return labels.tolist()

if __name__ == "__main__":
    # Read code snippets from stdin as JSON array
    input_data = sys.stdin.read()
    code_snippets = json.loads(input_data)
    result = analyze_code(code_snippets)
    print(json.dumps({"labels": result}))
