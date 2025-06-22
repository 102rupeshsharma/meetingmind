import os
os.environ["XDG_CACHE_HOME"] = "/tmp"
os.environ["TRANSFORMERS_CACHE"] = "/tmp/hf_cache"
os.environ["HF_HOME"] = "/tmp/hf_cache"
os.environ["SENTENCE_TRANSFORMERS_HOME"] = "/tmp/hf_cache"

from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import whisper
from transformers import pipeline
from keybert import KeyBERT
import nltk

# ✅ Safe NLTK data directory
try:
    nltk_data_path = "/data/nltk_data"
    os.makedirs(nltk_data_path, exist_ok=True)
except PermissionError:
    nltk_data_path = "/tmp/nltk_data"
    os.makedirs(nltk_data_path, exist_ok=True)

nltk.download("punkt", download_dir=nltk_data_path, quiet=True)
nltk.data.path.append(nltk_data_path)

# ✅ Limit upload size
class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_upload_size: int):
        super().__init__(app)
        self.max_upload_size = max_upload_size

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_upload_size:
            return Response("❌ File too large. Max allowed is 30MB.", status_code=413)
        return await call_next(request)

# ✅ App setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LimitUploadSizeMiddleware, max_upload_size=30 * 1024 * 1024)

UPLOAD_FOLDER = "/tmp/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

whisper_model = whisper.load_model("base")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=False
)
kw_model = KeyBERT("all-MiniLM-L6-v2")

@app.get("/")
def home():
    return {"message": "Hugging Face Space running!"}

@app.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        transcription = transcribe_audio(file_path)
        summary = summarize_text(transcription)
        emotion = analyze_emotion(transcription)
        important_points = extract_key_points(transcription)

        return JSONResponse({
            "summary": summary,
            "emotion": emotion,
            "important_points": important_points
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse({"error": str(e)}, status_code=500)

def transcribe_audio(file_path: str) -> str:
    print("🎤 Starting transcription...")
    result = whisper_model.transcribe(file_path)
    print("✅ Transcription complete")
    return result.get("text", "")

def analyze_emotion(text: str) -> str:
    try:
        result = emotion_classifier(text[:512])[0]
        return f"{result['label']} ({round(result['score'] * 100)}%)"
    except Exception:
        return "Emotion analysis failed."

def summarize_text(text: str) -> str:
    if len(text.strip()) == 0:
        return "No content to summarize."

    chunks = [text[i:i+1024] for i in range(0, len(text), 1024)]
    summaries = []

    for chunk in chunks:
        summary = summarizer(chunk, max_length=120, min_length=30, do_sample=False)
        summaries.append(summary[0]["summary_text"])

    return " ".join(summaries)

def extract_key_points(text: str) -> list:
    try:
        keywords = kw_model.extract_keywords(
            text,
            keyphrase_ngram_range=(1, 2),
            stop_words="english",
            top_n=5
        )
        return [kw[0].capitalize() for kw in keywords]
    except Exception:
        return ["Could not extract key points"]
