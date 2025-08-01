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

var quill = new Quill('#editor-container', {
    theme: 'snow'
})

function actionBtn(){
    const button = document.querySelector(".input-btn")
    button.addEventListener('click', async (event) => {
        event.preventDefault()
        button.disabled = true

        const sucesso = await enviarDados()
        if(!sucesso){
            button.disabled = false
        }
    })
}
actionBtn()

async function enviarDados(){
    const codigo = codigoEmpresa.value
    const razaoSocial = document.getElementById("razao-social").value.toUpperCase()
    const estado = document.getElementById("uf").value.toUpperCase()
    const documento = document.getElementById("cnpj").value.toUpperCase()
    const valorData = document.getElementById("date").value.toUpperCase()
    const responsavel = document.getElementById("responsavel").value.toUpperCase()
    const formulario = document.getElementById("formulario")

    const valorObs = quill.root.innerHTML

    const [ano, mes, dia] = valorData.split("-")
    const data = `${dia}/${mes}/${ano}`

    
    if(codigo.trim() === "" || razaoSocial.trim() === "" || estado.trim() === "" || 
       documento.trim() === "" || data.trim() === "" || responsavel.trim() === ""){
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
       dadosForm.append("observacoes", valorObs)
       dadosForm.append("responsavel", responsavel)

       try{
        const response = await fetch(appsScriptURL, {
            method: "POST",
            body: dadosForm
        })

        const texto = await response.text()
        console.log("Resposta da API:", texto)

        if(texto === "Sucess"){
            alert("Formulário enviado com sucesso!")
            formulario.reset()
            quill.setContents([])
            return true
        } else{
            alert("[ERRO] " + texto)
            return false
        }

       }catch(error) {
          console.error("Erro:", error)
          alert("Erro na conexão com o DB")
          return false
       }
}
