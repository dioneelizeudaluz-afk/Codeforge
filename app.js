// ==========================================
// CODEFORGE
// PROJECT MANAGER V2
// ==========================================

const codeEditor = document.getElementById("codeEditor");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const saveBtn = document.getElementById("saveBtn");
const previewBtn = document.getElementById("previewBtn");
const newProjectBtn = document.getElementById("newProject");
const homeBtn = document.getElementById("homeBtn");


// ==========================================
// PROJECT
// ==========================================

let currentProject = {
  name: "Meu Projeto",
  type: "Projeto Web",

  files: {
    "index.html": codeEditor ? codeEditor.value : "",
    "style.css": "",
    "app.js": ""
  },

  currentFile: "index.html"
};


// ==========================================
// LOAD PROJECT
// ==========================================

function loadProject() {

  const saved = localStorage.getItem("codeforge_project");

  if (!saved) return;

  try {

    currentProject = JSON.parse(saved);

    if (
      currentProject.files &&
      currentProject.files[currentProject.currentFile]
    ) {

      codeEditor.value =
        currentProject.files[
          currentProject.currentFile
        ];

    }

    updateProjectName();

  } catch (error) {

    console.error(error);

  }

}


// ==========================================
// SAVE
// ==========================================

function saveProject() {

  currentProject.files[
    currentProject.currentFile
  ] = codeEditor.value;

  localStorage.setItem(
    "codeforge_project",
    JSON.stringify(currentProject)
  );

  showMessage("Projeto salvo.");


}


// ==========================================
// PROJECT NAME
// ==========================================

function updateProjectName() {

  const element =
    document.querySelector(".project-name");

  if (!element) return;

  element.innerHTML = `
    <span class="status"></span>
    ${escapeHTML(currentProject.name)}
  `;

}


// ==========================================
// NEW PROJECT
// ==========================================

function openNewProject() {

  const oldModal =
    document.getElementById("projectModal");

  if (oldModal) {
    oldModal.remove();
  }


  const modal =
    document.createElement("div");

  modal.id = "projectModal";


  modal.innerHTML = `

    <div class="cf-modal">

      <div class="cf-modal-header">

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
        placeholder="Ex: Minha Landing Page"
      >


      <label>
        Tipo de projeto
      </label>

      <select id="projectTypeInput">

        <option>Projeto Web</option>

        <option>Landing Page</option>

        <option>Página de Vendas</option>

        <option>Dashboard</option>

        <option>App Financeiro</option>

        <option>SaaS</option>

        <option>Projeto em Branco</option>

      </select>


      <button
        id="createProjectButton"
        type="button"
      >
        Criar projeto
      </button>

    </div>

  `;


  document.body.appendChild(modal);


  // Estilo da janela

  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.zIndex = "99999";
  modal.style.background = "rgba(0,0,0,0.75)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding = "20px";


  const box =
    modal.querySelector(".cf-modal");

  box.style.width = "100%";
  box.style.maxWidth = "430px";
  box.style.background = "#0d1117";
  box.style.border = "1px solid #252c36";
  box.style.borderRadius = "14px";
  box.style.padding = "20px";
  box.style.color = "#ffffff";


  const header =
    modal.querySelector(".cf-modal-header");

  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";


  const close =
    document.getElementById(
      "closeProjectModal"
    );

  close.style.background = "transparent";
  close.style.border = "0";
  close.style.color = "#ffffff";
  close.style.fontSize = "26px";


  const labels =
    modal.querySelectorAll("label");

  labels.forEach(label => {

    label.style.display = "block";
    label.style.marginTop = "18px";
    label.style.marginBottom = "7px";
    label.style.fontSize = "13px";

  });


  const inputs =
    modal.querySelectorAll(
      "input, select"
    );

  inputs.forEach(input => {

    input.style.width = "100%";
    input.style.padding = "12px";
    input.style.borderRadius = "8px";
    input.style.border =
      "1px solid #29313d";
    input.style.background = "#11161d";
    input.style.color = "#ffffff";
    input.style.outline = "none";

  });


  const createButton =
    document.getElementById(
      "createProjectButton"
    );

  createButton.style.width = "100%";
  createButton.style.marginTop = "22px";
  createButton.style.padding = "13px";
  createButton.style.border = "0";
  createButton.style.borderRadius = "8px";
  createButton.style.background = "#087cff";
  createButton.style.color = "#ffffff";
  createButton.style.fontWeight = "600";


  close.onclick = function () {

    modal.remove();

  };


  createButton.onclick = function () {

    createNewProject();

  };

}


