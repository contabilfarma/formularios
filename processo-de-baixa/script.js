$(document).ready(function(){
    $('#cnpj').mask('00.000.000/0000-00');
  })


const codigoEmpresa = document.getElementById("codigo")
codigoEmpresa.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '')
    if(valor.length > 4){
        valor = valor.slice(0, 4)
    }

    e.target.value = valor
})

function enviarDados(){
    const codigo = codigoEmpresa.value
    const razaoSocial = document.getElementById("razao-social").value
    const estado = document.getElementById("uf").value
    const documento = document.getElementById("cnpj").value
    const valorData = document.getElementById("date").value
    const observacoesFormatadas = document.getElementById("obs").value
    const observacoes = observacoesFormatadas.replace(/\n/g, "<br>")
    const formulario = document.getElementById("formulario")

    const [ano, mes, dia] = valorData.split("-")
    const data = `${dia}/${mes}/${ano}`

    
    if(codigo.trim() === "" || razaoSocial.trim() === "" || estado.trim() === "" || 
       documento.trim() === "" || data.trim() === ""){
            alert("[ERRO] Preencha todos os campos!")
            return false
       }

       const appsScriptURL = "https://script.google.com/macros/s/AKfycbx-ZA34lu0Zmf8ysXfKPMs-qrIvf5w39svnFnbRTN2au9bVlfWx7FizoczwDhilXrDT/exec"

       const dadosForm = new URLSearchParams()
       dadosForm.append("codigo", codigo)
       dadosForm.append("razaoSocial", razaoSocial)
       dadosForm.append("estado", estado)
       dadosForm.append("documento", documento)
       dadosForm.append("data", data)
       dadosForm.append("observacoes", observacoes)
       
       fetch(appsScriptURL, {
           method: "POST",
           body: dadosForm
       })
           .then(response => response.text())
           .then(response => {
               if(response === "Sucess"){
                   alert("Formulário enviado com sucesso!")
                   formulario.reset()
               } else {
                   alert("Erro no envio dos dados. Tente novamente.")
               }
           })
           .catch(error => {
               console.error("Erro:", error)
               alert("Erro na conexão com o DB")
           })
       
           return true
}



function actionBtn(){
    const button = document.querySelector(".input-btn")
    
    button.addEventListener('click', (event) => {
        event.preventDefault()
        enviarDados()
    })
}
actionBtn()