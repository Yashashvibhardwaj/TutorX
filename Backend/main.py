# backend/main.py

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import (
    hash_password, verify_password, create_access_token, decode_access_token,
    pwd_context, blacklist_token, is_token_blacklisted
)
from users_db import create_user, get_user
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

# =====================
# Auth & User Handling
# =====================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


class RegisterForm(BaseModel):
    username: str
    password: str
    role: str = "student"


@app.post("/register")
def register(form: RegisterForm):
    if get_user(form.username):
        raise HTTPException(
            status_code=400, detail="Username already registered.")
    password_hash = hash_password(form.password)
    create_user(form.username, password_hash, form.role)
    return {"message": "User registered successfully!"}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(
        data={"sub": form_data.username, "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme)):
    if is_token_blacklisted(token):
        raise HTTPException(
            status_code=401, detail="Token is blacklisted (user logged out)")
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    username = payload.get("sub")
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"username": username, "role": user["role"]}


def require_role(role: str):
    def role_checker(user=Depends(get_current_user)):
        if user["role"] != role:
            raise HTTPException(status_code=403, detail="Not authorized")
        return user
    return role_checker


@app.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    blacklist_token(token)
    return {"message": "Logged out successfully"}


@app.get("/me")
def read_me(user=Depends(get_current_user)):
    return user


@app.get("/admin-data")
def get_admin_data(user=Depends(require_role("admin"))):
    return {"secret": "This is admin-only data."}

# ============================
# AI Tutor Endpoints
# ============================


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
