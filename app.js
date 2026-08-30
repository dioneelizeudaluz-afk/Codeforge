// ==========================================
// CODEFORGE
// PROJECT WORKSPACE
// ==========================================

const STORAGE_KEY = "codeforge_projects_final";
const ACTIVE_PROJECT_KEY = "codeforge_active_project_final";


// ==========================================
// ELEMENTS
// ==========================================

const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

const homeBtn = document.getElementById("homeBtn");
const newProjectBtn = document.getElementById("newProject");
const deleteProjectBtn = document.getElementById("deleteProjectBtn");

const projectList = document.getElementById("projectList");
const projectName = document.getElementById("projectName");

const fileExplorer = document.getElementById("fileExplorer");
const currentLanguage = document.getElementById("currentLanguage");

const codeEditor = document.getElementById("codeEditor");
const lineNumbers = document.getElementById("lineNumbers");

const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const saveBtn = document.getElementById("saveBtn");
const previewBtn = document.getElementById("previewBtn");

const toast = document.getElementById("toast");


// ==========================================
// DEFAULT FILES
// ==========================================

function defaultFiles(projectName) {

  return {

    "index.html":
`<!DOCTYPE html>
<html lang="pt">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(projectName)}</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>

  <main>
    <h1>${escapeHTML(projectName)}</h1>
    <p>Projeto criado no CodeForge.</p>
  </main>

  <script src="app.js"></script>

</body>
</html>`,

    "style.css":
`* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #ffffff;
  color: #111111;
}

main {
  max-width: 1100px;
  margin: auto;
  padding: 60px 20px;
}`,

    "app.js":
`console.log("${escapeHTML(projectName)} iniciado.");`

  };

}


// ==========================================
// PROJECT CREATION
// ==========================================

function createProjectData(name, type) {

  return {

    id:
      "project_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 8),

    name: name,

    type: type,

    currentFile: "index.html",

    files: defaultFiles(name),

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString()

  };

}


// ==========================================
// LOAD PROJECTS
// ==========================================

function loadProjects() {

  const saved =
    localStorage.getItem(STORAGE_KEY);


  if (!saved) {

    const first =
      createProjectData(
        "Meu Projeto",
        "Projeto Web"
      );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([first])
    );


    localStorage.setItem(
      ACTIVE_PROJECT_KEY,
      first.id
    );


    return [first];

  }


  try {

    const parsed =
      JSON.parse(saved);


    if (
      !Array.isArray(parsed) ||
      parsed.length === 0
    ) {

      throw new Error(
        "Invalid projects"
      );

    }


    return parsed;

  } catch {

    const first =
      createProjectData(
        "Meu Projeto",
        "Projeto Web"
      );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([first])
    );


    localStorage.setItem(
      ACTIVE_PROJECT_KEY,
      first.id
    );


    return [first];

  }

}


let projects = loadProjects();


// ==========================================
// ACTIVE PROJECT
// ==========================================

let activeProjectId =
  localStorage.getItem(
    ACTIVE_PROJECT_KEY
  );


let currentProject =
  projects.find(
    project =>
      project.id === activeProjectId
  );


if (!currentProject) {

  currentProject =
    projects[0];

  activeProjectId =
    currentProject.id;

}


// ==========================================
// SAVE STORAGE
// ==========================================

function saveStorage() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projects)
  );

  localStorage.setItem(
    ACTIVE_PROJECT_KEY,
    currentProject.id
  );

}


// ==========================================
// SAVE CURRENT FILE
// ==========================================

function saveCurrentFile() {

  if (
    !currentProject ||
    !currentProject.files ||
    !currentProject.currentFile
  ) {

    return;

  }


  currentProject.files[
    currentProject.currentFile
  ] = codeEditor.value;


  currentProject.updatedAt =
    new Date().toISOString();

}


// ==========================================
// MENU
// ==========================================

function openMenu() {

  sideMenu.classList.add("open");

  menuOverlay.classList.add("open");

}


function closeMenu() {

  sideMenu.classList.remove("open");

  menuOverlay.classList.remove("open");

}


menuBtn.addEventListener(
  "click",
  openMenu
);


closeMenuBtn.addEventListener(
  "click",
  closeMenu
);


menuOverlay.addEventListener(
  "click",
  closeMenu
);


// ==========================================
// PROJECT LIST
// ==========================================

function renderProjects() {

  projectList.innerHTML = "";


  projects.forEach(
    project => {

      const button =
        document.createElement("button");


      button.type = "button";

      button.className =
        "project-item";


      if (
        project.id ===
        currentProject.id
      ) {

        button.classList.add(
          "active"
        );

      }


      button.innerHTML = `

        <span class="project-dot"></span>

        <span class="project-item-name">
          ${escapeHTML(project.name)}
        </span>

      `;


      button.addEventListener(
        "click",
        () => {

          switchProject(
            project.id
          );

        }
      );


      projectList.appendChild(
        button
      );

    }
  );

}


