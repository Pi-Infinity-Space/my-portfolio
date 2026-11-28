# docs.md: Portfolio Site Plan

Part of Hack Club Phantom, where each project is built from scratch and shipped. This is project one of four: a portfolio site, a program in C, a program in Python, and an electronics project.

## Goal

A personal portfolio that shows off the articles Odinaka writes and the projects he builds. Clean, minimal, dark and techy.

## Pages

- **Home:** short intro with name and one-line description, plus the latest article and latest project.
- **Writing:** a list of all articles.
- **Projects:** a card for every project.
- **About / Contact:** who he is and how to reach him.

## Content Approach

- **Articles:** each one is a Markdown file in an `articles` folder. A small `articles.json` file lists them with title, date, and filename. The Writing page reads that list to show cards, and `article.html` fetches the right Markdown file and converts it to HTML.
- **Projects:** each one is a small data entry with a title, description, tech used, and links.

## Tech Stack

- Plain HTML, CSS, and JavaScript, with no framework and no build step (switched from React)
- One tiny helper: the `marked` library, loaded with a single script tag, to turn Markdown articles into HTML
- Pages: `index.html`, `writing.html`, `projects.html`, `about.html`, and one shared `article.html`, all using one `style.css`
- Fetching files needs a local server, so use the Live Server extension in VS Code while developing
- Deployed free on Vercel, Netlify, or GitHub Pages

## Front End Plan

Start with the visual skeleton before any content: the same navigation bar on top and the same footer on every page, with the page content in between.

Build order:

1. Shared `style.css` with the colour variables
2. Navigation bar markup
3. Home page hero with name and one-line intro
4. A reusable card style, used for both articles and projects so the two sections feel consistent

## Visual Style

**Vibe:** clean, minimal, dark and techy.

**Colour palette** (defined as CSS variables at the root of the stylesheet, so every component pulls from them and a change is a one-line edit):

- Background: near-black, around `#0A0A0F`
- Surface (cards): slightly lighter dark
- Border: thin, subtle
- Text: off-white
- Muted text: soft grey
- Accent: electric blue, around `#00A3FF` (or `#3B82F6` for a softer version), used only for links, hover states, and small highlights

**Fonts:**

- Headings and labels: a monospace font such as JetBrains Mono
- Body text: a clean sans-serif such as Inter

**Style notes:** lots of spacing, thin subtle borders on cards, and a small touch of a blinking cursor beside the name on the home page.

## Visual Description

- **Background:** near-black throughout, like a terminal in a dark room.
- **Nav bar:** slim, at the top. Name on the left in monospace with a blinking electric blue cursor after it. Home, Writing, Projects, and About on the right in muted grey, with the active page glowing blue.
- **Hero:** a big monospace headline with the name, a one-line intro in soft off-white sans-serif underneath, and lots of empty space around it.
- **Cards:** two rows, one for latest articles and one for projects. Each card is a slightly lighter dark surface with a thin border that lights up electric blue on hover. Inside: a monospace title, a short muted description, and tech tags for projects.
- **Footer:** quiet, with links, separated by a hairline border.

## Nav Bar

HTML, placed at the top of the body on every page. Move the `active` class to the current page.

```html
<header class="navbar">
  <a href="index.html" class="logo">your-name<span class="cursor">_</span></a>
  <nav>
    <a href="index.html" class="active">Home</a>
    <a href="writing.html">Writing</a>
    <a href="projects.html">Projects</a>
    <a href="about.html">About</a>
  </nav>
</header>
```

