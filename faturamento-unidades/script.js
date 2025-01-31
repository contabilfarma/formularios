//Define a senha correta
const correctPassword = "C0nt4b1l1z3@"; // Altere para a senha que desejar

// Elementos da página
const passwordContainer = document.getElementById("password-container");
const formContainer = document.getElementById("form-container");
const passwordInput = document.getElementById("password");
const submitPasswordButton = document.getElementById("submit-password");
const errorMessage = document.getElementById("error-message");

// Exibe o campo de senha ao carregar a página
passwordContainer.style.display = "flex";

// Valida a senha ao clicar no botão "Acessar"
submitPasswordButton.addEventListener("click", () => {
    const enteredPassword = passwordInput.value;

    if (enteredPassword === correctPassword) {
        // Senha correta - exibe o formulário
        passwordContainer.style.display = "none";
        formContainer.style.display = "flex";
    } else {
        // Senha incorreta - exibe mensagem de erro
        errorMessage.style.display = "block";
    }
});

// Lógica do formulário
document.getElementById("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        unidade: formData.get("unidade"),
        repasse: formData.get("repasse"),
        competencia: formData.get("competencia"),
        faturamento: formData.get("fat")
    };


    console.log("Dados enviados:", data)


    try {
        await fetch("https://script.google.com/macros/s/AKfycbzv8mAOwM6ewlZbsorGHIKDaxk9p77nNspwbiGE-BPIxrOs-iAIGh8kwDDD9yR8mXog0w/exec", { // Substitua pela URL correta
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            mode: "no-cors"
        });

        alert("Dados enviados com sucesso!");
        form.reset();
    } catch (error) {
        console.error(error);
        alert("Erro ao enviar os dados.");
    }
});


function showPass(){
    const pass = document.querySelector(".fa-regular")
    
    if(passwordInput.type === 'password'){
        passwordInput.setAttribute('type', 'text')
        pass.classList.replace('fa-eye', 'fa-eye-slash')
    } else{
        passwordInput.setAttribute('type', 'password')
        pass.classList.replace('fa-eye-slash', 'fa-eye')
    }
}

