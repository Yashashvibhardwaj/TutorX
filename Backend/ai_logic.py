# backend/ai_logic.py

from transformers import pipeline

# Load once, globally (on first run this will download the model, may take 1-2 minutes)
generator = pipeline(
    "text2text-generation",
    model="MBZUAI/LaMini-Flan-T5-783M",
    max_length=384,
    do_sample=True,
    temperature=0.7
)


def html_tutor_response(user_query: str) -> str:
    prompt = (
        "You are a friendly and patient HTML tutor for beginners. "
        "Explain HTML concepts clearly, provide examples, and answer questions simply. "
        "If the user asks for code, give well-commented sample HTML. "
        "If asked about errors, explain fixes step-by-step.\n\n"
        f"Question: {user_query}\n\nAnswer:"
    )
    try:
        result = generator(prompt)
        return result[0]['generated_text'].strip()
    except Exception as e:
        return f"Sorry, an error occurred: {str(e)}"


def html_quiz(topic: str) -> str:
    prompt = (
        "You are an HTML tutor. Generate a 5-question multiple-choice quiz for beginners "
        "on the following topic. Each question should have 4 options (A, B, C, D) and indicate the correct answer. "
        "Format your output as JSON with 'questions', each containing 'question', 'options', and 'answer'.\n\n"
        f"Topic: {topic}\n\nQuiz:"
    )
    try:
        result = generator(prompt)
        return result[0]['generated_text'].strip()
    except Exception as e:
        return f"Sorry, an error occurred: {str(e)}"


def html_code_review(code: str) -> str:
    prompt = (
        "You are an expert HTML teacher. Review the following HTML code for errors and improvements. "
        "Explain any mistakes and suggest corrections in simple terms.\n\n"
        f"Code:\n{code}\n\nReview:"
    )
    try:
        result = generator(prompt)
        return result[0]['generated_text'].strip()
    except Exception as e:
        return f"Sorry, an error occurred: {str(e)}"