CSS, added to `style.css`:

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border);
}
.logo { font-family: var(--font-mono); font-weight: 700; }
.cursor { color: var(--accent); animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.navbar nav { display: flex; gap: 1.75rem; }
.navbar nav a {
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  transition: color 0.2s;
}
.navbar nav a:hover,
.navbar nav a.active { color: var(--accent); }
.navbar nav a.active { text-shadow: 0 0 12px var(--accent); }
```

## Home Page Hero

A centred section with a small mono label, a big monospace headline with the blinking cursor, a one-line intro with a capped width, and two buttons.

```html
<main>
  <section class="hero">
    <p class="eyebrow">// hello, world</p>
    <h1>I'm your-name<span class="cursor">_</span></h1>
    <p class="intro">I build things with code and write about what I learn.</p>
    <div class="hero-actions">
      <a href="projects.html" class="btn btn-primary">View projects</a>
      <a href="writing.html" class="btn">Read my writing</a>
    </div>
  </section>
</main>
```

```css
.hero {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.5rem;
}
.eyebrow {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.hero h1 {
  font-family: var(--font-mono);
  font-size: clamp(2.2rem, 7vw, 4.5rem);
  line-height: 1.1;
}
.intro {
  max-width: 34rem;
  margin-top: 1.25rem;
  color: var(--muted);
  font-size: 1.1rem;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.btn {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  padding: 0.7rem 1.4rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: border-color 0.2s, color 0.2s;
}
.btn:hover { border-color: var(--accent); color: var(--accent); }
.btn-primary { background: var(--accent); border-color: var(--accent); color: var(--bg); }
.btn-primary:hover { color: var(--bg); opacity: 0.85; }
```

## Reusable Card

One `.card` style serves both articles and projects, so the two sections look consistent. Cards sit inside a `.card-grid` that fits as many columns as the screen allows.

Article card:

```html
<div class="card-grid">
  <a href="article.html?post=my-first-article" class="card">
    <span class="card-meta">2026-11-27</span>
    <h3 class="card-title">My First Article</h3>
    <p class="card-desc">A short summary of what the article is about.</p>
  </a>
</div>
```

Project card (same style, with tech tags and links):

```html
<div class="card">
  <span class="card-meta">Project</span>
  <h3 class="card-title">Project Name</h3>
  <p class="card-desc">What it does and why you built it.</p>
  <div class="tags">
    <span class="tag">HTML</span>
    <span class="tag">CSS</span>
    <span class="tag">JavaScript</span>
  </div>
  <div class="card-links">
    <a href="#">Live</a>
    <a href="#">Code</a>
  </div>
</div>
```

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.2s, transform 0.2s;
}
.card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
}
.card-meta {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--muted);
}
.card-title {
  font-family: var(--font-mono);
  font-size: 1.1rem;
}
.card-desc {
  color: var(--muted);
  font-size: 0.95rem;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.4rem;
}
.tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent);
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 999px;
}
.card-links {
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding-top: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
.card-links a { color: var(--accent); }
.card-links a:hover { text-decoration: underline; }
```

## Footer

A personal message from Odinaka, followed by social media links styled as buttons, with a hairline border separating it from the page. Replace the placeholder handles and the message with your own.

```html
<footer class="footer">
  <p class="footer-message">Thanks for stopping by. Let's build something great together.</p>
  <div class="social-links">
    <a href="https://x.com/your-handle" class="social-btn" target="_blank" rel="noopener">X</a>
    <a href="https://linkedin.com/in/your-handle" class="social-btn" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://whatsapp.com/channel/your-channel-id" class="social-btn" target="_blank" rel="noopener">WhatsApp Channel</a>
    <a href="https://medium.com/@your-handle" class="social-btn" target="_blank" rel="noopener">Medium</a>
  </div>
  <p class="footer-copy">&copy; 2026 your-name</p>
</footer>
```

```css
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-top: 5rem;
  padding: 2.5rem 1.5rem;
  border-top: 1px solid var(--border);
  text-align: center;
}
.footer-message {
  max-width: 30rem;
  color: var(--muted);
}
.social-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}
.social-btn {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.55rem 1.1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: border-color 0.2s, color 0.2s;
}
.social-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.footer-copy {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted);
}
```

## Home Page: Latest Cards

The home page shows the three newest articles and the three newest projects. The cards are built by JavaScript from two data files, so adding content never means editing the HTML.

File layout:

```
portfolio/
  index.html
  style.css
  script.js
  projects.json
  articles/
    articles.json
    my-first-article.md
```

`articles/articles.json`: `file` is the Markdown file name without `.md`.

```json
[
  {
    "title": "My First Article",
    "date": "2026-11-27",
    "file": "my-first-article",
    "summary": "A short summary of what the article is about."
  }
]
```

`projects.json`:

```json
[
  {
    "title": "Project Name",
    "description": "What it does and why you built it.",
    "tech": ["HTML", "CSS", "JavaScript"],
    "live": "https://example.com",
    "code": "https://github.com/your-handle/project"
  }
]
```

In `index.html`, below the hero:

```html
<section class="section">
  <div class="section-head">
    <h2>Latest writing</h2>
    <a href="writing.html" class="see-all">View all &rarr;</a>
  </div>
  <div class="card-grid" id="latest-articles"></div>
</section>

<section class="section">
  <div class="section-head">
    <h2>Latest projects</h2>
    <a href="projects.html" class="see-all">View all &rarr;</a>
  </div>
  <div class="card-grid" id="latest-projects"></div>
</section>
```

Just before `</body>` in `index.html`, after the footer:

```html
<script src="script.js"></script>
```

`script.js`:

```js
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(path + " not found");
  return res.json();
}

function articleCard(a) {
  return `
    <a href="article.html?post=${a.file}" class="card">
      <span class="card-meta">${a.date}</span>
      <h3 class="card-title">${a.title}</h3>
      <p class="card-desc">${a.summary}</p>
    </a>`;
}

function projectCard(p) {
  const tags = p.tech.map(t => `<span class="tag">${t}</span>`).join("");
  const live = p.live ? `<a href="${p.live}" target="_blank" rel="noopener">Live</a>` : "";
  const code = p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Code</a>` : "";
  return `
    <div class="card">
      <span class="card-meta">Project</span>
      <h3 class="card-title">${p.title}</h3>
      <p class="card-desc">${p.description}</p>
      <div class="tags">${tags}</div>
      <div class="card-links">${live}${code}</div>
    </div>`;
}

async function renderLatest() {
  const articleBox = document.getElementById("latest-articles");
  const projectBox = document.getElementById("latest-projects");

  try {
    if (articleBox) {
      const articles = await loadJSON("articles/articles.json");
      articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      articleBox.innerHTML = articles.slice(0, 3).map(articleCard).join("");
    }
    if (projectBox) {
      const projects = await loadJSON("projects.json");
      projectBox.innerHTML = projects.slice(0, 3).map(projectCard).join("");
    }
  } catch (err) {
    console.error(err);
  }
}

renderLatest();
```

CSS for the section headings:

```css
.section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1.5rem 0;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.5rem;
}
.section-head h2 {
  font-family: var(--font-mono);
  font-size: 1.3rem;
}
.see-all {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--accent);
}
.see-all:hover { text-decoration: underline; }
```

## Writing and Projects Pages

Both pages list everything from the same data files the home page uses, with the same cards, nav bar, and footer. Only the page header and the container id change.

`writing.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Writing | your-name</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="navbar">
    <a href="index.html" class="logo">your-name<span class="cursor">_</span></a>
    <nav>
      <a href="index.html">Home</a>
      <a href="writing.html" class="active">Writing</a>
      <a href="projects.html">Projects</a>
      <a href="about.html">About</a>
    </nav>
  </header>

  <main>
    <div class="page-header">
      <h1>Writing</h1>
      <p>Articles on what I build and learn.</p>
    </div>
    <section class="section">
      <div class="card-grid" id="all-articles"></div>
    </section>
  </main>

  <!-- paste the footer from the Footer section here -->

  <script src="script.js"></script>
