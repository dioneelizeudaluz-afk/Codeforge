// ==========================================
// CODEFORGE V3
// MULTI PROJECT ENGINE
// ==========================================

const codeEditor = document.getElementById("codeEditor");
const chatInput = document.getElementById("chatInput");

const sendBtn = document.getElementById("sendBtn");
const saveBtn = document.getElementById("saveBtn");
const previewBtn = document.getElementById("previewBtn");

const newProjectBtn = document.getElementById("newProject");
const newFileBtn = document.getElementById("newFileBtn");
const homeBtn = document.getElementById("homeBtn");

const fileExplorer =
  document.getElementById("fileExplorer");

const projectList =
  document.getElementById("projectList");

const projectName =
  document.getElementById("projectName");

const currentFileName =
  document.getElementById("currentFileName");

const currentLanguage =
  document.getElementById("currentLanguage");


// ==========================================
// STORAGE
// ==========================================

const STORAGE_KEY =
  "codeforge_projects_v3";

const ACTIVE_KEY =
  "codeforge_active_project_v3";


// ==========================================
// DEFAULT FILES
// ==========================================

function createDefaultFiles(name) {

  return {

    "index.html":
`<!DOCTYPE html>
<html lang="pt">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>${escapeHTML(name)}</title>

  <link
    rel="stylesheet"
    href="style.css"
  >

</head>

<body>

  <main>

    <h1>${escapeHTML(name)}</h1>

    <p>
      Projeto criado no CodeForge.
    </p>

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
`console.log("${escapeHTML(name)} iniciado.");`

  };

}


// ==========================================
// CREATE PROJECT
// ==========================================

function makeProject(name, type) {

  return {

    id:
      "project_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 8),

    name: name,

    type: type,

    currentFile: "index.html",

    files: createDefaultFiles(name)

  };

}


// ==========================================
// LOAD PROJECTS
// ==========================================

function loadProjects() {

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!saved) {

    const firstProject =
      makeProject(
        "Meu Projeto",
        "Projeto Web"
      );


    const projects = [
      firstProject
    ];


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(projects)
    );


    localStorage.setItem(
      ACTIVE_KEY,
      firstProject.id
    );


    return projects;

  }


  try {

    return JSON.parse(saved);

  } catch {

    const firstProject =
      makeProject(
        "Meu Projeto",
        "Projeto Web"
      );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        firstProject
      ])
    );


    localStorage.setItem(
      ACTIVE_KEY,
      firstProject.id
    );


    return [
      firstProject
    ];

  }

}


let projects =
  loadProjects();


// ==========================================
// ACTIVE PROJECT
// ==========================================

let activeProjectId =
  localStorage.getItem(
    ACTIVE_KEY
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

  localStorage.setItem(
    ACTIVE_KEY,
    activeProjectId
  );

}


// ==========================================
// SAVE ALL PROJECTS
// ==========================================

function saveAllProjects() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projects)
  );

  localStorage.setItem(
    ACTIVE_KEY,
    currentProject.id
  );

}


// ==========================================
// SAVE CURRENT FILE
// ==========================================

function saveCurrentFile() {

  if (!currentProject) {
    return;
  }


  currentProject.files[
    currentProject.currentFile
  ] = codeEditor.value;


  saveAllProjects();

}


// ==========================================
// PROJECT LIST
// ==========================================

function renderProjects() {

  projectList.innerHTML = "";


  projects.forEach(
    (project) => {

      const button =
        document.createElement(
          "button"
        );


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


      button.onclick = () => {

        switchProject(
          project.id
        );

      };


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


  const project =
    projects.find(
      item =>
        item.id === projectId
    );


  if (!project) {
    return;
  }


  currentProject =
    project;


  activeProjectId =
    project.id;


  saveAllProjects();


  updateProjectInterface();

}


// ==========================================
// UPDATE INTERFACE
// ==========================================

function updateProjectInterface() {

  updateProjectName();

  renderProjects();

  renderFiles();

  openFile(
    currentProject.currentFile ||
    "index.html"
  );

}


// ==========================================
// PROJECT NAME
// ==========================================

function updateProjectName() {

  projectName.innerHTML = `

    <span class="status"></span>

    ${escapeHTML(
      currentProject.name
    )}

  `;

}


// ==========================================
// FILE LANGUAGE
// ==========================================

function getLanguage(fileName) {

  if (fileName.endsWith(".html")) {
    return "HTML";
  }

  if (fileName.endsWith(".css")) {
    return "CSS";
  }

  if (fileName.endsWith(".js")) {
    return "JavaScript";
  }

  if (fileName.endsWith(".json")) {
    return "JSON";
  }

  if (fileName.endsWith(".jsx")) {
    return "JSX";
  }

  return "CODE";

}


// ==========================================
// FILE ICON
// ==========================================

function getFileIcon(fileName) {

  if (fileName.endsWith(".html")) {
    return "◇";
  }

  if (fileName.endsWith(".css")) {
    return "#";
  }

  if (fileName.endsWith(".js")) {
    return "JS";
  }

  if (fileName.endsWith(".json")) {
    return "{}";
  }

  return "•";

}


// ==========================================
// FILE EXPLORER
// ==========================================

function renderFiles() {

  fileExplorer.innerHTML = "";


  Object.keys(
    currentProject.files
  ).forEach(
    (fileName) => {

      const button =
        document.createElement(
          "button"
        );


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
          ${getFileIcon(fileName)}
        </span>

        <span class="file-name">
          ${escapeHTML(fileName)}
        </span>

      `;


      button.onclick = () => {

        openFile(fileName);

      };


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


  currentFileName.textContent =
    fileName;


  currentLanguage.textContent =
    getLanguage(fileName);


  renderFiles();


  saveAllProjects();

}


// ==========================================
// NEW PROJECT MODAL
// ==========================================

function openNewProject() {

  const oldModal =
    document.getElementById(
      "projectModal"
    );


  if (oldModal) {
    oldModal.remove();
  }


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "projectModal";


  modal.innerHTML = `

    <div class="cf-modal">

      <div
        class="cf-modal-header"
        style="
          display:flex;
          align-items:center;
          justify-content:space-between;
        "
      >

        <h2>Novo projeto</h2>

        <button
          id="closeProjectModal"
          type="button"
        >
          ×
        </button>

      </div>


      <p>
        Crie um novo projeto no CodeForge.
      </p>


      <label>
        Nome do projeto
      </label>

      <input
        id="projectNameInput"
        type="text"
        placeholder="Ex: Achados MZ"
      >


      <label>
        Tipo de projeto
      </label>

      <select
        id="projectTypeInput"
      >

        <option>
          Projeto Web
        </option>

        <option>
          Landing Page
        </option>

        <option>
          Página de Vendas
        </option>

        <option>
          Dashboard
        </option>

        <option>
          App Financeiro
        </option>

        <option>
          SaaS
        </option>

        <option>
          Projeto em Branco
        </option>

      </select>


      <button
        id="createProjectButton"
        type="button"
      >
        Criar projeto
      </button>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  modal.style.position =
    "fixed";

  modal.style.inset = "0";

  modal.style.zIndex =
    "99999";

  modal.style.background =
    "rgba(0,0,0,.78)";

  modal.style.display =
    "flex";

  modal.style.alignItems =
    "center";

  modal.style.justifyContent =
    "center";

  modal.style.padding =
    "20px";


  const box =
    modal.querySelector(
      ".cf-modal"
    );


  box.style.width =
    "100%";

  box.style.maxWidth =
    "430px";

  box.style.background =
    "#0d1117";

  box.style.border =
    "1px solid #29313d";

  box.style.borderRadius =
    "14px";

  box.style.padding =
    "20px";

  box.style.color =
    "#ffffff";


  const inputs =
    modal.querySelectorAll(
      "input, select"
    );


  inputs.forEach(
    input => {

      input.style.width =
        "100%";

      input.style.marginTop =
        "7px";

      input.style.padding =
        "12px";

      input.style.border =
        "1px solid #29313d";

      input.style.borderRadius =
        "8px";

      input.style.background =
        "#080b10";

      input.style.color =
        "#ffffff";

      input.style.boxSizing =
        "border-box";

    }
  );


  const createButton =
    document.getElementById(
      "createProjectButton"
    );


  createButton.style.width =
    "100%";

  createButton.style.marginTop =
    "20px";

  createButton.style.padding =
    "13px";

  createButton.style.border =
    "0";

  createButton.style.borderRadius =
    "8px";

  createButton.style.background =
    "#087cff";

  createButton.style.color =
    "#ffffff";


  document
    .getElementById(
      "closeProjectModal"
    )
    .onclick = () => {

      modal.remove();

    };


  createButton.onclick =
    createProject;

}


// ==========================================
// CREATE PROJECT
// ==========================================

function createProject() {

  const name =
    document
      .getElementById(
        "projectNameInput"
      )
      .value
      .trim();


  const type =
    document
      .getElementById(
        "projectTypeInput"
      )
      .value;


  if (!name) {

    alert(
      "Digite o nome do projeto."
    );

    return;

  }


  const newProject =
    makeProject(
      name,
      type
    );


  projects.push(
    newProject
  );


  currentProject =
    newProject;


  activeProjectId =
    newProject.id;


  saveAllProjects();


  updateProjectInterface();


  const modal =
    document.getElementById(
      "projectModal"
    );


  if (modal) {
    modal.remove();
  }


  showMessage(
    "Projeto criado com sucesso."
  );

}


// ==========================================
// NEW FILE
// ==========================================

function createNewFile() {

  const fileName =
    prompt(
      "Nome do novo ficheiro:\nEx: contacto.html"
    );


  if (!fileName) {
    return;
  }


  const cleanName =
    fileName.trim();


  if (!cleanName) {
    return;
  }


  if (
    currentProject.files[
      cleanName
    ] !== undefined
  ) {

    alert(
      "Esse ficheiro já existe."
    );

    return;

  }


  currentProject.files[
    cleanName
  ] = "";


  saveAllProjects();

  renderFiles();

  openFile(
    cleanName
  );


  showMessage(
    "Ficheiro criado."
  );

}


// ==========================================
// DELETE PROJECT
// ==========================================

function deleteProject(projectId) {

  if (projects.length <= 1) {

    alert(
      "Não podes apagar o último projeto."
    );

    return;

  }


  const project =
    projects.find(
      item =>
        item.id === projectId
    );


  if (!project) {
    return;
  }


  const confirmed =
    confirm(
      `Apagar o projeto "${project.name}"?`
    );


  if (!confirmed) {
    return;
  }


  projects =
    projects.filter(
      item =>
        item.id !== projectId
    );


  currentProject =
    projects[0];


  saveAllProjects();

  updateProjectInterface();


  showMessage(
    "Projeto apagado."
  );

}


// ==========================================
// SAVE
// ==========================================

if (saveBtn) {

  saveBtn.onclick = () => {

    saveCurrentFile();

    showMessage(
      "Projeto salvo."
    );

  };

}


// ==========================================
// NEW PROJECT
// ==========================================

if (newProjectBtn) {

  newProjectBtn.onclick = () => {

    openNewProject();

  };

}


// ==========================================
// NEW FILE
// ==========================================

if (newFileBtn) {

  newFileBtn.onclick = () => {

    createNewFile();

  };

}


// ==========================================
// HOME
// ==========================================

if (homeBtn) {

  homeBtn.onclick = () => {

    currentProject =
      projects[0];


    activeProjectId =
      currentProject.id;


    saveAllProjects();

    updateProjectInterface();


    showMessage(
      "Projeto inicial carregado."
    );

  };

}


// ==========================================
// CHAT
// ==========================================

if (sendBtn) {

  sendBtn.onclick = () => {

    const content =
      chatInput.value.trim();


    if (!content) {

      alert(
        "Cole algum código no chat."
      );

      return;

    }


    codeEditor.value =
      content;


    currentProject.files[
      currentProject.currentFile
    ] = content;


    saveAllProjects();


    chatInput.value = "";


    showMessage(
      "Código importado."
    );

  };

}


// ==========================================
// PREVIEW
// ==========================================

if (previewBtn) {

  previewBtn.onclick = () => {

    saveCurrentFile();


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

      alert(
        "Permita pop-ups para usar o Preview."
      );

      return;

    }


    let page =
      html;


    page =
      page.replace(
        "</head>",
        `<style>${css}</style></head>`
      );


    page =
      page.replace(
        "</body>",
        `<script>${js.replace(
          /<\/script>/gi,
          "<\\/script>"
        )}</script></body>`
      );


    preview.document.open();

    preview.document.write(
      page
    );

    preview.document.close();

  };

}


// ==========================================
// EDITOR
// ==========================================

if (codeEditor) {

  codeEditor.addEventListener(
    "input",
    () => {

      currentProject.files[
        currentProject.currentFile
      ] = codeEditor.value;

    }
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
// MESSAGE
// ==========================================

function showMessage(message) {

  const box =
    document.createElement(
      "div"
    );


  box.textContent =
    message;


  box.style.position =
    "fixed";

  box.style.left =
    "50%";

  box.style.bottom =
    "22px";

  box.style.transform =
    "translateX(-50%)";

  box.style.zIndex =
    "100000";

  box.style.padding =
    "11px 18px";

  box.style.borderRadius =
    "8px";

  box.style.background =
    "#087cff";

  box.style.color =
    "#ffffff";

  box.style.fontSize =
    "13px";


  document.body.appendChild(
    box
  );


  setTimeout(
    () => box.remove(),
    2200
  );

}


// ==========================================
// START
// ==========================================

updateProjectName();

renderProjects();

renderFiles();

openFile(
  currentProject.currentFile ||
  "index.html"
);
