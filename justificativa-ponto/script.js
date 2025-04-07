function getName(){
    let name = "" 

    while(!name){
        name = prompt("Qual é o seu nome?")
    }
    if(name){
        localStorage.setItem("nameUser", name)
        atualizarMensagem(name)
        document.body.style.display = "block"
    }
}

function atualizarMensagem(nome){
    document.querySelector(".name").innerText = nome
}

window.onload = function (){
    let nomeSalvo = localStorage.getItem("nameUser")
    if(nomeSalvo){
        atualizarMensagem(nomeSalvo)
        document.body.style.display = "block"
    } else {
        getName()
    }
}


function validarFormulario() {
    const form = document.querySelector("form");
    const nome = document.getElementById("colaborador").value;
    const email = document.getElementById("email").value;
    const data = document.getElementById("data-ocorrencia").value;
    const horaInicio = document.getElementById("hora-inicio").value;
    const horaFim = document.getElementById("hora-fim").value;
    const descricao = document.getElementById("descricao").value;
    const justificativa = document.getElementById("opcoes").value;

    if (nome === "none" || email.trim() === "" || data.trim() === "" ||
        horaInicio.trim() === "" || horaFim.trim() === "" || descricao.trim() === "" ||
        justificativa === "none") {
        
        alert("Por favor, preencha todos os campos obrigatórios antes de enviar o formulário.");
        return false;
    }

    const googleScriptURL = "https://script.google.com/macros/s/AKfycbxMn3P0GuQ7g-JnT40wlzMwkJMp-VfgH9SPShhh5eULVcX9YLVFb7wdOMAxORKm97Bv/exec";


    const formData = new URLSearchParams();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("justificativa", justificativa)
    formData.append("data", data);
    formData.append("horaInicio", horaInicio);
    formData.append("horaFim", horaFim);
    formData.append("descricao", descricao);
    
    // Envia os dados para o Google Sheets via fetch()
    fetch(googleScriptURL, {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(response => {
        if (response === "Success") {
            alert("Formulário enviado com sucesso. Um e-mail foi disparado à sua caixa de entrada!");
            form.reset(); // Limpa o formulário após envio
        } else {
            alert("Erro ao enviar os dados. Tente novamente.");
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao conectar com o Google Sheets.");
    });

    return true;
}

// Adiciona evento ao botão de envio
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("input[type='button']").addEventListener("click", function () {
        validarFormulario();
    });
});


function modal(){
    btnOpen = document.querySelector(".open")
    btnClose = document.querySelector(".close")
    popup = document.querySelector(".popup")

    btnOpen.addEventListener('click', () => {
       popup.classList.add('ativo')
    })

    btnClose.addEventListener('click', () => {
        popup.classList.remove('ativo')
    })
  
}
modal()
