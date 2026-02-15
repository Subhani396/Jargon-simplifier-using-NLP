from fastapi import FastAPI
from schemas import TextInput
from model.gemini_service import generate_summary

app = FastAPI()


@app.post("/simplify-text")
async def simplify_text(data: TextInput):

    result = generate_summary(data.text)

    return result
