const botaoEnviar = document.querySelector('.section-button-enviar button');
const codigo = document.getElementById('codigo');
const cnpj = document.getElementById('cnpj');
const razaoSocial = document.getElementById('razaoSocial');
const novoRegime = document.getElementById('regime-tributario');
const responsavelInterno = document.getElementById('responsavel-pelo-processo');
const form = document.getElementById('formulario');

botaoEnviar.addEventListener('click', async (e) => {
  e.preventDefault();
  botaoEnviar.disabled = true;

  const sucesso = await envioFormulario();

  if (!sucesso) {
    botaoEnviar.disabled = false;
  }
});

async function envioFormulario() {
  if (
    codigo.value.trim() === '' ||
    cnpj.value.trim().length !== 18 ||
    razaoSocial.value.trim() === '' ||
    novoRegime.value.trim() === 'Selecione uma das opções...' ||
    responsavelInterno.value.trim() === 'Selecione uma das opções...'
  ) {
    alert('[ERRO] Verifique se todos os campos foram preenchidos');
    return false;
  } else {
    const appsScriptAPI =
      'https://script.google.com/macros/s/AKfycbxYzW9X2ScWakmI8Uzs5UeHV-1lKmueTkjeZtlhXgByxnppp3qLeGPU0frdmTY32D7H/exec';

    const formData = new URLSearchParams();
    formData.append('codigo', codigo.value);
    formData.append('cnpj', cnpj.value);
    formData.append('razaoSocial', razaoSocial.value);
    formData.append('novoRegime', novoRegime.value);
    formData.append('responsavelInterno', responsavelInterno.value);

    try {
      const response = await fetch(appsScriptAPI, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      const texto = await response.text();

      if (texto === 'Success') {
        alert('Resposta enviada com sucesso!!');
        form.requestFullscreen();
        return true;
      } else {
        alert('[ERRO] ' + texto);
        return false;
      }
    } catch (error) {
      console.error('[ERRO]: ', error);
      alert('[ERRO] Conexão perdida com o Data Base. Tente novamente!');
      return false;
    }
  }
}
