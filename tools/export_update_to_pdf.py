from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas


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
        if _should_skip(rel_posix) or _is_probably_minified(abs_path):
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
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""


def _register_monospace_font() -> str:
    # Try to register Consolas on Windows; fall back to Courier.
    candidates = [
        Path(r"C:\Windows\Fonts\consola.ttf"),
        Path(r"C:\Windows\Fonts\CONSOLA.TTF"),
    ]
    for p in candidates:
        if p.exists():
            pdfmetrics.registerFont(TTFont("Consolas", str(p)))
            return "Consolas"
    return "Courier"


class PdfWriter:
    def __init__(self, out_path: Path, title: str):
        self.out_path = out_path
        self.title = title
        self.page_w, self.page_h = A4
        self.margin_l = 14 * mm
        self.margin_r = 14 * mm
        self.margin_t = 14 * mm
        self.margin_b = 14 * mm
        self.y = self.page_h - self.margin_t
        self.canvas = Canvas(str(out_path), pagesize=A4)
        self.canvas.setTitle(title)

        self.font_mono = _register_monospace_font()
        self.font_ui = "Helvetica"

        self.size_title = 16
        self.size_file = 11
        self.size_meta = 8.5
        self.size_code = 8.2

        self.leading_code = self.size_code * 1.25
        self.leading_ui = 12

        self.page_num = 0
        self._new_page()

    def _new_page(self) -> None:
        if self.page_num > 0:
            self.canvas.showPage()
        self.page_num += 1
        self.y = self.page_h - self.margin_t

        # Header
        self.canvas.setFont(self.font_ui, 8)
        self.canvas.setFillGray(0.35)
        self.canvas.drawString(self.margin_l, self.page_h - (8 * mm), self.title)
        self.canvas.drawRightString(self.page_w - self.margin_r, self.page_h - (8 * mm), f"Page {self.page_num}")
        self.canvas.setFillGray(0.0)

    def _ensure_space(self, needed_height: float) -> None:
        if self.y - needed_height < self.margin_b:
            self._new_page()

    def draw_title_block(self, subtitle: str) -> None:
        self._ensure_space(40)
        self.canvas.setFont(self.font_ui, self.size_title)
        self.canvas.drawString(self.margin_l, self.y, self.title)
        self.y -= 18
        self.canvas.setFont(self.font_ui, 10)
        self.canvas.setFillGray(0.35)
        self.canvas.drawString(self.margin_l, self.y, subtitle)
        self.canvas.setFillGray(0.0)
        self.y -= 18

    def draw_file_heading(self, rel_path: str, meta: str) -> None:
        self._ensure_space(28)
        self.canvas.setFont(self.font_ui, self.size_file)
        self.canvas.setFillGray(0.0)
        self.canvas.drawString(self.margin_l, self.y, rel_path)
        self.y -= 12
        self.canvas.setFont(self.font_ui, self.size_meta)
        self.canvas.setFillGray(0.35)
        self.canvas.drawString(self.margin_l, self.y, meta)
        self.canvas.setFillGray(0.0)
        self.y -= 10

    def draw_code(self, text: str) -> None:
        # Slightly indented code block
        x = self.margin_l + (3 * mm)
        max_w = self.page_w - self.margin_r - x
        self.canvas.setFont(self.font_mono, self.size_code)

        # Wrap long lines by character count (monospace approximation)
        # Estimate chars per line from font size and available width.
        # Courier is ~0.6em average width; this is a pragmatic heuristic.
        approx_char_w = self.size_code * 0.60
        max_chars = max(20, int(max_w / approx_char_w))

        for raw_line in text.splitlines():
            line = raw_line.rstrip("\n")
            if line == "":
                self._ensure_space(self.leading_code)
                self.y -= self.leading_code
                continue
            while line:
                self._ensure_space(self.leading_code)
                chunk = line[:max_chars]
                line = line[max_chars:]
                self.canvas.drawString(x, self.y, chunk)
                self.y -= self.leading_code
        self.y -= 6  # spacing after code block

    def finish(self) -> None:
        self.canvas.save()


def main() -> int:
    parser = argparse.ArgumentParser(description="Export `update/` code to a single PDF.")
    parser.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parents[1]),
        help="Path to the `update` folder (default: auto-detected).",
    )
    parser.add_argument(
        "--out",
        default=str(Path.cwd() / "update-code.pdf"),
        help="Output PDF path (default: ./update-code.pdf).",
    )
    parser.add_argument("--title", default="update/ source code", help="Document title.")
    parser.add_argument("--max-file-kb", type=int, default=256, help="Skip files larger than this size.")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out_path = Path(args.out).resolve()
    if not root.exists() or not root.is_dir():
        raise SystemExit(f"Root folder not found: {root}")

    entries = sorted(iter_code_files(root, max_file_kb=args.max_file_kb), key=lambda e: e.rel_posix.lower())
    out_path.parent.mkdir(parents=True, exist_ok=True)

    writer = PdfWriter(out_path=out_path, title=args.title)
    writer.draw_title_block(subtitle="Generated from the `update/` folder.")
    writer.canvas.setFont(writer.font_ui, 9)
    writer.canvas.setFillGray(0.35)
    writer.canvas.drawString(writer.margin_l, writer.y, f"Files included: {len(entries)}")
    writer.canvas.setFillGray(0.0)
    writer.y -= 16

    for e in entries:
        writer.draw_file_heading(e.rel_posix, f"{e.size_bytes} bytes")
        writer.draw_code(read_text_safely(e.abs_path))

    writer.finish()
    print(f"Wrote: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