// ==========================================
// SWITCH PROJECT
// ==========================================

function switchProject(projectId) {

  saveCurrentFile();

  saveStorage();


  const selected =
    projects.find(
      project =>
        project.id === projectId
    );


  if (!selected) {
    return;
  }


  currentProject =
    selected;


  activeProjectId =
    selected.id;


  saveStorage();

  updateInterface();

  closeMenu();


  showToast(
    "Projeto aberto."
  );

}


// ==========================================
// PROJECT NAME
// ==========================================

function renderProjectName() {

  projectName.innerHTML = `

    <span class="online-dot"></span>

    <span>
      ${escapeHTML(currentProject.name)}
    </span>

  `;

}


// ==========================================
// FILE ICON
// ==========================================

function fileIcon(name) {

  if (name.endsWith(".html")) {
    return "◇";
  }

  if (name.endsWith(".css")) {
    return "#";
  }

  if (name.endsWith(".js")) {
    return "JS";
  }

  if (name.endsWith(".json")) {
    return "{}";
  }

  return "•";

}


// ==========================================
// LANGUAGE
// ==========================================

function getLanguage(name) {

  if (name.endsWith(".html")) {
    return "HTML";
  }

  if (name.endsWith(".css")) {
    return "CSS";
  }

  if (name.endsWith(".js")) {
    return "JavaScript";
  }

  if (name.endsWith(".json")) {
    return "JSON";
  }

  return "CODE";

}


// ==========================================
// FILE EXPLORER
// ==========================================

function renderFiles() {

  fileExplorer.innerHTML = "";


  Object.keys(
    currentProject.files
  ).forEach(
    fileName => {

      const button =
        document.createElement("button");


      button.type = "button";

      button.className = "file";


      if (
        fileName ===
        currentProject.currentFile
      ) {

        button.classList.add(
          "active"
        );

      }


      button.innerHTML = `

        <span class="file-icon">
          ${fileIcon(fileName)}
        </span>

        <span>
          ${escapeHTML(fileName)}
        </span>

      `;


      button.addEventListener(
        "click",
        () => {

          openFile(fileName);

        }
      );


      fileExplorer.appendChild(
        button
      );

    }
  );

}


// ==========================================
// OPEN FILE
// ==========================================

function openFile(fileName) {

  if (
    currentProject.files[
      fileName
    ] === undefined
  ) {

    return;

  }


  saveCurrentFile();


  currentProject.currentFile =
    fileName;


  codeEditor.value =
    currentProject.files[
      fileName
    ];


  currentLanguage.textContent =
    getLanguage(fileName);


  renderFiles();

  updateLineNumbers();

}


// ==========================================
// UPDATE LINE NUMBERS
// ==========================================

function updateLineNumbers() {

  const total =
    Math.max(
      codeEditor.value.split("\n").length,
      1
    );


  let numbers = "";


  for (
    let i = 1;
    i <= total;
    i++
  ) {

    numbers +=
      i +
      (i < total ? "\n" : "");

  }


  lineNumbers.textContent =
    numbers;

}


// ==========================================
// EDITOR
// ==========================================

codeEditor.addEventListener(
  "input",
  () => {

    currentProject.files[
      currentProject.currentFile
    ] = codeEditor.value;


    currentProject.updatedAt =
      new Date().toISOString();


    updateLineNumbers();

  }
);


codeEditor.addEventListener(
  "scroll",
  () => {

    lineNumbers.scrollTop =
      codeEditor.scrollTop;

  }
);


// ==========================================
// SAVE
// ==========================================

saveBtn.addEventListener(
  "click",
  () => {

    saveCurrentFile();

    saveStorage();

    showToast(
      "Projeto salvo."
    );

  }
);


// ==========================================
// NEW PROJECT
// ==========================================

newProjectBtn.addEventListener(
  "click",
  openNewProject
);


