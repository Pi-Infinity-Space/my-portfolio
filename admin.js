"use strict";

const API = "https://api.github.com";
const $ = id => document.getElementById(id);
const STORAGE_KEY = "portfolioAdminConfig";
let config = null;
let articles = [];
let projects = [];
let editingProject = null;

function setStatus(message, isError = false) {
  const status = $("status");
  status.textContent = message;
  status.className = `status ${isError ? "error" : "ok"}`;
  status.hidden = !message;
}

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function pathFor(file) {
  const encodedPath = file.split("/").map(encodeURIComponent).join("/");
  return `${API}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath}`;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

async function githubRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
    cache: "no-store"
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body.message || "";
    } catch (error) {
      console.error("Could not read the GitHub error response.", error);
    }

    if (response.status === 401) throw new Error("The GitHub token is invalid or expired.");
    if (response.status === 403) throw new Error(detail || "GitHub denied access. Check token permissions and API limits.");
    if (response.status === 404) throw new Error("The repository, branch, or file was not found. Check the owner, repository, branch, and token access.");
    throw new Error(detail || `GitHub returned HTTP ${response.status}.`);
  }

  return response.status === 204 ? null : response.json();
}

async function readFile(file) {
  const url = `${pathFor(file)}?ref=${encodeURIComponent(config.branch)}`;
  const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) {
    if (response.status === 401) throw new Error("The GitHub token is invalid or expired.");
    const body = await response.json();
    throw new Error(body.message || `GitHub returned HTTP ${response.status}.`);
  }
  const result = await response.json();
  return { sha: result.sha, text: fromBase64(result.content) };
}

async function readJSON(file) {
  const result = await readFile(file);
  if (!result) return [];
  const data = JSON.parse(result.text);
  if (!Array.isArray(data)) throw new Error(`${file} must contain a JSON array.`);
  return data;
}

async function writeFile(file, content, message) {
  const existing = await readFile(file);
  const body = {
    message,
    content: toBase64(content),
    branch: config.branch,
    ...(existing ? { sha: existing.sha } : {})
  };
  await githubRequest(pathFor(file), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

async function deleteFile(file, message) {
  const existing = await readFile(file);
  if (!existing) return;
  await githubRequest(pathFor(file), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha: existing.sha, branch: config.branch })
  });
}

function fillSelects() {
  const articleSelect = $("article-select");
  articleSelect.replaceChildren(new Option("+ New article", ""));
  for (const article of articles) {
    articleSelect.add(new Option(`${article.date} · ${article.title}`, article.file));
  }

  const projectSelect = $("project-select");
  projectSelect.replaceChildren(new Option("+ New project", ""));
  for (const project of projects) {
    projectSelect.add(new Option(project.title, project.title));
  }
}

async function loadContent() {
  [articles, projects] = await Promise.all([
    readJSON("articles/articles.json"),
    readJSON("projects.json")
  ]);
  fillSelects();
}

function showEditor(isConnected) {
  $("login-panel").hidden = isConnected;
  $("editor").hidden = !isConnected;
}

function resetArticleForm() {
  $("article-form").reset();
  $("article-select").value = "";
  $("a-date").value = new Date().toISOString().slice(0, 10);
  $("a-slug").readOnly = false;
  $("a-delete").hidden = true;
}

function resetProjectForm() {
  $("project-form").reset();
  $("project-select").value = "";
  editingProject = null;
  $("p-delete").hidden = true;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function isSafeOptionalUrl(value) {
  if (!value) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

$("article-select").addEventListener("change", async event => {
  const slug = event.target.value;
  if (!slug) {
    resetArticleForm();
    setStatus("");
    return;
  }

  const article = articles.find(item => item.file === slug);
  if (!article) {
    setStatus("The selected article is no longer in the list. Reload the content.", true);
    return;
  }

  setStatus("Loading article...");
  try {
    const markdown = await readFile(`articles/${slug}.md`);
    if (!markdown) throw new Error("The article Markdown file is missing from the repository.");
    $("a-title").value = article.title;
    $("a-date").value = article.date;
    $("a-slug").value = slug;
    $("a-slug").readOnly = true;
    $("a-summary").value = article.summary;
    $("a-content").value = markdown.text;
    $("a-delete").hidden = false;
    setStatus("");
  } catch (error) {
    setStatus(error.message, true);
  }
});

$("a-title").addEventListener("input", () => {
  if (!$("a-slug").readOnly) $("a-slug").value = slugify($("a-title").value);
});

$("article-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;

  const slug = $("a-slug").value.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    setStatus("Use lowercase letters, numbers, and single hyphens in the slug.", true);
    return;
  }

  const article = {
    title: $("a-title").value.trim(),
    date: $("a-date").value,
    file: slug,
    summary: $("a-summary").value.trim()
  };

  setStatus("Publishing article...");
  try {
    const list = await readJSON("articles/articles.json");
    const index = list.findIndex(item => item.file === slug);
    if (!$("a-slug").readOnly && index !== -1) {
      throw new Error("That article slug already exists. Select it from the list to edit it.");
    }

    if (index === -1) list.unshift(article);
    else list[index] = article;

    await writeFile(`articles/${slug}.md`, $("a-content").value, `Publish article: ${article.title}`);
    await writeFile("articles/articles.json", jsonText(list), `Update article list: ${article.title}`);
    articles = list;
    fillSelects();
    $("article-select").value = slug;
    $("a-slug").readOnly = true;
    $("a-delete").hidden = false;
    setStatus("Article published. Your site host will redeploy from this commit.");
  } catch (error) {
    setStatus(error.message, true);
  }
});

