import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status
from app.core.config import get_settings


router = APIRouter()
settings = get_settings()

UPLOAD_DIR = Path(settings.MEDIA_UPLOAD_DIR)
PUBLIC_URL_PATH = settings.MEDIA_PUBLIC_URL_PATH.strip("/")
MAX_FILE_SIZE_BYTES = settings.MEDIA_MAX_FILE_SIZE_IN_BYTES
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
}


@router.post(
    "/upload", 
    status_code=status.HTTP_201_CREATED
)
async def upload_media(request: Request, file: UploadFile = File(...)) -> dict:
    """
    Upload a cafe logo image and return its public URL. Accepts JPEG, PNG, GIF, WebP, or SVG files up to 2 MB.
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Only image files (JPEG, PNG, GIF, WebP, SVG) are accepted.",
        )

    content = await file.read()

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="File size must not exceed 2 MB.",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    suffix = Path(file.filename or "").suffix.lower() or ".bin"
    filename = f"{uuid.uuid4()}{suffix}"
    (UPLOAD_DIR / filename).write_bytes(content)

    base_url = str(request.base_url).rstrip("/")
    return {"url": f"{base_url}/{PUBLIC_URL_PATH}/{filename}"}
