function validarForm(){
    const formulario = document.querySelector("form")
    const nome = document.querySelector("#nome").value
    const departamento = document.querySelector("#setor").value
    const dataInput = document.querySelector("#date")
    const statusColaborador = document.querySelector('input[name="type"]:checked').value
    let dataAdmissao = dataInput.value

    if (dataAdmissao) {
        dataAdmissao = dataAdmissao.split("-").reverse().join("/");
    }

    if(nome.trim() === "" || departamento.trim() === "null" || dataAdmissao.trim() === ""){
        alert("ERRO! Faltam preencher campos")
        return false
    }


    const appsScriptURL = "https://script.google.com/macros/s/AKfycby6TJsbSBW3Kr8BgMP7cuEUWzq7Ol-rOFll4wmlTuguK7TmQ2w5KOZWpmmSOLs7k0CD/exec"

    const dadosFormulario = new URLSearchParams()
    dadosFormulario.append("nome", nome)
    dadosFormulario.append("departamento", departamento)
    dadosFormulario.append("dataAdmissao", dataAdmissao)
    dadosFormulario.append("statusColaborador", statusColaborador)

    fetch(appsScriptURL, {
        method: "POST",
        body: dadosFormulario
    })
    .then(response => response.text())
    .then(response => {
        if(response === "Sucess"){
            alert("Formulário enviado com sucesso!")
            formulario.reset()
        } else {
            alert("Erro ao enviar os dados. Tente novamente.")
        }
    })
    .catch(error => {
        console.error("Erro:", error)
        alert("Erro na conexão com o Data Base")
    })

    return true

}


const botao = document.querySelector("#btn")
document.addEventListener("DOMContentLoaded", () => {
    botao.addEventListener("click", () => {
        validarForm()
    })
})




