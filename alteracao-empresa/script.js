var quill = new Quill('#editor-container', {
    theme: 'snow'
})


$(document).ready(function(){
    $('#cnpj-empresa').mask('00.000.000/0000-00');
})

const codigoEmpresa = document.getElementById("codigo")
codigoEmpresa.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '')
    if(valor.length > 4){
        valor = valor.slice(0, 4)
    }

    e.target.value = valor
})


const nAlt = document.getElementById("numero-alt")
nAlt.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '')
    if(valor.length > 4){
        valor = valor.slice(0, 4)
    }

    e.target.value = valor
})



function enviarDados(){
    const formulario = document.getElementById("form")
    const codigo = document.getElementById("codigo").value
    const razaoSocial = document.getElementById("razao").value.toUpperCase()
    const cnpj = document.getElementById("cnpj-empresa").value
    const nAlt = document.getElementById("numero-alt").value
    const date = document.getElementById("deferido-em").value
    const estado = document.getElementById("uf").value.toUpperCase()
    let valorObs = quill.root.innerHTML

    const [ano, mes, dia] = date.split("-")
    const data = `${dia}/${mes}/${ano}`

    const horas = new Date()
    const horaAtual = horas.getHours()
    let saudacao = ""

    if(horaAtual >= 6 && horaAtual <= 12){
        saudacao = "Bom dia!"
    } else if(horaAtual >= 13 && horaAtual <= 18){
        saudacao = "Boa tarde!"
    } else{
        saudacao = "Boa noite!"
    }

    if(valorObs === "<p><br></p>"){
        valorObs = ""
    }

    if(codigo.trim() === "" || razaoSocial.trim() === "" || cnpj.trim() === "" || data.trim() === "undefined/undefined/" || estado.trim() === "" || valorObs.trim() === "" || nAlt.trim() === ""){
        alert("[ERRO] Preencha todos os campos!")
        return false
     }

    if(cnpj.length !== 18){
        alert("[ERRO ] Campo CNPJ faltam dígitos!")
        return false
     }

        const scriptAPI = "https://script.google.com/macros/s/AKfycbyljXOrgt3_TcHgOCdRbGXKOXt1QsgfEdBpH2COXN7kBkP7yo568Q7ZsMzRurw4QwcBww/exec"

        const dadosForm = new URLSearchParams()
        dadosForm.append("codigo", codigo)
        dadosForm.append("razaoSocial", razaoSocial)
        dadosForm.append("cnpj", cnpj)
        dadosForm.append("data", data)
        dadosForm.append("estado", estado)
        dadosForm.append("valorObs", valorObs)
        dadosForm.append("saudacao", saudacao)
        dadosForm.append("nAlt", nAlt)

        fetch(scriptAPI, {
            method: "POST",
            body: dadosForm
         })
            .then(response => response.text())
            .then(response => {
                console.log("Resposta da API: ", response)
                if(response === "Success"){
                    alert("Formulário enviado com sucesso!")
                    formulario.reset()
                    quill.setContents([])
                } else{
                    alert("[ERRO] " + response)
                }
            })
            .catch(error => {
                console.error("[ERRO]: ", error)
                alert("[ERRO] Conexão perdida com o Data Base!")
            })

        return true
     }


const botao = document.querySelector(".button")

botao.addEventListener("click", (e) => {
    e.preventDefault()
    enviarDados()
})