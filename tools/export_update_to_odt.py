from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from odf.opendocument import OpenDocumentText
from odf.style import FontFace, ParagraphProperties, Style, TextProperties
from odf.text import H, LineBreak, P


TEXT_EXTENSIONS = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".css",
    ".scss",
    ".html",
    ".json",
    ".md",
    ".txt",
    ".yml",
    ".yaml",
    ".env",
    ".gitignore",
    ".eslintrc",
    ".babelrc",
    ".config",
}


def _is_probably_minified(path: Path) -> bool:
    name = path.name.lower()
    return name.endswith(".min.js") or name.endswith(".min.css") or ".min." in name


def _should_skip(rel_path_posix: str) -> bool:
    parts = rel_path_posix.split("/")
    if any(p in {"node_modules", ".next", ".git", "dist", "build", "out"} for p in parts):
        return True
    # Don't embed large vendored assets (still keep main source files)
    if rel_path_posix.startswith("public/assets/js/") and rel_path_posix != "public/assets/js/main.js":
        return True
    if rel_path_posix.startswith("public/assets/css/") and rel_path_posix != "public/assets/css/main.css":
        return True
    return False


@dataclass(frozen=True)
class FileEntry:
    abs_path: Path
    rel_posix: str
    size_bytes: int


def iter_code_files(root: Path, max_file_kb: int) -> Iterable[FileEntry]:
    max_bytes = max_file_kb * 1024
    for abs_path in root.rglob("*"):
        if not abs_path.is_file():
            continue

        rel_posix = abs_path.relative_to(root).as_posix()
        if _should_skip(rel_posix):
            continue

        if _is_probably_minified(abs_path):
            continue

        suffix = abs_path.suffix.lower()
        if suffix not in TEXT_EXTENSIONS and abs_path.name not in {"package.json", "next.config.js"}:
            continue

        try:
            size = abs_path.stat().st_size
        except OSError:
            continue

        if size > max_bytes:
            continue

        yield FileEntry(abs_path=abs_path, rel_posix=rel_posix, size_bytes=size)


def read_text_safely(path: Path) -> str:
    # Prefer UTF-8, fall back to system default.
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""


def build_document(title: str) -> OpenDocumentText:
    doc = OpenDocumentText()

    # Font
    doc.fontfacedecls.addElement(FontFace(name="Consolas", fontfamily="Consolas", fontpitch="fixed"))

    # Styles
    h1 = Style(name="Heading1", family="paragraph")
    h1.addElement(TextProperties(attributes={"fontsize": "18pt", "fontweight": "bold"}))
    doc.styles.addElement(h1)

    file_heading = Style(name="FileHeading", family="paragraph")
    file_heading.addElement(TextProperties(attributes={"fontsize": "12pt", "fontweight": "bold"}))
    file_heading.addElement(ParagraphProperties(marginbottom="2mm", margintop="4mm"))
    doc.styles.addElement(file_heading)

    code_style = Style(name="CodeBlock", family="paragraph")
    code_style.addElement(TextProperties(fontname="Consolas", fontsize="9pt"))
    code_style.addElement(ParagraphProperties(marginleft="3mm", marginright="3mm"))
    doc.styles.addElement(code_style)

    meta_style = Style(name="Meta", family="paragraph")
    meta_style.addElement(TextProperties(attributes={"fontsize": "9pt", "color": "#555555"}))
    doc.styles.addElement(meta_style)

    # Title
    doc.text.addElement(H(outlinelevel=1, stylename=h1, text=title))
    doc.text.addElement(P(stylename=meta_style, text="Generated from the `update/` folder."))
    return doc


def add_file(doc: OpenDocumentText, entry: FileEntry) -> None:
    doc.text.addElement(P(stylename="FileHeading", text=entry.rel_posix))
    doc.text.addElement(P(stylename="Meta", text=f"{entry.size_bytes} bytes"))
    content = read_text_safely(entry.abs_path)
    # ODFPy doesn't always ship a dedicated preformatted element; emulate it
    # with an explicit sequence of line breaks inside a monospace paragraph.
    p = P(stylename="CodeBlock")
    lines = content.splitlines()
    if not lines:
        lines = [""]
    for i, line in enumerate(lines):
        if i > 0:
            p.addElement(LineBreak())
        p.addText(line)
    doc.text.addElement(p)


def main() -> int:
    parser = argparse.ArgumentParser(description="Export `update/` code to a single .odt (ODF) document.")
    parser.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parents[1]),
        help="Path to the `update` folder (default: auto-detected).",
    )
    parser.add_argument(
        "--out",
        default=str(Path.cwd() / "update-code.odt"),
        help="Output .odt path (default: ./update-code.odt).",
    )
    parser.add_argument("--title", default="update/ source code", help="Document title.")
    parser.add_argument("--max-file-kb", type=int, default=256, help="Skip files larger than this size.")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out_path = Path(args.out).resolve()

    if not root.exists() or not root.is_dir():
        raise SystemExit(f"Root folder not found: {root}")

    entries = sorted(iter_code_files(root, max_file_kb=args.max_file_kb), key=lambda e: e.rel_posix.lower())

    doc = build_document(args.title)
    doc.text.addElement(P(stylename="Meta", text=f"Files included: {len(entries)}"))

    for entry in entries:
        add_file(doc, entry)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out_path), addsuffix=False)
    print(f"Wrote: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
