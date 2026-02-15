import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)


def generate_summary(text: str):

    # Improved prompt with strict jargon instructions
    prompt = f"""
Technical Update:
{text}

Instructions:

1. Extract ONLY true technical jargon terms:
   - Technologies (Redis, Kubernetes, TensorFlow, etc.)
   - Architectures (microservices architecture, event-driven architecture)
   - Systems, protocols, infrastructure terms

2. DO NOT include verbs like:
   - refactored
   - optimized
   - improved
   - enhanced

3. detected_jargon must only contain technical nouns and phrases.

4. Rewrite the update for non-technical business stakeholders.

5. Explain business impact clearly.

6. Assign realistic risk level:
   Low → safe optimization
   Medium → moderate change
   High → risky or breaking change

7. Estimate confidence_score between 0 and 1

8. Estimate complexity_reduction_percent between 0 and 100

Return valid structured JSON.
"""

    # Strict JSON schema
    schema = {
        "type": "object",
        "properties": {
            "technical_text": {"type": "string"},
            "detected_jargon": {
                "type": "array",
                "items": {"type": "string"}
            },
            "simple_explanation": {"type": "string"},
            "business_impact": {"type": "string"},
            "risk_level": {"type": "string"},
            "impact_category": {"type": "string"},
            "confidence_score": {"type": "number"},
            "complexity_reduction_percent": {"type": "number"}
        },
        "required": [
            "technical_text",
            "detected_jargon",
            "simple_explanation",
            "business_impact",
            "risk_level",
            "impact_category",
            "confidence_score",
            "complexity_reduction_percent"
        ]
    }

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
            response_schema=schema,
            max_output_tokens=800
        )
    )

    return response.parsed
