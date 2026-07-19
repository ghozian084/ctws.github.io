# Mr. Ghozi Learning Kit

A simple front-end for navigating your Grade 9 / Grade 12 lesson materials:
Lesson Plan, Board, Interactive Media, Worksheet, and Hands-on Activity —
each shown embedded in the page, with a one-click "open full file" in a
new tab.

## How it's put together

```
index.html      the whole app shell (title bar, menu, content pane, footer)
style.css       all styling
script.js       router + menu builder + content loader
data.js         the curriculum map — THIS is what you edit to add content
dm/             your actual lesson files, one folder per grade > topic
  g09/t01-review-number-concept/lp.html, bd-01.html, im-01.html, ws-01.html, ws-02.html, ha-01.html
  g12/t01-permutation-combination/...
```

## Adding a new topic or file

1. Drop the `.html` file into `dm/g{grade}/{topic-slug}/`, following the
   existing naming pattern:
   - `lp.html` — lesson plan (always exactly one)
   - `bd-01.html`, `bd-02.html`, … — board
   - `im-01.html`, `im-02.html`, … — interactive media
   - `ws-01.html`, `ws-02.html`, … — worksheet
   - `ha-01.html`, `ha-02.html`, … — hands-on activity
2. Add one entry for it in `data.js`, inside the matching topic's
   `sections` object.
3. That's it — the menu and the router pick it up automatically. No other
   file needs to change.

## Permalinks

Two forms, both pointing at the same content:

- **Embedded (in-app) view** — a hash link, so it never touches the server:
  `index.html#/dm/{grade}/{topicId}?type={lp|bd|im|ws|ha}&index={n}`
  Example: Grade 9, Topic 1, Interactive Media 1 → `index.html#/dm/9/1?type=im&index=1`
  (`index` is only needed for sections with more than one file, e.g. `ws-02.html` → `&index=2`.)

- **Full file** — the real path on disk, opened by the "Open full file" button:
  `dm/g{grade}/{topic-slug}/{file}.html`
  Example: `dm/g09/t01-review-number-concept/im-01.html`

The short form is what students bookmark or share; the long form is what
loads when they click "open full file in new tab."

Because the short form is a `#` hash fragment, it's handled entirely by
the browser and never sent to a server — so it works identically whether
you double-click `index.html` in a folder, host it on GitHub Pages, or
put it on any other server. Refreshing or pasting a link like
`index.html#/dm/9/1?type=im&index=1` always lands on the right content,
no rewrite rules needed anywhere.

## Local preview

Just double-click `index.html` — it's built to run straight from a folder,
no server required. If you ever do want to serve it (optional):

```bash
cd ghozi-learning-kit
python3 -m http.server 8000
# open http://localhost:8000
```