// ==========================================
// CREATE PROJECT
// ==========================================

function createNewProject() {

  const nameInput =
    document.getElementById(
      "projectNameInput"
    );

  const typeInput =
    document.getElementById(
      "projectTypeInput"
    );


  const name =
    nameInput.value.trim();

  const type =
    typeInput.value;


  if (!name) {

    alert(
      "Digite o nome do projeto."
    );

    return;

  }


  let html =
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
</html>`;


  let css =
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
}`;


  let js =
`console.log("Projeto ${escapeHTML(name)} iniciado.");`;


  currentProject = {

    name: name,

    type: type,

    currentFile: "index.html",

    files: {

      "index.html": html,

      "style.css": css,

      "app.js": js

    }

  };


  localStorage.setItem(
    "codeforge_project",
    JSON.stringify(currentProject)
  );


  codeEditor.value = html;

  updateProjectName();


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
// CHAT / IMPORT CODE
// ==========================================

if (sendBtn) {

  sendBtn.onclick = function () {

    const content =
      chatInput.value.trim();


    if (!content) {

      alert(
        "Cole algum código ou escreva algo."
      );

      return;

    }


    codeEditor.value = content;


    currentProject.files[
      currentProject.currentFile
    ] = content;


    localStorage.setItem(
      "codeforge_project",
      JSON.stringify(currentProject)
    );


    chatInput.value = "";


    showMessage(
      "Código importado."
    );

  };

}


// ==========================================
// SAVE BUTTON
// ==========================================

if (saveBtn) {

  saveBtn.onclick = function () {

    saveProject();

  };

}


// ==========================================
// PREVIEW
// ==========================================

if (previewBtn) {

  previewBtn.onclick = function () {

    const html =
      currentProject.files["index.html"];

    const css =
      currentProject.files["style.css"];

    const js =
      currentProject.files["app.js"];


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


    let page = html;


    if (css) {

      page =
        page.replace(
          "</head>",
          `<style>${css}</style></head>`
        );

    }


    if (js) {

      page =
        page.replace(
          "</body>",
          `<script>${js.replace(
            /<\/script>/gi,
            "<\\/script>"
          )}</script></body>`
        );

    }


    preview.document.open();

    preview.document.write(page);

    preview.document.close();

  };

}


// ==========================================
// NEW PROJECT BUTTON
// ==========================================

if (newProjectBtn) {

  newProjectBtn.onclick = function () {

    openNewProject();

  };

}


// ==========================================
// HOME BUTTON
// ==========================================

if (homeBtn) {

  homeBtn.onclick = function () {

    currentProject = {

      name: "Meu Projeto",

      type: "Projeto Web",

      currentFile: "index.html",

      files: {

        "index.html":
`<!DOCTYPE html>
<html lang="pt">

<head>
  <meta charset="UTF-8">
  <title>Meu Projeto</title>
</head>

<body>

  <h1>Bem-vindo ao CodeForge</h1>

  <p>
    Comece a construir o seu projeto.
  </p>

</body>

</html>`,

        "style.css": "",

        "app.js": ""

      }

    };


    codeEditor.value =
      currentProject.files[
        "index.html"
      ];


    localStorage.setItem(
      "codeforge_project",
      JSON.stringify(currentProject)
    );


    updateProjectName();

    showMessage(
      "Projeto inicial carregado."
    );

  };

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

  const box =
    document.createElement("div");

  box.textContent = message;


  box.style.position = "fixed";
  box.style.left = "50%";
  box.style.bottom = "25px";
  box.style.transform =
    "translateX(-50%)";
  box.style.zIndex = "100000";

  box.style.background =
    "#087cff";

  box.style.color =
    "#ffffff";

  box.style.padding =
    "11px 18px";

  box.style.borderRadius =
    "8px";

  box.style.fontSize =
    "14px";


  document.body.appendChild(box);


  setTimeout(() => {

    box.remove();

  }, 2200);

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ==========================================
// START
// ==========================================

loadProject();

updateProjectName();
