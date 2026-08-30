// ==========================================
// CODEFORGE V2 - PROJECT ENGINE
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

const projectName =
  document.getElementById("projectName");

const currentFileName =
  document.getElementById("currentFileName");

const currentLanguage =
  document.getElementById("currentLanguage");


// ==========================================
// DEFAULT PROJECT
// ==========================================

const defaultProject = {
  name: "Meu Projeto",
  type: "Projeto Web",

  currentFile: "index.html",

  files: {
    "index.html": `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Projeto</title>
</head>

<body>

  <h1>Bem-vindo ao CodeForge</h1>

  <p>Comece a construir o seu projeto.</p>

</body>
</html>`,

    "style.css": `body {
  margin: 0;
  font-family: Arial, sans-serif;
}`,

    "app.js": `console.log("CodeForge iniciado.");`
  }
};


// ==========================================
// LOAD PROJECT
// ==========================================

let currentProject;

const savedProject =
  localStorage.getItem("codeforge_project");

if (savedProject) {

  try {

    currentProject =
      JSON.parse(savedProject);

  } catch {

    currentProject =
      structuredClone(defaultProject);

  }

} else {

  currentProject =
    structuredClone(defaultProject);

}


// ==========================================
// SAVE PROJECT DATA
// ==========================================

function saveProjectData() {

  if (
    currentProject.files &&
    currentProject.currentFile
  ) {

    currentProject.files[
      currentProject.currentFile
    ] = codeEditor.value;

  }

  localStorage.setItem(
    "codeforge_project",
    JSON.stringify(currentProject)
  );

}


// ==========================================
// LANGUAGE
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
// RENDER FILES
// ==========================================

function renderFiles() {

  fileExplorer.innerHTML = "";

  const files =
    Object.keys(currentProject.files);


  files.forEach((fileName) => {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className = "file";

    if (
      fileName ===
      currentProject.currentFile
    ) {

      button.classList.add("active");

    }


    button.innerHTML = `

      <span class="file-icon">
        ${getFileIcon(fileName)}
      </span>

      <span class="file-name">
        ${escapeHTML(fileName)}
      </span>

    `;


    button.addEventListener(
      "click",
      () => {

        openFile(fileName);

      }
    );


    fileExplorer.appendChild(button);

  });

}


// ==========================================
// OPEN FILE
// ==========================================

function openFile(fileName) {

  saveProjectData();


  if (
    currentProject.files[fileName] ===
    undefined
  ) {

    return;

  }


  currentProject.currentFile =
    fileName;


  codeEditor.value =
    currentProject.files[fileName];


  currentFileName.textContent =
    fileName;


  currentLanguage.textContent =
    getLanguage(fileName);


  renderFiles();

}


// ==========================================
// UPDATE PROJECT NAME
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
// NEW PROJECT
// ==========================================

function openNewProject() {

  const existing =
    document.getElementById(
      "projectModal"
    );

  if (existing) {
    existing.remove();
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
        placeholder="Ex: Achados MZ"
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


  // Modal

  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.zIndex = "99999";
  modal.style.background =
    "rgba(0,0,0,.78)";

  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent =
    "center";

  modal.style.padding = "20px";


  const box =
    modal.querySelector(".cf-modal");

  box.style.width = "100%";
  box.style.maxWidth = "430px";
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


  inputs.forEach((input) => {

    input.style.width = "100%";
    input.style.marginTop = "7px";
    input.style.padding = "12px";

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

  });


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


  currentProject = {

    name,

    type,

    currentFile:
      "index.html",

    files: {

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

    }

  };


  localStorage.setItem(
    "codeforge_project",
    JSON.stringify(currentProject)
  );


  updateProjectName();

  renderFiles();

  openFile("index.html");


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
      "Nome do novo ficheiro:\nEx: contact.html"
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


  saveProjectData();

  renderFiles();

  openFile(cleanName);


  showMessage(
    "Ficheiro criado."
  );

}


// ==========================================
// SAVE BUTTON
// ==========================================

if (saveBtn) {

  saveBtn.onclick = () => {

    saveProjectData();

    showMessage(
      "Projeto salvo."
    );

  };

}


// ==========================================
// NEW PROJECT BUTTON
// ==========================================

if (newProjectBtn) {

  newProjectBtn.onclick = () => {

    openNewProject();

  };

}


// ==========================================
// NEW FILE BUTTON
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
      structuredClone(
        defaultProject
      );


    localStorage.setItem(
      "codeforge_project",
      JSON.stringify(
        currentProject
      )
    );


    updateProjectName();

    renderFiles();

    openFile("index.html");


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


    saveProjectData();


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

    saveProjectData();


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
// AUTO SAVE WHEN EDITING
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
// MESSAGE
// ==========================================

function showMessage(message) {

  const box =
    document.createElement("div");


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


  setTimeout(() => {

    box.remove();

  }, 2200);

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

updateProjectName();

renderFiles();

openFile(
  currentProject.currentFile ||
  "index.html"
);