</body>
</html>
```

`projects.html` is the same file with three changes: the title becomes `Projects | your-name`, the `active` class moves to the Projects link, and the main block becomes:

```html
<main>
  <div class="page-header">
    <h1>Projects</h1>
    <p>Things I have built.</p>
  </div>
  <section class="section">
    <div class="card-grid" id="all-projects"></div>
  </section>
</main>
```

Add to the bottom of `script.js`:

```js
async function renderAll() {
  const allArticles = document.getElementById("all-articles");
  const allProjects = document.getElementById("all-projects");

  try {
    if (allArticles) {
      const articles = await loadJSON("articles/articles.json");
      articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      allArticles.innerHTML = articles.length
        ? articles.map(articleCard).join("")
        : '<p class="empty">No articles yet.</p>';
    }
    if (allProjects) {
      const projects = await loadJSON("projects.json");
      allProjects.innerHTML = projects.length
        ? projects.map(projectCard).join("")
        : '<p class="empty">No projects yet.</p>';
    }
  } catch (err) {
    console.error(err);
  }
}

renderAll();
```

Add to `style.css`:

```css
.page-header {
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 1.5rem 0;
}
.page-header h1 {
  font-family: var(--font-mono);
  font-size: clamp(2rem, 6vw, 3rem);
}
.page-header p {
  margin-top: 0.5rem;
  color: var(--muted);
}
.empty {
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
```

## Article Page

One `article.html` shows any article. The card link passes the file name in the address (`article.html?post=my-first-article`), the script fetches `articles/my-first-article.md`, and `marked` turns it into HTML.

`article.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Article | your-name</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="navbar">
    <a href="index.html" class="logo">your-name<span class="cursor">_</span></a>
    <nav>
      <a href="index.html">Home</a>
      <a href="writing.html" class="active">Writing</a>
      <a href="projects.html">Projects</a>
      <a href="about.html">About</a>
    </nav>
  </header>

  <main>
    <article class="article" id="article">
      <p class="empty">Loading...</p>
    </article>
  </main>

  <!-- paste your footer here -->

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

Add to the bottom of `script.js`:

```js
async function renderArticle() {
  const box = document.getElementById("article");
  if (!box) return;

  const notFound = '<a href="writing.html" class="back">&larr; All writing</a><p class="empty">Article not found.</p>';
  const slug = new URLSearchParams(window.location.search).get("post");
  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    box.innerHTML = notFound;
    return;
  }

  try {
    const [articles, res] = await Promise.all([
      loadJSON("articles/articles.json"),
      fetch(`articles/${slug}.md`)
    ]);
    if (!res.ok) throw new Error("missing");

    const meta = articles.find(a => a.file === slug);
    const markdown = await res.text();
    const title = meta ? meta.title : slug;

    document.title = title + " | your-name";
    box.innerHTML = `
      <a href="writing.html" class="back">&larr; All writing</a>
      ${meta ? `<span class="card-meta">${meta.date}</span>` : ""}
      <h1>${title}</h1>
      <div class="article-body">${marked.parse(markdown)}</div>`;
  } catch (err) {
    console.error(err);
    box.innerHTML = notFound;
  }
}

renderArticle();
```

Sample article, saved as `articles/my-first-article.md`:

```markdown
## Hello, world

This is my first article. I can use **bold**, *italics*, and [links](https://example.com).

- Lists work
- So does `inline code`

> Quotes work too.
```

Add to `style.css`:

```css
.article {
  max-width: 720px;
  margin: 0 auto;
  padding: 4rem 1.5rem 0;
}
.article h1 {
  font-family: var(--font-mono);
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  line-height: 1.2;
  margin: 0.5rem 0 2rem;
}
.back {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--accent);
}
.back:hover { text-decoration: underline; }
.article-body > * + * { margin-top: 1.1rem; }
.article-body h2,
.article-body h3 {
  font-family: var(--font-mono);
  margin-top: 2.2rem;
}
.article-body a { color: var(--accent); }
.article-body a:hover { text-decoration: underline; }
.article-body ul,
.article-body ol { padding-left: 1.4rem; }
.article-body code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--surface);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}
.article-body pre {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}
.article-body pre code {
  background: none;
  padding: 0;
}
.article-body blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  color: var(--muted);
}
.article-body img {
  max-width: 100%;
  border-radius: 8px;
}
```

## About Page

A short bio on the left, a skills card on the right (stacked on phones), and a Get in touch section that reuses the footer's social buttons. It uses the existing `.tag`, `.card`, and `.social-btn` styles, so only a little new CSS is needed. Replace the placeholder text with your own.

`about.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About | your-name</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="navbar">
    <a href="index.html" class="logo">your-name<span class="cursor">_</span></a>
    <nav>
      <a href="index.html">Home</a>
      <a href="writing.html">Writing</a>
      <a href="projects.html">Projects</a>
      <a href="about.html" class="active">About</a>
    </nav>
  </header>

  <main>
    <div class="page-header">
      <h1>About</h1>
      <p>A little about me.</p>
    </div>

    <section class="section about">
      <div class="about-text">
        <p>Hi, I'm your-name. Write two or three sentences here about who you are and what you do.</p>
        <p>Write a second paragraph about what you enjoy building, what you are learning, and why you started this site.</p>
      </div>

      <aside class="card about-card">
        <h3 class="card-title">Skills</h3>
        <div class="tags">
          <span class="tag">HTML</span>
          <span class="tag">CSS</span>
          <span class="tag">JavaScript</span>
          <span class="tag">C</span>
          <span class="tag">Python</span>
        </div>
        <h3 class="card-title">Currently</h3>
        <p class="card-desc">Building projects from scratch in Hack Club's Phantom program.</p>
      </aside>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>Get in touch</h2>
      </div>
      <p class="contact-text">Want to talk about a project, an article, or an idea? Reach me on any of these.</p>
      <div class="social-links about-links">
        <a href="https://x.com/your-handle" class="social-btn" target="_blank" rel="noopener">X</a>
        <a href="https://linkedin.com/in/your-handle" class="social-btn" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://whatsapp.com/channel/your-channel-id" class="social-btn" target="_blank" rel="noopener">WhatsApp Channel</a>
        <a href="https://medium.com/@your-handle" class="social-btn" target="_blank" rel="noopener">Medium</a>
      </div>
    </section>
  </main>

  <!-- paste your footer here -->

  <script src="script.js"></script>
</body>
</html>
```

Add to `style.css`:

```css
.about {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}
.about-text p + p { margin-top: 1rem; }
.about-text p { color: var(--muted); }
.about-card { gap: 0.9rem; }
.about-card:hover {
  border-color: var(--border);
  transform: none;
}
.contact-text {
  max-width: 34rem;
  color: var(--muted);
}
.about-links {
  justify-content: flex-start;
  margin-top: 1.25rem;
}
@media (max-width: 720px) {
  .about { grid-template-columns: 1fr; }
}
```

## Admin System

**Decision:** a form on the live site that only Odinaka can use to add and update articles and projects. (Considered: Git only, a web panel on a Git-based CMS, and a custom backend.)

**How it works:** `admin.html` is a normal page, but it can do nothing without a GitHub token. After the token is pasted in, the page reads and writes `articles/*.md`, `articles/articles.json`, and `projects.json` in the repo through the GitHub API. Every publish is a commit, and the host (Netlify, Vercel, or GitHub Pages) redeploys the site automatically. GitHub is the gatekeeper, so there is no server or password database to attack.

**Security rules:**

- The token is fine-grained: one repo only, Contents read and write only, with an expiry date.
- It is kept in `sessionStorage`, so it clears when the tab closes, and it is never written into any file.
- The admin page is not linked from the nav, and `noindex` keeps search engines away.
- Revoke the token in GitHub settings if a device is lost.
- Use it only on your own devices.

**Setup:**

1. Push the site to a GitHub repo and deploy it from that repo on Netlify, Vercel, or GitHub Pages.
2. In GitHub, go to Settings, Developer settings, Personal access tokens, Fine-grained tokens, Generate new token. Choose Only select repositories (the portfolio repo), then Repository permissions, Contents, Read and write. Set an expiry date.
3. Open `yoursite.com/admin.html`, paste the token, and enter the GitHub username, repo name, and branch.

`admin.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin | your-name</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="navbar">
    <a href="index.html" class="logo">admin<span class="cursor">_</span></a>
    <nav>
      <a href="index.html">View site</a>
    </nav>
  </header>

  <main class="admin">
    <p id="status" class="status" hidden></p>

    <section id="login-panel">
      <h1>Admin login</h1>
      <p class="muted">Only a GitHub token with write access to this site's repo can publish. The token stays in this tab and is cleared when you close it.</p>
      <form id="login-form" class="form">
        <label>GitHub token<input type="password" id="token" autocomplete="off" required></label>
        <label>GitHub username<input type="text" id="owner" required></label>
        <label>Repository name<input type="text" id="repo" required></label>
        <label>Branch<input type="text" id="branch" value="main"></label>
        <button class="btn btn-primary" type="submit">Connect</button>
      </form>
    </section>

    <section id="editor" hidden>
      <div class="admin-bar">
        <div class="tabs">
          <button class="tab active" data-tab="articles" type="button">Articles</button>
          <button class="tab" data-tab="projects" type="button">Projects</button>
        </div>
        <button class="btn" id="logout" type="button">Sign out</button>
      </div>

      <div id="panel-articles">
        <label class="select-label">Edit an existing article or write a new one
          <select id="article-select"></select>
        </label>
        <form id="article-form" class="form">
          <label>Title<input type="text" id="a-title" required></label>
          <label>Date<input type="date" id="a-date" required></label>
          <label>Slug (the file name, filled in automatically)<input type="text" id="a-slug" required></label>
          <label>Summary<textarea id="a-summary" rows="2" required></textarea></label>
          <label>Article (Markdown)<textarea id="a-content" rows="16" required></textarea></label>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">Publish</button>
            <button class="btn btn-danger" id="a-delete" type="button" hidden>Delete</button>
          </div>
        </form>
      </div>

      <div id="panel-projects" hidden>
        <label class="select-label">Edit an existing project or add a new one
          <select id="project-select"></select>
        </label>
        <form id="project-form" class="form">
          <label>Title<input type="text" id="p-title" required></label>
          <label>Description<textarea id="p-description" rows="3" required></textarea></label>
          <label>Tech (separate with commas)<input type="text" id="p-tech" placeholder="HTML, CSS, JavaScript"></label>
          <label>Live link (optional)<input type="url" id="p-live"></label>
          <label>Code link (optional)<input type="url" id="p-code"></label>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">Publish</button>
            <button class="btn btn-danger" id="p-delete" type="button" hidden>Delete</button>
          </div>
        </form>
      </div>
    </section>
  </main>

  <script src="admin.js"></script>
</body>
</html>
```

`admin.js`:

```js
const API = 'https://api.github.com';
const $ = id => document.getElementById(id);
let cfg = null;
let articles = [];
let projects = [];
let editingProject = null;

// ---------- helpers ----------
function b64encode(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function b64decode(b64) {
  const bin = atob(b64.replace(/\n/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}
function setStatus(msg, ok = true) {
  const el = $('status');
  el.textContent = msg;
  el.className = 'status ' + (ok ? 'ok' : 'error');
  el.hidden = !msg;
}
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const toJSON = data => JSON.stringify(data, null, 2) + '\n';

// ---------- GitHub API ----------
const fileUrl = path => `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
const authHeaders = () => ({ Authorization: `Bearer ${cfg.token}`, Accept: 'application/vnd.github+json' });

async function ghGet(path) {
  const res = await fetch(`${fileUrl(path)}?ref=${cfg.branch}`, { headers: authHeaders(), cache: 'no-store' });
  if (res.status === 404) return null;
  if (res.status === 401) throw new Error('Invalid or expired token.');
  if (!res.ok) throw new Error(`GitHub error ${res.status}`);
  const data = await res.json();
  return { sha: data.sha, text: b64decode(data.content) };
}
async function ghWrite(method, path, body) {
  const res = await fetch(fileUrl(path), {
    method,
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, branch: cfg.branch })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub error ${res.status}`);
  }
}
async function saveFile(path, text, message) {
  const existing = await ghGet(path);
  await ghWrite('PUT', path, { message, content: b64encode(text), ...(existing ? { sha: existing.sha } : {}) });
}
async function removeFile(path, message) {
  const existing = await ghGet(path);
  if (existing) await ghWrite('DELETE', path, { message, sha: existing.sha });
}
async function readJSON(path) {
  const file = await ghGet(path);
  return file ? JSON.parse(file.text) : [];
}

// ---------- lists ----------
async function loadData() {
  articles = await readJSON('articles/articles.json');
  projects = await readJSON('projects.json');
  fillSelects();
}
function fillSelects() {
  const aSel = $('article-select');
  aSel.innerHTML = '<option value="">+ New article</option>';
  articles.forEach(a => {
    const o = document.createElement('option');
    o.value = a.file;
    o.textContent = `${a.date} · ${a.title}`;
    aSel.appendChild(o);
  });
  const pSel = $('project-select');
  pSel.innerHTML = '<option value="">+ New project</option>';
  projects.forEach(p => {
    const o = document.createElement('option');
    o.value = p.title;
    o.textContent = p.title;
    pSel.appendChild(o);
  });
}

// ---------- articles ----------
function resetArticleForm() {
  $('article-form').reset();
  $('article-select').value = '';
  $('a-date').value = new Date().toISOString().slice(0, 10);
  $('a-slug').readOnly = false;
  $('a-delete').hidden = true;
}

$('article-select').addEventListener('change', async e => {
  const slug = e.target.value;
  if (!slug) return resetArticleForm();
  const meta = articles.find(a => a.file === slug);
  setStatus('Loading article...');
  try {
    const md = await ghGet(`articles/${slug}.md`);
    $('a-title').value = meta.title;
    $('a-date').value = meta.date;
    $('a-slug').value = slug;
    $('a-slug').readOnly = true;
    $('a-summary').value = meta.summary;
    $('a-content').value = md ? md.text : '';
    $('a-delete').hidden = false;
    setStatus('');
  } catch (err) {
    setStatus(err.message, false);
  }
});

$('a-title').addEventListener('input', () => {
  if (!$('a-slug').readOnly) $('a-slug').value = slugify($('a-title').value);
});

$('article-form').addEventListener('submit', async e => {
  e.preventDefault();
  const slug = $('a-slug').value.trim();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return setStatus('The slug can only use lowercase letters, numbers, and hyphens.', false);
  }
  const entry = {
    title: $('a-title').value.trim(),
    date: $('a-date').value,
    file: slug,
    summary: $('a-summary').value.trim()
  };
  setStatus('Publishing...');
  try {
    const list = await readJSON('articles/articles.json');
    const i = list.findIndex(a => a.file === slug);
    if (!$('a-slug').readOnly && i >= 0) {
      throw new Error('An article with this slug already exists. Pick it from the list to edit it.');
    }
    if (i >= 0) list[i] = entry;
    else list.unshift(entry);
    await saveFile(`articles/${slug}.md`, $('a-content').value, `Publish article: ${entry.title}`);
    await saveFile('articles/articles.json', toJSON(list), `Update article list: ${entry.title}`);
    articles = list;
    fillSelects();
    $('article-select').value = slug;
    $('a-slug').readOnly = true;
    $('a-delete').hidden = false;
    setStatus('Published. The live site updates in a minute or two.');
  } catch (err) {
    setStatus(err.message, false);
  }
});

$('a-delete').addEventListener('click', async () => {
  const slug = $('a-slug').value;
  if (!confirm(`Delete "${$('a-title').value}" from the live site?`)) return;
  setStatus('Deleting...');
  try {
    const list = (await readJSON('articles/articles.json')).filter(a => a.file !== slug);
    await removeFile(`articles/${slug}.md`, `Delete article: ${slug}`);
    await saveFile('articles/articles.json', toJSON(list), `Update article list: removed ${slug}`);
    articles = list;
    fillSelects();
    resetArticleForm();
    setStatus('Deleted. The live site updates in a minute or two.');
  } catch (err) {
    setStatus(err.message, false);
  }
});

// ---------- projects ----------
function resetProjectForm() {
  $('project-form').reset();
  $('project-select').value = '';
  editingProject = null;
  $('p-delete').hidden = true;
}

$('project-select').addEventListener('change', e => {
  const p = projects.find(x => x.title === e.target.value);
  if (!p) return resetProjectForm();
  editingProject = p.title;
  $('p-title').value = p.title;
  $('p-description').value = p.description;
  $('p-tech').value = (p.tech || []).join(', ');
  $('p-live').value = p.live || '';
  $('p-code').value = p.code || '';
  $('p-delete').hidden = false;
  setStatus('');
});

$('project-form').addEventListener('submit', async e => {
  e.preventDefault();
  const entry = {
    title: $('p-title').value.trim(),
    description: $('p-description').value.trim(),
    tech: $('p-tech').value.split(',').map(t => t.trim()).filter(Boolean),
    live: $('p-live').value.trim(),
    code: $('p-code').value.trim()
  };
  setStatus('Publishing...');
  try {
    const list = await readJSON('projects.json');
    const i = list.findIndex(p => p.title === (editingProject ?? entry.title));
    if (editingProject === null && i >= 0) {
      throw new Error('A project with this title already exists. Pick it from the list to edit it.');
    }
    if (i >= 0) list[i] = entry;
    else list.unshift(entry);
    await saveFile('projects.json', toJSON(list), `Update projects: ${entry.title}`);
    projects = list;
    editingProject = entry.title;
    fillSelects();
    $('project-select').value = entry.title;
    $('p-delete').hidden = false;
    setStatus('Published. The live site updates in a minute or two.');
  } catch (err) {
    setStatus(err.message, false);
  }
});

$('p-delete').addEventListener('click', async () => {
  if (!confirm(`Delete "${editingProject}" from the live site?`)) return;
  setStatus('Deleting...');
  try {
    const list = (await readJSON('projects.json')).filter(p => p.title !== editingProject);
    await saveFile('projects.json', toJSON(list), `Update projects: removed ${editingProject}`);
    projects = list;
    fillSelects();
    resetProjectForm();
    setStatus('Deleted. The live site updates in a minute or two.');
  } catch (err) {
    setStatus(err.message, false);
  }
});

// ---------- tabs ----------
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
    $('panel-articles').hidden = btn.dataset.tab !== 'articles';
    $('panel-projects').hidden = btn.dataset.tab !== 'projects';
    setStatus('');
  });
});

// ---------- login ----------
function showEditor(on) {
  $('login-panel').hidden = on;
  $('editor').hidden = !on;
}

async function connect(config) {
  cfg = config;
  const res = await fetch(`${API}/repos/${cfg.owner}/${cfg.repo}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Could not open that repo. Check the token, username, and repo name.');
  await loadData();
  sessionStorage.setItem('adminCfg', JSON.stringify(cfg));
  resetArticleForm();
  resetProjectForm();
  showEditor(true);
}

$('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  setStatus('Connecting...');
  try {
    await connect({
      token: $('token').value.trim(),
      owner: $('owner').value.trim(),
      repo: $('repo').value.trim(),
      branch: $('branch').value.trim() || 'main'
    });
    $('token').value = '';
    setStatus('');
  } catch (err) {
    cfg = null;
    setStatus(err.message, false);
  }
});

