# My Portfolio

A personal portfolio built with plain HTML, CSS, and JavaScript.

## Run locally

The site fetches its JSON and Markdown content, so open it through a local web server rather than directly as a file. In VS Code, start the Live Server extension from `index.html`.

## Add content

- Add an article Markdown file under `articles/` and an entry with its title, date, filename (without `.md`), and summary to `articles/articles.json`.
- Add projects to `projects.json` with a title, description, technologies, and optional `live` and `code` URLs.
- Update the profile links in the page footers when social accounts change.

## Admin publishing

Open `admin.html` on your deployed site or local server. Create a fine-grained GitHub token scoped to this repository with Contents read/write permission and an expiry. The token is only held in this browser tab's `sessionStorage`; do not use the admin page on a shared or untrusted device. Enter the repository owner, name, and publishing branch to connect. Revoke the token in GitHub settings if you no longer need it or suspect it was exposed.