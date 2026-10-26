import os
import re
import json
import requests
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# ---------- CONFIG ----------
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_ID = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
LARAVEL_API_URL = os.getenv("LARAVEL_API_URL", "http://127.0.0.1:8000/api/v1")
LARAVEL_INTERNAL_KEY = os.getenv("LARAVEL_INTERNAL_KEY", "rahasia-antar-server")

client = genai.Client(api_key=API_KEY)
app = FastAPI(title="AI Microservice")

class ProcessRequest(BaseModel):
    material_id: int
    file_url: str
    mime_type: str

# ---------- PROMPT LEBIH RINGKAS ----------
PROMPT_COMBINED = """Anda adalah instruktur ahli. Dari dokumen yang dilampirkan, buatkan Learning Path singkat beserta kuis.

ATURAN KETAT:
1. Gunakan HANYA informasi dari dokumen.
2. Buat maksimal 2 Modul. Setiap Modul berisi 2 Topik (total 4 Topik).
3. Setiap Topik: tulis 1 paragraf ringkas (maksimal 100 kata) dalam format Markdown.
4. Buat 3 soal pilihan ganda (A, B, C, D) beserta penjelasan singkat.
5. Seluruh teks Bahasa Indonesia.

Kembalikan HANYA JSON valid:
{
  "learning_path": {
    "title": "string",
    "summary": "string",
    "difficulty": "beginner",
    "modules": [
      {
        "order": number,
        "title": "string",
        "topics": [
          {
            "order": number,
            "title": "string",
            "content": "string",
            "estimated_minutes": number
          }
        ]
      }
    ]
  },
  "quiz": {
    "title": "string",
    "questions": [
      {
        "question_text": "string",
        "options": ["string", "string", "string", "string"],
        "correct_option": "A",
        "explanation": "string"
      }
    ]
  }
}
"""

JSON_SCHEMA_COMBINED = {
    "type": "object",
    "properties": {
        "learning_path": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "summary": {"type": "string"},
                "difficulty": {"type": "string"},
                "modules": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "order": {"type": "number"},
                            "title": {"type": "string"},
                            "topics": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "order": {"type": "number"},
                                        "title": {"type": "string"},
                                        "content": {"type": "string"},
                                        "estimated_minutes": {"type": "number"}
                                    },
                                    "required": ["order", "title", "content", "estimated_minutes"]
                                }
                            }
                        },
                        "required": ["order", "title", "topics"]
                    }
                }
            },
            "required": ["title", "summary", "difficulty", "modules"]
        },
        "quiz": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "question_text": {"type": "string"},
                            "options": {"type": "array", "items": {"type": "string"}},
                            "correct_option": {"type": "string"},
                            "explanation": {"type": "string"}
                        },
                        "required": ["question_text", "options", "correct_option", "explanation"]
                    }
                }
            },
            "required": ["title", "questions"]
        }
    },
    "required": ["learning_path", "quiz"]
}

def strip_json_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()

# ==========================================
# FUNGSI BACKGROUND TASK
# ==========================================
def process_ai_pipeline(req: ProcessRequest):
    temp_path = f"temp_{req.material_id}.file"
    
    try:
        print(f"[BG-TASK] Mendownload file...")
        file_response = requests.get(req.file_url, timeout=30)
        file_response.raise_for_status()
        with open(temp_path, "wb") as f:
            f.write(file_response.content)

        uploaded_file = client.files.upload(file=temp_path, config={'mime_type': req.mime_type})
        file_uri = uploaded_file.uri
    except Exception as e:
        print(f"[BG-TASK ERROR] Upload/Download: {e}")
        return
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)

    try:
        print(f"[BG-TASK] Memanggil Gemini ({MODEL_ID})...")
        interaction = client.interactions.create(
            model=MODEL_ID,
            input=[
                {"type": "text", "text": PROMPT_COMBINED},
                {"type": "document", "uri": file_uri, "mime_type": req.mime_type},
            ],
            response_format={"type": "text", "mime_type": "application/json", "schema": JSON_SCHEMA_COMBINED},
            generation_config={"thinking_level": "low"},
        )
        
        raw = (interaction.output_text or "").strip()
        result = json.loads(strip_json_fence(raw))
        
        learning_path = result.get("learning_path")
        quiz_data = result.get("quiz")
        
    except Exception as e:
        print(f"[BG-TASK ERROR] Generate AI: {e}")
        return

    try:
        print(f"[BG-TASK] Mengirim hasil ke Laravel...")
        laravel_url = f"{LARAVEL_API_URL}/materials/{req.material_id}/learning-path"
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Internal-Key": LARAVEL_INTERNAL_KEY
        }
        
        payload = {
            "learning_path": learning_path,
            "quiz": quiz_data
        }
        
        laravel_res = requests.post(laravel_url, json=payload, headers=headers, timeout=60)
        laravel_res.raise_for_status()
        print(f"[BG-TASK] Sukses! Tersimpan di Laravel (ID: {req.material_id})")
    except Exception as e:
        print(f"[BG-TASK ERROR] Gagal kirim ke Laravel: {e}")

@app.post("/process-material")
async def process_material(req: ProcessRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_ai_pipeline, req)
    return {"status": "accepted", "message": "Processing started in background."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)