import os
import re
import json
import requests
from typing import Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# ---------- CONFIG ----------
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY belum di-set di file .env")

MODEL_ID = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
LARAVEL_API_URL = os.getenv("LARAVEL_API_URL", "http://127.0.0.1:8000/api/v1")
LARAVEL_INTERNAL_KEY = os.getenv("LARAVEL_INTERNAL_KEY", "rahasia-antar-server")

client = genai.Client(api_key=API_KEY)
app = FastAPI(title="AI Microservice")

class ProcessRequest(BaseModel):
    material_id: int
    file_url: str
    mime_type: str

PROMPT = """Anda adalah seorang instruktur ahli dan desainer kurikulum.
Tugas: dari dokumen materi yang dilampirkan, buatkan LEARNING PATH yang terstruktur.
PENTING: Anda harus menuliskan MATERI LENGKAP untuk setiap sub-topik, bukan hanya daftar judul.
Materi harus ditulis dalam format Markdown.

ATURAN KETAT:
1. Gunakan HANYA informasi dari dokumen yang dilampirkan.
2. Bagi materi menjadi 3-5 Modul logis. Setiap Modul berisi 2-4 Topik.
3. Setiap Topik HARUS memiliki konten penjelasan (minimal 2 paragraf) di field `content`.
4. Estimasi waktu belajar per topik dalam menit.
5. Seluruh teks dalam Bahasa Indonesia.

Kembalikan HANYA JSON valid dengan skema:
{
  "title": "string",
  "summary": "string",
  "difficulty": "beginner" | "intermediate" | "advanced",
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
}
"""

JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "summary": {"type": "string"},
        "difficulty": {"type": "string", "enum": ["beginner", "intermediate", "advanced"]},
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
}

def strip_json_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()

# ==========================================
# FUNGSI BACKGROUND TASK (Dijalankan di belakang layar)
# ==========================================
def process_ai_pipeline(req: ProcessRequest):
    temp_path = f"temp_{req.material_id}.file"
    
    try:
        # 1. Download
        print(f"[BG-TASK] Mendownload file dari: {req.file_url}")
        file_response = requests.get(req.file_url, timeout=30)
        file_response.raise_for_status()
        
        with open(temp_path, "wb") as f:
            f.write(file_response.content)

        # 2. Upload ke Gemini
        print(f"[BG-TASK] Mengunggah ke Gemini...")
        uploaded_file = client.files.upload(
            file=temp_path,
            config={'mime_type': req.mime_type}
        )
        file_uri = uploaded_file.uri

    except Exception as e:
        print(f"[BG-TASK ERROR] Upload/Download: {e}")
        return
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # 3. Generate AI
    try:
        print(f"[BG-TASK] Memanggil Gemini ({MODEL_ID})...")
        interaction = client.interactions.create(
            model=MODEL_ID,
            input=[
                {"type": "text", "text": PROMPT},
                {"type": "document", "uri": file_uri, "mime_type": req.mime_type},
            ],
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": JSON_SCHEMA,
            },
            generation_config={"thinking_level": "low"},
        )
        
        raw = (interaction.output_text or "").strip()
        if not raw:
            print(f"[BG-TASK ERROR] Respons AI kosong")
            return
            
        learning_path = json.loads(strip_json_fence(raw))
    except Exception as e:
        print(f"[BG-TASK ERROR] Generate: {e}")
        return

    # 4. Kirim ke Laravel
    try:
        print(f"[BG-TASK] Mengirim hasil ke Laravel...")
        laravel_url = f"{LARAVEL_API_URL}/materials/{req.material_id}/learning-path"
        
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Internal-Key": LARAVEL_INTERNAL_KEY
        }
        
        laravel_res = requests.post(laravel_url, json=learning_path, headers=headers, timeout=60)
        laravel_res.raise_for_status()
        print(f"[BG-TASK] Sukses! Tersimpan di Laravel (ID: {req.material_id})")
        
    except Exception as e:
        print(f"[BG-TASK ERROR] Gagal kirim ke Laravel: {e}")

# ==========================================
# ENDPOINT UTAMA
# ==========================================
@app.post("/process-material")
async def process_material(req: ProcessRequest, background_tasks: BackgroundTasks):
    # Jalankan seluruh proses AI di background
    background_tasks.add_task(process_ai_pipeline, req)
    
    # Langsung balas Laravel dalam hitungan milidetik
    return {"status": "accepted", "message": "Processing started in background."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)