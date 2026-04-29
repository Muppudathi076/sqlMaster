import requests
import json


def generate_question_metadata(question: str, difficulty: str):
    prompt = f"""
You are an SQL training data generator.

Question: {question}
Difficulty: {difficulty}

Generate valid JSON only in this exact format:
{{
  "answer": "SQL answer or theory answer",
  "schema": "CREATE TABLE statement if SQL question else empty string",
  "sample_data": []
}}

Rules:
- If theory question, keep schema="" and sample_data=[]
- If SQL question, create valid schema and realistic sample_data
- Return only JSON, no explanation
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "qwen2.5-coder",
            "prompt": prompt,
            "stream": False
        },
        timeout=60
    )

    result = response.json()
    ai_text = result.get("response", "").strip()

    try:
        return json.loads(ai_text)
    except json.JSONDecodeError:
        return {
            "answer": "",
            "schema": "",
            "sample_data": []
        }