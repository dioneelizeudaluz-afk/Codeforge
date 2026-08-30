// ==========================================
// CODEFORGE - PROJECT MANAGER V1
// ==========================================

const codeEditor = document.getElementById("codeEditor");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const saveBtn = document.getElementById("saveBtn");
const previewBtn = document.getElementById("previewBtn");
const newProjectBtn = document.getElementById("newProject");


// ==========================================
// PROJECT DATA
// ==========================================

let currentProject = {
  name: "Meu Projeto",
  type: "Projeto Web",
  files: {
    "index.html": codeEditor.value,
    "style.css": "",
    "app.js": ""
  },
  currentFile: "index.html"
};


// ==========================================
// LOAD PROJECT
// ==========================================

function loadProject() {

  const savedProject = localStorage.getItem("codeforge_project");

  if (!savedProject) {
    return;
  }

  try {

    currentProject = JSON.parse(savedProject);

    const savedFile =
      currentProject.files[currentProject.currentFile];

    if (savedFile !== undefined) {
      codeEditor.value = savedFile;
    }

    updateProjectName();

  } catch (error) {

    console.error("Erro ao carregar projeto:", error);

  }

}


// ==========================================
// SAVE PROJECT
// ==========================================

function saveProject() {

  // Guarda o conteúdo atual
  currentProject.files[currentProject.currentFile] =
    codeEditor.value;

  localStorage.setItem(
    "codeforge_project",
    JSON.stringify(currentProject)
  );

  showMessage("Projeto salvo com sucesso.");

}


// ==========================================
// PROJECT NAME
// ==========================================

function updateProjectName() {

  const projectName =
    document.querySelector(".project-name");

  if (!projectName) return;

  projectName.innerHTML = `
    <span class="status"></span>
    ${escapeHTML(currentProject.name)}
  `;

}


// ==========================================
// CREATE PROJECT WINDOW
// ==========================================

function openNewProjectWindow() {

  const overlay = document.createElement("div");

  overlay.id = "projectModal";

  overlay.innerHTML = `
    <div class="project-modal">

      <div class="modal-header">
        <h2>Novo projeto</h2>

        <button id="closeModal">
          ×
        </button>
      </div>

      <p class="modal-description">
        Crie um novo projeto para começar a desenvolver.
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

        <option value="Projeto Web">
          Projeto Web
        </option>

        <option value="Landing Page">
          Landing Page
        </option>

        <option value="Página de Vendas">
          Página de Vendas
        </option>

        <option value="Dashboard">
          Dashboard
        </option>

        <option value="App Financeiro">
          App Financeiro
        </option>

        <option value="SaaS">
          SaaS
        </option>

        <option value="Projeto em Branco">
          Projeto em Branco
        </option>

      </select>

      <button
        id="createProject"
        class="create-project-button"
      >
        Criar projeto
      </button>

    </div>
  `;

  document.body.appendChild(overlay);


  // Fechar

  document
    .getElementById("closeModal")
    .addEventListener("click", () => {

      overlay.remove();

    });


  // Criar

  document
    .getElementById("createProject")
    .addEventListener("click", createProject);

}


// ==========================================
// CREATE PROJECT
// ==========================================

function createProject() {

  const name =
    document
      .getElementById("projectNameInput")
      .value
      .trim();

  const type =
    document
      .getElementById("projectTypeInput")
      .value;


  if (!name) {

    alert("Digite um nome para o projeto.");

    return;

  }


  let files = {

    "index.html": createHTMLTemplate(name),

    "style.css": createCSSTemplate(),

    "app.js": createJSTemplate()

  };


  // Guardar projeto

  currentProject = {

    name: name,

    type: type,

    files: files,

    currentFile: "index.html"

  };


  localStorage.setItem(
    "codeforge_project",
    JSON.stringify(currentProject)
  );


  // Atualizar editor

  codeEditor.value =
    currentProject.files["index.html"];


  updateProjectName();


  // Fechar janela

  const modal =
    document.getElementById("projectModal");

  if (modal) {
    modal.remove();
  }


  showMessage(
    `${name} criado com sucesso.`
  );

}


// ==========================================
// HTML TEMPLATE
// ==========================================

