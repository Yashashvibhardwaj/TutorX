# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_logic import html_tutor_response, html_quiz, html_code_review

app = FastAPI(
    title="HTML Teaching AI Platform",
    description="API for AI-powered HTML learning and code help.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Set to your frontend domain in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    message: str


class QuizRequest(BaseModel):
    topic: str


class ReviewRequest(BaseModel):
    code: str


@app.get("/")
def read_root():
    return {"message": "Welcome to the AI HTML Teaching Platform!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/ask")
def ask_ai(query: AskRequest):
    """Answer HTML questions as a patient tutor."""
    try:
        response = html_tutor_response(query.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/quiz")
def quiz_ai(req: QuizRequest):
    """Generate an HTML quiz for the requested topic."""
    try:
        quiz = html_quiz(req.topic)
        return {"quiz": quiz}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/review")
def review_ai(req: ReviewRequest):
    """Review HTML code and suggest improvements."""
    try:
        review = html_code_review(req.code)
        return {"review": review}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