$('logout').addEventListener('click', () => {
  sessionStorage.removeItem('adminCfg');
  cfg = null;
  showEditor(false);
  setStatus('');
});

const saved = sessionStorage.getItem('adminCfg');
if (saved) connect(JSON.parse(saved)).catch(() => sessionStorage.removeItem('adminCfg'));
```

Add to `style.css`:

```css
[hidden] { display: none !important; }

.admin {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem 0;
}
.admin h1 {
  font-family: var(--font-mono);
  margin-bottom: 0.5rem;
}
.muted {
  color: var(--muted);
  margin-bottom: 1.5rem;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.form label,
.select-label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--muted);
}
.select-label { margin-bottom: 1.5rem; }
.form input,
.form textarea,
.select-label select {
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.7rem 0.9rem;
}
.form textarea {
  resize: vertical;
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
.form input:focus,
.form textarea:focus,
.select-label select:focus {
  outline: none;
  border-color: var(--accent);
}
.admin-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.tabs { display: flex; gap: 0.5rem; }
.tab {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--muted);
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.tab.active {
  color: var(--accent);
  border-color: var(--accent);
}
button.btn {
  background: transparent;
  color: var(--text);
  cursor: pointer;
}
button.btn-primary {
  background: var(--accent);
  color: var(--bg);
}
.btn-danger:hover {
  border-color: #ff5c5c;
  color: #ff5c5c;
}
.form-actions { display: flex; gap: 1rem; }
.status {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid;
  border-radius: 6px;
}
.status.ok { border-color: var(--accent); color: var(--accent); }
.status.error { border-color: #ff5c5c; color: #ff5c5c; }
```

## Next Steps

- Push the site to GitHub and deploy it from the repo
- Create the fine-grained GitHub token and test `admin.html` with a first article
- Replace all placeholders (name, social links, intro, bio) with real content
