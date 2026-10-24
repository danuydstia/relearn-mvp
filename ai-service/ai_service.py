import os
import re
import json
import requests
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# ---------- CONFIG ----------
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY belum di-set di file .env")

# Gunakan model yang benar
MODEL_ID = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
LARAVEL_API_URL = os.getenv("LARAVEL_API_URL", "http://127.0.0.1:8000/api/v1")
LARAVEL_INTERNAL_KEY = os.getenv("LARAVEL_INTERNAL_KEY", "rahasia-antar-server")

client = genai.Client(api_key=API_KEY)
app = FastAPI(title="AI Microservice")

# Model untuk menerima data dari Laravel
class ProcessRequest(BaseModel):
    material_id: int
    file_url: str
    mime_type: str

# ---------- PROMPT ----------
PROMPT = """Anda adalah seorang instruktur ahli dan desainer kurikulum.
Tugas: dari dokumen materi yang dilampirkan, buatkan LEARNING PATH yang terstruktur.
PENTING: Anda harus menuliskan MATERI LENGKAP untuk setiap sub-topik, bukan hanya daftar judul.
Materi harus ditulis dalam format Markdown (gunakan **bold**, *italic*, `code`, dan list jika perlu).

ATURAN KETAT:
1. Gunakan HANYA informasi dari dokumen yang dilampirkan. Jangan mengarang fakta di luar dokumen.
2. Bagi materi menjadi 3-5 Modul logis. Setiap Modul berisi 2-4 Topik.
3. Setiap Topik HARUS memiliki konten penjelasan (minimal 2 paragraf) di field `content`.
4. Estimasi waktu belajar per topik dalam menit.
5. Seluruh teks dalam Bahasa Indonesia.

Kembalikan HANYA JSON valid (tanpa markdown pembungkus, tanpa penjelasan) dengan skema:
{
  "title": "string (Judul Course)",
  "summary": "string (Ringkasan course)",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "modules": [
    {
      "order": number,
      "title": "string (Judul Modul)",
      "topics": [
        {
          "order": number,
          "title": "string (Judul Topik)",
          "content": "string (Materi lengkap dalam format Markdown)",
          "estimated_minutes": number
        }
      ]
    }
  ]
}
"""

# Skema JSON untuk response_format (mengikuti format Interactions API)
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

# ---------- HELPERS ----------
def strip_json_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()

# ---------- ENDPOINT ----------
@app.post("/process-material")
async def process_material(req: ProcessRequest):
    temp_path = f"temp_{req.material_id}.file"
    
    try:
        # 1. Download file dari Supabase URL
        print(f"[INFO] Mendownload file dari: {req.file_url}")
        file_response = requests.get(req.file_url, timeout=30)
        file_response.raise_for_status()
        
        with open(temp_path, "wb") as f:
            f.write(file_response.content)

        # 2. Upload file ke Gemini Files API
        print(f"[INFO] Mengunggah ke Gemini Files API...")
        uploaded_file = client.files.upload(
            file=temp_path,
            config={'mime_type': req.mime_type}
        )
        file_uri = uploaded_file.uri
        print(f"[INFO] File berhasil diunggah ke Gemini: {file_uri}")

    except Exception as e:
        print(f"[ERROR UPLOAD/DOWNLOAD] {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Gagal memproses file: {e}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # 3. Panggil Gemini via Interactions API
    try:
        print(f"[INFO] Memanggil Gemini ({MODEL_ID}) via Interactions API...")
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
            generation_config={
                "thinking_level": "low",  # Mengurangi waktu tunggu
            },
        )
    except Exception as e:
        print(f"[ERROR GENERATE] {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini error: {e}")

    # 4. Ambil output dari interaction
    raw = (interaction.output_text or "").strip()
    if not raw:
        raise HTTPException(status_code=500, detail="Gemini mengembalikan respons kosong.")

    # 5. Parsing JSON
    try:
        learning_path = json.loads(strip_json_fence(raw))
    except json.JSONDecodeError as e:
        print(f"[ERROR JSON] Raw response: {raw[:500]}...")
        raise HTTPException(status_code=500, detail=f"JSON tidak valid dari model: {e}")

    # 6. Kirim hasil ke API Laravel
    try:
        print(f"[INFO] Mengirim hasil ke Laravel API...")
        laravel_url = f"{LARAVEL_API_URL}/materials/{req.material_id}/learning-path"
        
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Internal-Key": LARAVEL_INTERNAL_KEY
        }
        
        laravel_res = requests.post(laravel_url, json=learning_path, headers=headers, timeout=300)
        laravel_res.raise_for_status()
        
        print(f"[INFO] Sukses! Data tersimpan di Laravel (Material ID: {req.material_id})")
        
        return {
            "status": "success", 
            "message": "Learning path generated and saved to Laravel DB."
        }
    except Exception as e:
        print(f"[ERROR LARAVEL] {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Gagal mengirim ke Laravel: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)