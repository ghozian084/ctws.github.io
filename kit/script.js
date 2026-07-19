/**
 * Ghozi Learning Kit — app logic
 * -----------------------------------------------------------------------
 * Permalink shape (matches the brief):
 *
 *   Embedded view:  /dm/{grade}/{topicId}?type={lp|bd|im|ws|ha}&index={n}
 *   Full file:      /dm/{grade}/{topicSlug}/{file}.html   (opened in a new tab)
 *
 * Example — Grade 9, Topic 1, Interactive Media #1:
 *   embedded  -> /dm/9/1?type=im&index=1
 *   full file -> /dm/g09/t01-review-number-concept/im-01.html
 *
 * For the "pretty" /dm/9/1 path to survive a hard refresh or a pasted
 * link on a static host, the host must fall back to index.html for
 * any /dm/* request. See _redirects (Netlify) / .htaccess (Apache) /
 * 404.html (GitHub Pages) shipped alongside this kit.
 */

const SECTION_ORDER = ["lp", "bd", "im", "ws", "ha"];
const SECTION_ICON = { lp: "📋", bd: "🧮", im: "🖥️", ws: "📝", ha: "✋" };

const state = { grade: null, topicId: null, type: null, index: null };
let suppressNextHashChange = false; // avoids re-navigating when we set the hash ourselves

function findGrade(gradeNum) {
  return LEARNING_KIT_DATA.grades.find((g) => g.grade === Number(gradeNum));
}

function findTopic(gradeNum, topicId) {
  const grade = findGrade(gradeNum);
  if (!grade) return null;
  return grade.topics.find((t) => t.id === Number(topicId));
}

function findFile(gradeNum, topicId, type, index) {
  const topic = findTopic(gradeNum, topicId);
  const section = topic && topic.sections[type];
  if (!section) return null;
  if (!index) return section.files[0] || null;
  return section.files.find((f) => f.index === Number(index)) || section.files[0] || null;
}

function fullFilePath(gradeNum, topicId, type, index) {
  const grade = findGrade(gradeNum);
  const topic = findTopic(gradeNum, topicId);
  const file = findFile(gradeNum, topicId, type, index);
  if (!grade || !topic || !file) return null;
  return `dm/${grade.folder}/${topic.slug}/${file.file}`;
}

function embeddedPermalink(gradeNum, topicId, type, index) {
  let url = `#/dm/${gradeNum}/${topicId}?type=${type}`;
  if (index) url += `&index=${index}`;
  return url;
}

/* ---------------------------------------------------------------- menu */

function buildMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  LEARNING_KIT_DATA.grades.forEach((grade) => {
    const gradeBlock = document.createElement("div");
    gradeBlock.className = "menu-grade";

    const gradeHeader = document.createElement("button");
    gradeHeader.className = "menu-grade-header";
    gradeHeader.type = "button";
    gradeHeader.innerHTML = `<span>${grade.label}</span><span class="chevron">▾</span>`;
    gradeHeader.addEventListener("click", () => gradeBlock.classList.toggle("collapsed"));
    gradeBlock.appendChild(gradeHeader);

    const topicList = document.createElement("div");
    topicList.className = "menu-topic-list";

    grade.topics.forEach((topic) => {
      const topicBlock = document.createElement("div");
      topicBlock.className = "menu-topic";
      topicBlock.dataset.grade = grade.grade;
      topicBlock.dataset.topic = topic.id;

      const topicHeader = document.createElement("button");
      topicHeader.className = "menu-topic-header";
      topicHeader.type = "button";
      topicHeader.innerHTML = `<span class="topic-num">${String(topic.id).padStart(2, "0")}</span><span class="topic-title">${topic.title}</span>`;
      topicHeader.addEventListener("click", () => topicBlock.classList.toggle("open"));
      topicBlock.appendChild(topicHeader);

      const sectionList = document.createElement("div");
      sectionList.className = "menu-section-list";

      SECTION_ORDER.forEach((type) => {
        const section = topic.sections[type];
        if (!section) return;

        const sectionBlock = document.createElement("div");
        sectionBlock.className = "menu-section";
        sectionBlock.innerHTML = `<span class="section-icon">${SECTION_ICON[type]}</span><span>${section.label}</span>`;
        sectionList.appendChild(sectionBlock);

        const fileList = document.createElement("div");
        fileList.className = "menu-file-list";

        section.files.forEach((file) => {
          const link = document.createElement("button");
          link.type = "button";
          link.className = "menu-file";
          link.dataset.grade = grade.grade;
          link.dataset.topic = topic.id;
          link.dataset.type = type;
          link.dataset.index = file.index || "";
          link.textContent = file.title;
          link.addEventListener("click", () => navigate(grade.grade, topic.id, type, file.index, true));
          fileList.appendChild(link);
        });

        sectionList.appendChild(fileList);
      });

      topicBlock.appendChild(sectionList);
      topicList.appendChild(topicBlock);
    });

    gradeBlock.appendChild(topicList);
    menu.appendChild(gradeBlock);
  });
}

