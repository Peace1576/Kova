from __future__ import annotations

import hashlib
import json
from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET


ROOT = Path(r"C:\Users\mwamb\Downloads\Kova 1")
AGREEMENTS_DIR = ROOT / "public" / "agreements"
OUTPUT = ROOT / "server" / "data" / "agreement-manifest.json"

DOCS = [
    {
        "slug": "kova-lpoa-v2-1-0",
        "file_name": "kova_lpoa_v2.1.0.docx",
    },
    {
        "slug": "kova-terms-of-service-v1-0-0",
        "file_name": "kova_terms_of_service_v1.0.0.docx",
    },
    {
        "slug": "kova-privacy-policy-v1-0-0",
        "file_name": "kova_privacy_policy_v1.0.0.docx",
    },
    {
        "slug": "kova-beta-nda-v1-0-0",
        "file_name": "kova_beta_nda_v1.0.0.docx",
    },
]

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def extract_text(docx_path: Path) -> list[str]:
    with zipfile.ZipFile(docx_path) as zf:
        xml = zf.read("word/document.xml")
    root = ET.fromstring(xml)
    paragraphs: list[str] = []
    for paragraph in root.findall(".//w:p", NS):
        parts = [text.text or "" for text in paragraph.findall(".//w:t", NS)]
        value = "".join(parts).strip()
        if value:
            paragraphs.append(value)
    return paragraphs


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict[str, object]] = {}

    for doc in DOCS:
        path = AGREEMENTS_DIR / doc["file_name"]
        raw = path.read_bytes()
        paragraphs = extract_text(path)
        stem = Path(doc["file_name"]).stem
        version = stem.split("_v")[-1] if "_v" in stem else "unknown"
        manifest[doc["slug"]] = {
            "slug": doc["slug"],
            "fileName": doc["file_name"],
            "version": f"v{version}" if not version.startswith("v") else version,
            "checksum": hashlib.sha256(raw).hexdigest(),
            "acceptedText": "\n\n".join(paragraphs),
            "paragraphs": paragraphs,
            "wordCount": sum(len(paragraph.split()) for paragraph in paragraphs),
        }

    OUTPUT.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
