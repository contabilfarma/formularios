var quill = new Quill('#editor-container', {
    theme: 'snow'
})

function enviarDados(){
    const formulario = document.getElementById("formulario")
    const razaoSocial = document.getElementById("razaoSocial").value.toUpperCase()
    const dataEncerramento = document.getElementById("data").value
    const email = document.getElementById("email").value.toLowerCase()
    const valorObs = quill.root.innerHTML

    const [ano, mes, dia] = dataEncerramento.split("-")
    const data = `${dia}/${mes}/${ano}`

    if(razaoSocial.trim() === "" || data.trim() === "" || email.trim() === ""){
        alert("Faltam dados. Tente novamente!!")
        return false
    } else{
        appScriptsAPI = "https://script.google.com/a/macros/contabilfarma.com.br/s/AKfycbxkQ2NpE5ErTM1MYz06kD7INYBUtayudEZx6AgUmees00aODzHmft9hqxUrmJSyHOoTUg/exec"

        const dados = new URLSearchParams()
        dados.append("razaoSocial", razaoSocial)
        dados.append("data", data)
        dados.append("email", email)
        dados.append("valorObs", valorObs)

        fetch(appScriptsAPI, {
            method: "POST",
            body: dados
        })
            .then(response => response.text())
            .then(response => {
                if(response === "Sucess"){
                    alert("Formulário enviado com sucesso!")
                    formulario.reset()
                    quill.setContents([])
                } else {
                    alert("ERRO! Tente novamente.")
                }
            })
            .catch(error => {
                console.error("Erro: ", error)
                alert("Erro na conexão com o DB")
            })

            return true
    }
}

const botao = document.querySelector(".btn")

botao.addEventListener("click", (e) => {
    e.preventDefault()
    enviarDados()
})