function highlightActive() {
  document.querySelectorAll(".menu-file").forEach((el) => {
    const match =
      Number(el.dataset.grade) === state.grade &&
      Number(el.dataset.topic) === state.topicId &&
      el.dataset.type === state.type &&
      (el.dataset.index === "" ? !state.index : Number(el.dataset.index) === Number(state.index));
    el.classList.toggle("active", match);
  });
  document.querySelectorAll(".menu-topic").forEach((el) => {
    const match = Number(el.dataset.grade) === state.grade && Number(el.dataset.topic) === state.topicId;
    if (match) el.classList.add("open");
  });
}

/* ------------------------------------------------------------- content */

function renderContent() {
  const { grade, topicId, type, index } = state;
  const topic = findTopic(grade, topicId);
  const gradeData = findGrade(grade);
  const file = findFile(grade, topicId, type, index);
  const path = fullFilePath(grade, topicId, type, index);

  const frame = document.getElementById("content-frame");
  const emptyState = document.getElementById("content-empty");
  const breadcrumb = document.getElementById("breadcrumb");
  const openBtn = document.getElementById("open-full-btn");
  const permalinkBox = document.getElementById("permalink-box");

  if (!topic || !file || !path) {
    frame.style.display = "none";
    emptyState.style.display = "flex";
    breadcrumb.textContent = "Nothing selected yet";
    openBtn.disabled = true;
    permalinkBox.textContent = "";
    return;
  }

  emptyState.style.display = "none";
  frame.style.display = "block";
  frame.src = path;

  const section = topic.sections[type];
  breadcrumb.textContent = `${gradeData.label} › ${topic.title} › ${section.label}${file.index ? " " + file.index : ""}`;

  openBtn.disabled = false;
  openBtn.onclick = () => window.open(path, "_blank", "noopener");

  permalinkBox.textContent = embeddedPermalink(grade, topicId, type, index);

  highlightActive();
}

function navigate(grade, topicId, type, index, pushHistory) {
  state.grade = Number(grade);
  state.topicId = Number(topicId);
  state.type = type;
  state.index = index || null;

  if (pushHistory) {
    // Hash-only navigation: no pushState, no server involved at all.
    // Works identically double-clicked from a folder (file://), hosted
    // on GitHub Pages, or on any other static host.
    suppressNextHashChange = true;
    window.location.hash = embeddedPermalink(state.grade, state.topicId, state.type, state.index);
  }
  renderContent();
}

/* --------------------------------------------------------------- route */

function parseLocation() {
  // Expected hash shape: #/dm/{grade}/{topicId}?type=..&index=..
  // Hash fragments are never sent to a server and are always readable,
  // so this works identically from file://, GitHub Pages, or any host.
  const raw = window.location.hash.replace(/^#/, ""); // "/dm/9/1?type=im&index=1"
  const [pathPart, queryPart] = raw.split("?");
  const parts = pathPart.split("/").filter(Boolean);
  const params = new URLSearchParams(queryPart || "");

  if (parts[0] === "dm" && parts[1] && parts[2]) {
    const grade = Number(parts[1]);
    const topicId = Number(parts[2]);
    const type = params.get("type") || "lp";
    const index = params.get("index");
    if (findFile(grade, topicId, type, index)) {
      return { grade, topicId, type, index };
    }
  }

  return null;
}

function boot() {
  document.getElementById("kit-title").textContent = LEARNING_KIT_DATA.kitTitle;
  document.title = LEARNING_KIT_DATA.kitTitle;

  buildMenu();

  const route = parseLocation();
  if (route) {
    navigate(route.grade, route.topicId, route.type, route.index, false);
  } else {
    const firstGrade = LEARNING_KIT_DATA.grades[0];
    const firstTopic = firstGrade.topics[0];
    navigate(firstGrade.grade, firstTopic.id, "lp", null, true);
  }

  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });
  document.getElementById("menu-scrim").addEventListener("click", () => {
    document.body.classList.remove("menu-open");
  });
}

window.addEventListener("hashchange", () => {
  if (suppressNextHashChange) {
    suppressNextHashChange = false;
    return;
  }
  const route = parseLocation();
  if (route) navigate(route.grade, route.topicId, route.type, route.index, false);
});

document.addEventListener("DOMContentLoaded", boot);
