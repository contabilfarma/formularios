document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0;
    const steps = document.querySelectorAll(".step");
    const nextButton = document.querySelector(".fa-arrow-right");
    const prevButton = document.querySelector(".fa-arrow-left");

    function showStep(index) {
        steps.forEach((step, i) => {
            step.style.display = i === index ? "flex" : "none";
        });
    }

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }

    showStep(currentStep);

    nextButton.addEventListener("click", nextStep);

    prevButton.addEventListener("click", prevStep);
});

$(document).ready(function () {
    $('#cnpj').mask('00.000.000/0000-00');
})


const codigoEmpresa = document.getElementById("codigo")
codigoEmpresa.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '')
    if (valor.length > 4) {
        valor = valor.slice(0, 4)
    }

    e.target.value = valor
})

const phoneInput = document.getElementById("numero");

function formatPhone(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ""); // Remove tudo que não for número

    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    if (value.length > 10) {
        // Formato para celulares com DDD: (XX) XXXXX-XXXX
        input.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    } else if (value.length > 6) {
        // Formato para fixo com DDD: (XX) XXXX-XXXX
        input.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6, 10)}`;
    } else if (value.length > 2) {
        // Formato DDD inicial: (XX) XXXX
        input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        // Apenas DDD: (XX
        input.value = `(${value}`;
    }
}

// Aplica a máscara no campo de telefone
phoneInput.addEventListener("input", formatPhone);

var quill = new Quill('#editor-container', {
    theme: 'snow'
})

function enviarDados() {
    const form = document.getElementById("formulario")
    const codigoEmpresa = document.getElementById("codigo").value
    const nomeEmpresa = document.getElementById("razao-social").value.toUpperCase()
    const cnpjEmpresa = document.getElementById("cnpj").value
    const responsavelEmpresa = document.getElementById("responsavel-legal").value.toUpperCase()
    const regimeTributario = document.getElementById("regime-tributario").value.toUpperCase()
    const dataObrigacoes = document.getElementById("date").value
    const certificadoDigital = document.querySelector("input[type='radio'].certificado:checked").value.toUpperCase()
    const constituida = document.querySelector("input[type='radio'].constituida:checked").value.toUpperCase()
    const grupos = document.querySelector("input[type='radio'].grupos:checked").value.toUpperCase()
    let qualGrupo = document.getElementById("text-grupo").value.toUpperCase()
    const telefoneContato = document.getElementById("numero").value
    const emailCliente = document.getElementById("email").value.toLowerCase()
    const responsavelInterno = document.getElementById("interno").value.toUpperCase()
    const responsavelComercial = document.getElementById("comercial").value.toUpperCase()
    let valorObs = quill.root.innerHTML

    const [ano, mes, dia] = dataObrigacoes.split("-")
    const data = `${dia}/${mes}/${ano}`

    if(valorObs === "<p><br></p>"){
        valorObs = " "
    }

    if (grupos === "NÃO") {
        qualGrupo = " "
    }


    if (codigoEmpresa.trim() === "" || nomeEmpresa.trim() === "" || cnpjEmpresa.trim() === "" || responsavelEmpresa.trim() === "" || regimeTributario.trim() === "" || data.trim() === "" || telefoneContato.trim() === "" || emailCliente.trim() === "" || responsavelInterno.trim() === "" || responsavelComercial.trim() === "" || (grupos === "SIM" && qualGrupo === "")) {
        alert('[ERRO] Verifique se todos os campos foram preenchidos!')
        return false
    }

    if(cnpjEmpresa.length !== 18 || telefoneContato.length < 14){
        alert("Verifique os campos CPNJ ou TELEFONE!")
        return false
    }


    console.log("Dados enviados:", {
        codigoEmpresa,
        nomeEmpresa,
        cnpjEmpresa,
        responsavelEmpresa,
        regimeTributario,
        data,
        constituida,
        certificadoDigital,
        telefoneContato,
        emailCliente,
        responsavelInterno,
        responsavelComercial,
        grupos,
        qualGrupo,
        valorObs
    });

    const appsScriptAPI = "https://script.google.com/macros/s/AKfycbzRFIC5g9vGXhMyOKSkE8SeUzbaZx4wmJlVRNEDDji8bXyn4ZtBsOOtNu3KIETVVvPy/exec"

    const formData = new URLSearchParams()
    formData.append("codigo", codigoEmpresa)
    formData.append("razaoSocial", nomeEmpresa)
    formData.append("cnpj", cnpjEmpresa)
    formData.append("responsavel", responsavelEmpresa)
    formData.append("regimeTributario", regimeTributario)
    formData.append("data", data)
    formData.append("constituida", constituida) 
    formData.append("certificado", certificadoDigital)
    formData.append("telefone", telefoneContato)
    formData.append("email", emailCliente)
    formData.append("responsavelInterno", responsavelInterno)
    formData.append("responsavelComercial", responsavelComercial)
    formData.append("grupos", grupos)
    formData.append("qualGrupo", qualGrupo)
    formData.append("observacao", valorObs)

    fetch(appsScriptAPI, {
        method: "POST",
        body: formData
    })
        .then(response => response.text())
        .then(response => {
            console.log("Resposta do server: ", response)

            if (response.trim() === "Dados salvos com sucesso") {
                alert("Formulário enviado com sucesso!")
                form.reset()
                quill.setContents([])
            } else {
                alert("Erro na conexão com o Data Base. Tente novamente! " + response)
            }
        })
        .catch(error => {
            console.error("ERRO:", error)
            alert("Erro na conexão com o Banco de Dados")
        })

    return true

}


const botao = document.querySelector(".btn-enviar")
botao.addEventListener("click", (e) => {
    e.preventDefault()
    enviarDados()
})
