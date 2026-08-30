const codeEditor = document.getElementById("codeEditor");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const saveBtn = document.getElementById("saveBtn");
const previewBtn = document.getElementById("previewBtn");
const newProjectBtn = document.getElementById("newProject");


// ENVIAR CÓDIGO

sendBtn.addEventListener("click", () => {

  const content = chatInput.value.trim();

  if (!content) {
    alert("Cole algum código ou escreva uma instrução.");
    return;
  }

  codeEditor.value = content;

  chatInput.value = "";

});


// SALVAR

saveBtn.addEventListener("click", () => {

  localStorage.setItem(
    "codeforge_code",
    codeEditor.value
  );

  alert("Projeto salvo neste dispositivo.");

});


// CARREGAR

const savedCode = localStorage.getItem("codeforge_code");

if (savedCode) {
  codeEditor.value = savedCode;
}


// NOVO PROJETO

newProjectBtn.addEventListener("click", () => {

  const confirmNew = confirm(
    "Criar um novo projeto?"
  );

  if (!confirmNew) return;

  codeEditor.value =
`<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>Novo Projeto</title>
</head>

<body>

  <h1>Novo Projeto</h1>

</body>
</html>`;

});


// PREVIEW

previewBtn.addEventListener("click", () => {

  const code = codeEditor.value;

  const preview = window.open("", "_blank");

  preview.document.open();
  preview.document.write(code);
  preview.document.close();

});
