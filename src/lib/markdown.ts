function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function processInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inUl = false;
  let inOl = false;
  let paragraphLines: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      result.push(`<p>${processInline(paragraphLines.join(" "))}</p>`);
      paragraphLines = [];
    }
  }

  function flushList() {
    if (inUl) {
      result.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      result.push("</ol>");
      inOl = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        result.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const h3Match = line.match(/^### (.+)/);
    if (h3Match) {
      flushParagraph();
      flushList();
      result.push(`<h3>${processInline(h3Match[1])}</h3>`);
      continue;
    }

    const h2Match = line.match(/^## (.+)/);
    if (h2Match) {
      flushParagraph();
      flushList();
      result.push(`<h2>${processInline(h2Match[1])}</h2>`);
      continue;
    }

    const h1Match = line.match(/^# (.+)/);
    if (h1Match) {
      flushParagraph();
      flushList();
      result.push(`<h1>${processInline(h1Match[1])}</h1>`);
      continue;
    }

    const bqMatch = line.match(/^> (.+)/);
    if (bqMatch) {
      flushParagraph();
      flushList();
      result.push(`<blockquote>${processInline(bqMatch[1])}</blockquote>`);
      continue;
    }

    const ulMatch = line.match(/^[-*] (.+)/);
    if (ulMatch) {
      flushParagraph();
      if (inOl) { result.push("</ol>"); inOl = false; }
      if (!inUl) { result.push("<ul>"); inUl = true; }
      result.push(`<li>${processInline(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      flushParagraph();
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (!inOl) { result.push("<ol>"); inOl = true; }
      result.push(`<li>${processInline(olMatch[1])}</li>`);
      continue;
    }

    flushList();
    paragraphLines.push(line.trim());
  }

  if (inCodeBlock && codeLines.length > 0) {
    result.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }
  flushParagraph();
  flushList();

  return result.join("\n");
}