function openNewProject() {

  const old =
    document.getElementById(
      "projectModal"
    );


  if (old) {
    old.remove();
  }


  const overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "projectModal";


  overlay.className =
    "modal-overlay";


  overlay.innerHTML = `

    <div class="modal">

      <div class="modal-header">

        <h2>Novo projeto</h2>

        <button
          id="modalClose"
          class="modal-close"
          type="button"
        >
          ×
        </button>

      </div>

      <p>
        Crie um novo projeto para começar a trabalhar.
      </p>

      <label for="projectNameInput">
        Nome do projeto
      </label>

      <input
        id="projectNameInput"
        type="text"
        placeholder="Ex: Achados MZ"
        autocomplete="off"
      >

      <label for="projectTypeInput">
        Tipo
      </label>

      <select id="projectTypeInput">

        <option>Projeto Web</option>
        <option>Landing Page</option>
        <option>Página de Vendas</option>
        <option>Dashboard</option>
        <option>SaaS</option>
        <option>App Financeiro</option>
        <option>Projeto em Branco</option>

      </select>

      <button
        id="createProjectBtn"
        class="modal-create"
        type="button"
      >
        Criar projeto
      </button>

    </div>

  `;


  document.body.appendChild(
    overlay
  );


  const close =
    document.getElementById(
      "modalClose"
    );


  const create =
    document.getElementById(
      "createProjectBtn"
    );


  const input =
    document.getElementById(
      "projectNameInput"
    );


  close.addEventListener(
    "click",
    () => overlay.remove()
  );


  overlay.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        overlay
      ) {

        overlay.remove();

      }

    }
  );


  create.addEventListener(
    "click",
    () => {

      const name =
        input.value.trim();


      const type =
        document.getElementById(
          "projectTypeInput"
        ).value;


      if (!name) {

        showToast(
          "Digite o nome do projeto."
        );

        input.focus();

        return;

      }


      const project =
        createProjectData(
          name,
          type
        );


      projects.push(
        project
      );


      currentProject =
        project;


      activeProjectId =
        project.id;


      saveStorage();

      updateInterface();

      overlay.remove();

      closeMenu();


      showToast(
        "Projeto criado."
      );

    }
  );


  setTimeout(
    () => input.focus(),
    50
  );

}


// ==========================================
// DELETE PROJECT
// ==========================================

deleteProjectBtn.addEventListener(
  "click",
  deleteCurrentProject
);


function deleteCurrentProject() {

  if (
    projects.length <= 1
  ) {

    showToast(
      "É necessário manter pelo menos um projeto."
    );

    return;

  }


  const confirmed =
    confirm(
      `Apagar o projeto "${currentProject.name}"?\n\nEsta ação não pode ser desfeita.`
    );


  if (!confirmed) {
    return;
  }


  const deletedId =
    currentProject.id;


  projects =
    projects.filter(
      project =>
        project.id !== deletedId
    );


  currentProject =
    projects[0];


  activeProjectId =
    currentProject.id;


  saveStorage();

  updateInterface();

  closeMenu();


  showToast(
    "Projeto apagado."
  );

}


// ==========================================
// CHAT / IMPORT CODE
// ==========================================

sendBtn.addEventListener(
  "click",
  importCode
);


function importCode() {

  const content =
    chatInput.value.trim();


  if (!content) {

    showToast(
      "Escreva ou cole algum código."
    );

    chatInput.focus();

    return;

  }


  codeEditor.value =
    content;


  currentProject.files[
    currentProject.currentFile
  ] = content;


  currentProject.updatedAt =
    new Date().toISOString();


  saveStorage();

  updateLineNumbers();


  chatInput.value = "";


  showToast(
    "Código inserido no editor."
  );

}


// ==========================================
// CHAT ENTER
// ==========================================

chatInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey)
    ) {

      event.preventDefault();

      importCode();

    }

  }
);


// ==========================================
// PREVIEW
// ==========================================

previewBtn.addEventListener(
  "click",
  openPreview
);


function openPreview() {

  saveCurrentFile();

  saveStorage();


  const html =
    currentProject.files[
      "index.html"
    ] || "";


  const css =
    currentProject.files[
      "style.css"
    ] || "";


  const js =
    currentProject.files[
      "app.js"
    ] || "";


  const preview =
    window.open(
      "",
      "_blank"
    );


  if (!preview) {

    showToast(
      "Permita pop-ups para abrir o Preview."
    );

    return;

  }


  let page =
    html;


  if (
    page.includes("</head>")
  ) {

    page =
      page.replace(
        "</head>",
        `<style>${css}</style></head>`
      );

  } else {

    page =
      `<style>${css}</style>` +
      page;

  }


  const safeJS =
    js.replace(
      /<\/script>/gi,
      "<\\/script>"
    );


  if (
    page.includes("</body>")
  ) {

    page =
      page.replace(
        "</body>",
        `<script>${safeJS}</script></body>`
      );

  } else {

    page +=
      `<script>${safeJS}</script>`;

  }


  preview.document.open();

  preview.document.write(
    page
  );

  preview.document.close();

}


// ==========================================
// HOME
// ==========================================

homeBtn.addEventListener(
  "click",
  () => {

    closeMenu();

    showToast(
      "CodeForge"
    );

  }
);


// ==========================================
// UPDATE INTERFACE
// ==========================================

function updateInterface() {

  renderProjectName();

  renderProjects();

  renderFiles();

  openFile(
    currentProject.currentFile ||
    "index.html"
  );

}


// ==========================================
// TOAST
// ==========================================

let toastTimer;


function showToast(message) {

  clearTimeout(
    toastTimer
  );


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ==========================================
// START
// ==========================================

updateInterface();

updateLineNumbers();