function createHTMLTemplate(name) {

  return `<!DOCTYPE html>
<html lang="pt">
<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>${name}</title>

  <link
    rel="stylesheet"
    href="style.css"
  >

</head>

<body>

  <main>

    <h1>${name}</h1>

    <p>
      Projeto criado com o CodeForge.
    </p>

  </main>

  <script src="app.js"></script>

</body>
</html>`;

}


// ==========================================
// CSS TEMPLATE
// ==========================================

function createCSSTemplate() {

  return `* {
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
  margin: 0 auto;
  padding: 60px 20px;
}

h1 {
  font-size: 48px;
}

p {
  font-size: 18px;
}`;

}


// ==========================================
// JAVASCRIPT TEMPLATE
// ==========================================

function createJSTemplate() {

  return `console.log("Projeto CodeForge iniciado.");`;

}


// ==========================================
// CHAT / CODE IMPORT
// ==========================================

sendBtn.addEventListener("click", () => {

  const content =
    chatInput.value.trim();


  if (!content) {

    alert(
      "Cole algum código ou escreva uma instrução."
    );

    return;

  }


  // Coloca o conteúdo no ficheiro atual

  codeEditor.value = content;


  // Guarda automaticamente no projeto

  currentProject.files[
    currentProject.currentFile
  ] = content;


  localStorage.setItem(
    "codeforge_project",
    JSON.stringify(currentProject)
  );


  chatInput.value = "";


  showMessage(
    "Código importado para o editor."
  );

});


// ==========================================
// SAVE BUTTON
// ==========================================

saveBtn.addEventListener(
  "click",
  saveProject
);


// ==========================================
// PREVIEW
// ==========================================

previewBtn.addEventListener(
  "click",
  () => {

    const html =
      currentProject.files["index.html"];

    const css =
      currentProject.files["style.css"];

    const js =
      currentProject.files["app.js"];


    const preview =
      window.open("", "_blank");


    if (!preview) {

      alert(
        "O navegador bloqueou a janela de Preview. Permita pop-ups para o CodeForge."
      );

      return;

    }


    let finalHTML = html;


    // Adicionar CSS

    if (css) {

      finalHTML =
        finalHTML.replace(
          "</head>",
          `<style>${css}</style></head>`
        );

    }


    // Adicionar JavaScript

    if (js) {

      finalHTML =
        finalHTML.replace(
          "</body>",
          `<script>${js}<\/script></body>`
        );

    }


    preview.document.open();

    preview.document.write(
      finalHTML
    );

    preview.document.close();

  }
);


// ==========================================
// NEW PROJECT BUTTON
// ==========================================

if (newProjectBtn) {
  newProjectBtn.onclick = function () {
    openNewProjectWindow();
  };
}

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

  const messageBox =
    document.createElement("div");

  messageBox.innerText = message;

  messageBox.style.position = "fixed";
  messageBox.style.bottom = "20px";
  messageBox.style.left = "50%";
  messageBox.style.transform =
    "translateX(-50%)";

  messageBox.style.background =
    "#087cff";

  messageBox.style.color =
    "#ffffff";

  messageBox.style.padding =
    "12px 18px";

  messageBox.style.borderRadius =
    "8px";

  messageBox.style.fontSize =
    "14px";

  messageBox.style.zIndex =
    "99999";

  document.body.appendChild(
    messageBox
  );


  setTimeout(() => {

    messageBox.remove();

  }, 2500);

}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(text) {

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
// ==========================================
// HOME BUTTON
// ==========================================

const homeBtn = document.getElementById("homeBtn");

if (homeBtn) {

  homeBtn.addEventListener("click", () => {

    codeEditor.value =
`<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeForge</title>
</head>

<body>

  <h1>Bem-vindo ao CodeForge</h1>

  <p>Comece a construir o seu projeto.</p>

</body>
</html>`;

    currentProject = {
      name: "Meu Projeto",
      type: "Projeto Web",
      files: {
        "index.html": codeEditor.value,
        "style.css": "",
        "app.js": ""
      },
      currentFile: "index.html"
    };

    localStorage.setItem(
      "codeforge_project",
      JSON.stringify(currentProject)
    );

    updateProjectName();

  });

}

// ==========================================
// START
// ==========================================

loadProject();
updateProjectName();
