from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET

base = Path(r"C:\Users\mwamb\Downloads\Kova 1\public\agreements")

for docx in sorted(base.glob("*.docx")):
    with zipfile.ZipFile(docx) as zf:
        xml = zf.read("word/document.xml")
    root = ET.fromstring(xml)
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs = []
    for p in root.findall(".//w:p", ns):
        texts = [t.text or "" for t in p.findall(".//w:t", ns)]
        text = "".join(texts).strip()
        if text:
            paragraphs.append(text)
    print(f"## {docx.name}")
    for para in paragraphs[:12]:
        print(para)
    print()
