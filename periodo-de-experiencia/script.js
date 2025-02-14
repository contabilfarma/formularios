const data = new Date()
const hora = data.getHours()

const secao = document.querySelector('.boas-vindas')
 if(hora >= 6 && hora < 12){
    secao.innerHTML = '<span> Olá, <br> bom dia :)</span>'
    secao.style.color = '#fff'
 } else if(hora >= 12 && hora < 18){
    secao.innerHTML = '<span> Olá, <br> boa tarde :)</span>'
    secao.style.color = '#fff'
 } else if(hora >= 18 && hora < 23){
    secao.innerHTML = '<span> Olá, <br> boa noite :)</span>'
    secao.style.color = '#fff'
 } else{ 
    secao.innerHTML = '<span> Olá, <br> boa madrugada :)</span>'
    secao.style.color = '#fff'
 }

 function validarFormulario() {
   var form = document.getElementById("meuFormulario");
   var inputs = form.querySelectorAll("input, select, textarea");
   var erro = false;

   inputs.forEach(function(input) {
       // Para selects, verifica se a opção selecionada não é "Selecione"
       if (input.tagName === "SELECT" && (input.value === "selecione" || input.value === "")) {
           erro = true;
           input.style.border = "2px solid red"; 
       } 
       // Para textareas e inputs comuns, verifica se está vazio
       else if (input.hasAttribute("required") && !input.value.trim()) {
           erro = true;
           input.style.border = "2px solid red"; 
       } 
       else {
           input.style.border = ""; // Remove o vermelho se o campo for preenchido corretamente
       }
   });

   if (erro) {
       alert("⚠️ Existem campos obrigatórios que precisam ser preenchidos antes de enviar. ⚠️");
       return false;
   }

   return true;
}



 function enviarFormulario() {
   if (!validarFormulario()) return; // Só envia se estiver validado

    var form = document.getElementById("meuFormulario");
    var formData = new FormData(form);

    fetch("https://script.google.com/macros/s/AKfycbweKXgUBqxaBdpR5f1ySLMXBQD59aZJRipdycPtgNXLOILTei-Jn7CcOZ9oRWaFWyzL3w/exec", {
        method: "POST",
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        alert("Formulário enviado com sucesso!");
        form.reset(); // Limpa o formulário após o envio
    })
    .catch(error => {
        alert("Erro ao enviar formulário: " + error);
    });
}