$("a-delete").addEventListener("click", async () => {
  const slug = $("a-slug").value;
  if (!window.confirm(`Delete "${$("a-title").value}" from the repository?`)) return;

  setStatus("Deleting article...");
  try {
    const list = await readJSON("articles/articles.json");
    const updatedList = list.filter(article => article.file !== slug);
    await writeFile("articles/articles.json", jsonText(updatedList), `Remove article: ${slug}`);
    await deleteFile(`articles/${slug}.md`, `Delete article: ${slug}`);
    articles = updatedList;
    fillSelects();
    resetArticleForm();
    setStatus("Article deleted. Your site host will redeploy from these commits.");
  } catch (error) {
    setStatus(error.message, true);
  }
});

$("project-select").addEventListener("change", event => {
  const project = projects.find(item => item.title === event.target.value);
  if (!project) {
    resetProjectForm();
    setStatus("");
    return;
  }

  editingProject = project.title;
  $("p-title").value = project.title;
  $("p-description").value = project.description;
  $("p-tech").value = (project.tech || []).join(", ");
  $("p-live").value = project.live || "";
  $("p-code").value = project.code || "";
  $("p-delete").hidden = false;
  setStatus("");
});

$("project-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;

  const project = {
    title: $("p-title").value.trim(),
    description: $("p-description").value.trim(),
    tech: $("p-tech").value.split(",").map(tech => tech.trim()).filter(Boolean),
    live: $("p-live").value.trim(),
    code: $("p-code").value.trim()
  };
  if (!isSafeOptionalUrl(project.live) || !isSafeOptionalUrl(project.code)) {
    setStatus("Project links must use HTTPS.", true);
    return;
  }

  setStatus("Publishing project...");
  try {
    const list = await readJSON("projects.json");
    const index = list.findIndex(item => item.title === (editingProject || project.title));
    if (editingProject === null && index !== -1) {
      throw new Error("A project with that title already exists. Select it from the list to edit it.");
    }

    if (index === -1) list.unshift(project);
    else list[index] = project;
    await writeFile("projects.json", jsonText(list), `Update project: ${project.title}`);
    projects = list;
    editingProject = project.title;
    fillSelects();
    $("project-select").value = project.title;
    $("p-delete").hidden = false;
    setStatus("Project published. Your site host will redeploy from this commit.");
  } catch (error) {
    setStatus(error.message, true);
  }
});

$("p-delete").addEventListener("click", async () => {
  if (!editingProject || !window.confirm(`Delete "${editingProject}" from the repository?`)) return;

  setStatus("Deleting project...");
  try {
    const list = (await readJSON("projects.json")).filter(project => project.title !== editingProject);
    await writeFile("projects.json", jsonText(list), `Delete project: ${editingProject}`);
    projects = list;
    fillSelects();
    resetProjectForm();
    setStatus("Project deleted. Your site host will redeploy from this commit.");
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    const showArticles = button.dataset.tab === "articles";
    $("articles-tab").classList.toggle("active", showArticles);
    $("projects-tab").classList.toggle("active", !showArticles);
    $("articles-tab").setAttribute("aria-selected", String(showArticles));
    $("projects-tab").setAttribute("aria-selected", String(!showArticles));
    $("panel-articles").hidden = !showArticles;
    $("panel-projects").hidden = showArticles;
    setStatus("");
  });
});

async function connect(nextConfig) {
  config = nextConfig;
  const repoUrl = `${API}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`;
  await githubRequest(repoUrl);
  await githubRequest(`${repoUrl}/branches/${encodeURIComponent(config.branch)}`);
  await loadContent();
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  resetArticleForm();
  resetProjectForm();
  showEditor(true);
}

$("login-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;

  const nextConfig = {
    token: $("token").value.trim(),
    owner: $("owner").value.trim(),
    repo: $("repo").value.trim(),
    branch: $("branch").value.trim()
  };
  if (!/^[A-Za-z0-9-]+$/.test(nextConfig.owner) || !/^[A-Za-z0-9._-]+$/.test(nextConfig.repo)) {
    setStatus("Enter a valid GitHub owner and repository name.", true);
    return;
  }

  setStatus("Connecting to GitHub...");
  try {
    await connect(nextConfig);
    $("token").value = "";
    setStatus("");
  } catch (error) {
    config = null;
    sessionStorage.removeItem(STORAGE_KEY);
    showEditor(false);
    setStatus(error.message, true);
  }
});

$("logout").addEventListener("click", () => {
  sessionStorage.removeItem(STORAGE_KEY);
  config = null;
  articles = [];
  projects = [];
  showEditor(false);
  setStatus("");
});

async function restoreSession() {
  const savedConfig = sessionStorage.getItem(STORAGE_KEY);
  if (!savedConfig) return;

  try {
    await connect(JSON.parse(savedConfig));
  } catch (error) {
    config = null;
    sessionStorage.removeItem(STORAGE_KEY);
    showEditor(false);
    setStatus(`Saved session could not be restored: ${error.message}`, true);
  }
}

restoreSession();
