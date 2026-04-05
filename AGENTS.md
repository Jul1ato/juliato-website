# juliato.dev — authoring guide for AI agents

This file is the contract for any AI coding tool (Claude Code, Cursor, Aider, Codex, Windsurf, etc.) making changes to this project. Read it before editing.

## Project overview

Static HTML portfolio site. No framework, no build step, no bundler, no package.json.

- Pages are hand-written `.html` files
- Styling in a single `/styles.css`
- Behavior in a single `/scripts.js`
- Hosted on Vercel with `cleanUrls: true` (so `/blog/foo` resolves to `/blog/foo.html`)
- SEO is audited against a high-quality reference implementation (chm-website) — maintain that bar on every change

## Hard constraints (do NOT do these)

- Do NOT migrate to a framework (Next.js, Astro, etc.). The site is deliberately static.
- Do NOT add a build step, bundler, or `package.json`.
- Do NOT add a CMS or content loader.
- Do NOT add unused dependencies or CDN scripts.
- Do NOT skip any SEO element listed below when adding pages.
- Do NOT use em dashes in written content.
- Do NOT make jabs at other tools, companies, or people in prose.
- Do NOT embellish content with claims beyond what the user has stated as fact.

## Voice and style for written content

- Lowercase, casual, direct. No corporate tone.
- First-person, personal, grounded in real experience.
- Self-taught developer perspective (learned to code at 16 using ChatGPT).
- Themes: building things, AI-native workflow, shipping over planning, creative coding, 3D, games, web dev.
- Short paragraphs. Conversational. Occasional bolded takeaways.

---

## Writing a new blog post

When the user asks to add a new blog post, follow this checklist exactly.

### 1. Create the file
Path: `blog/<slug>.html` where `<slug>` is kebab-case, 3–6 words, keyword-rich.
Copy the structure from `blog/why-innovating-is-great.html` — it is the canonical template.

### 2. Count the words
Before filling out the schema:
```bash
awk '/<article/,/<\/article>/' blog/<slug>.html | sed 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | wc -w
```
Record that number as `wordCount`. Reading time = `ceil(wordCount / 200)` minutes.

### 3. Required `<head>` meta tags (exact order)

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><POST TITLE> | juliato</title>
<meta name="description" content="<150-160 chars, includes primary keywords>">
<meta name="robots" content="index, follow">
<meta name="author" content="juliato">
<meta name="keywords" content="<5-7 comma-separated keywords>">
<meta name="theme-color" content="#0a0a0f">
<meta name="color-scheme" content="dark">
```

### 4. Open Graph + article meta tags (full suite required)

```html
<meta property="og:type" content="article">
<meta property="og:url" content="https://juliato.dev/blog/<slug>">
<meta property="og:title" content="<POST TITLE> | juliato">
<meta property="og:description" content="<same as meta description>">
<meta property="og:image" content="https://juliato.dev/<post-image>.webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="<POST TITLE> - Blog post by juliato">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="juliato.dev">
<meta property="article:published_time" content="YYYY-MM-DD">
<meta property="article:modified_time" content="YYYY-MM-DD">
<meta property="article:author" content="juliato">
<meta property="article:section" content="<Thoughts | Tutorials | Projects | Notes>">
<meta property="article:tag" content="<tag1>">
<meta property="article:tag" content="<tag2>">
<!-- one article:tag per tag, 3-6 tags total -->
```

Twitter block mirrors OG: card type `summary_large_image`, same title/description/image.

### 5. Required link tags

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
<link rel="llms-txt" href="/llms.txt">
<link rel="canonical" href="https://juliato.dev/blog/<slug>">
```

### 6. JSON-LD — TWO scripts required

**Script 1 — BlogPosting:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "<POST TITLE>",
  "description": "<same as meta description>",
  "image": "https://juliato.dev/<post-image>.webp",
  "url": "https://juliato.dev/blog/<slug>",
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "author": {
    "@type": "Person",
    "name": "juliato",
    "url": "https://juliato.dev/",
    "sameAs": [
      "https://github.com/Jul1ato",
      "https://www.linkedin.com/in/juliato/"
    ]
  },
  "publisher": {
    "@type": "Person",
    "name": "juliato",
    "url": "https://juliato.dev/"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://juliato.dev/blog/<slug>"
  },
  "articleSection": "<same as article:section>",
  "wordCount": <ACTUAL WORD COUNT>,
  "timeRequired": "PT<minutes>M",
  "inLanguage": "en-US",
  "keywords": ["tag1", "tag2", "tag3"]
}
```

**Script 2 — BreadcrumbList:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://juliato.dev/"},
    {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://juliato.dev/blog"},
    {"@type": "ListItem", "position": 3, "name": "<POST TITLE>", "item": "https://juliato.dev/blog/<slug>"}
  ]
}
```

### 7. If the post embeds YouTube videos
Add a VideoObject schema per embed. Extract the video ID from the URL, then:
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "<VIDEO TITLE>",
  "description": "<brief description>",
  "thumbnailUrl": "https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg",
  "uploadDate": "YYYY-MM-DD",
  "embedUrl": "https://www.youtube.com/embed/<VIDEO_ID>"
}
```

### 8. Semantic body HTML
- Wrap post content in `<article>`
- One `<h1>` for the post title
- `<h2>` for sections, `<h3>` for subsections
- Include `<time datetime="YYYY-MM-DD">` for the publish date

### 9. After writing the post — update four files

**a. `sitemap.xml`** — add a new `<url>` entry:
```xml
<url>
    <loc>https://juliato.dev/blog/<slug></loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
</url>
```
Priority: `0.9` if published within last 3 months, `0.7` otherwise.

**b. `llms.txt`** — add an entry under `## Blog Articles`:
```
- [<POST TITLE>](https://juliato.dev/blog/<slug>) (<Mon DD, YYYY>): <one-sentence description>
```

**c. `llms-full.txt`** — add the full post under `## Blog Posts`:
```markdown
### <POST TITLE>
URL: https://juliato.dev/blog/<slug>
Published: <Month DD, YYYY>
Reading time: <N> min
Keywords: tag1, tag2, tag3

<FULL POST BODY AS PLAIN TEXT. Strip all HTML. Preserve paragraph breaks with blank lines. Use **bold** for H2 headings.>
```

**d. `blog.html`** — add a new entry card to the blog listing (copy the pattern of the existing entry).

### 10. Validate

```bash
# All JSON-LD parses
python3 -c "
import re, json
with open('blog/<slug>.html') as f: html = f.read()
for i, b in enumerate(re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)):
    json.loads(b.strip())
    print(f'Block {i+1}: OK')
"

# llms-txt link present
grep -c 'rel="llms-txt"' blog/<slug>.html  # should be 1
```

Also recommend the user test with https://search.google.com/test/rich-results before merging.

---

## Writing a new project page

Path: `projects/<slug>.html`. Canonical template: `projects/vertai.html`.

Required JSON-LD: `CreativeWork` + `BreadcrumbList`. Meta tags same pattern as blog posts but `og:type` is `website`. Update `sitemap.xml`, `projects.html` grid, `llms.txt`, and `llms-full.txt`.

---

## Reference files

- Blog template: `blog/why-innovating-is-great.html`
- Project template: `projects/vertai.html`
- Home with full schema: `index.html`
- Sitemap: `sitemap.xml`
- Robots with AI directives: `robots.txt`
- LLM index: `llms.txt`
- LLM full content: `llms-full.txt`
