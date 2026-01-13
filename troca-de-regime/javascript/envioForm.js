const botaoEnviar = document.querySelector('.section-button-enviar button');
const codigo = document.getElementById('codigo');
const cnpj = document.getElementById('cnpj');
const razaoSocial = document.getElementById('razaoSocial');
const novoRegime = document.getElementById('regime-tributario');
const responsavelInterno = document.getElementById('responsavel-pelo-processo');
const data = document.getElementById('data');
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
  const newData = data.value.split('-');
  const dataFormatada = `${newData[2]}/${newData[1]}/${newData[0]}`;
  if (
    codigo.value.trim() === '' ||
    cnpj.value.trim().length !== 18 ||
    razaoSocial.value.trim() === '' ||
    novoRegime.value.trim() === 'Selecione uma das opções...' ||
    responsavelInterno.value.trim() === 'Selecione uma das opções...' ||
    dataFormatada === 'undefined/undefined/'
  ) {
    alert('[ERRO] Verifique se todos os campos foram preenchidos');
    return false;
  }

  const formData = new URLSearchParams();
  formData.append('codigo', codigo.value);
  formData.append('cnpj', cnpj.value);
  formData.append('razaoSocial', razaoSocial.value);
  formData.append('novoRegime', novoRegime.value);
  formData.append('responsavelInterno', responsavelInterno.value);

  try {
    await fetch(
      'https://script.google.com/macros/s/AKfycbxYzW9X2ScWakmI8Uzs5UeHV-1lKmueTkjeZtlhXgByxnppp3qLeGPU0frdmTY32D7H/exec',
      {
        method: 'POST',
        body: new URLSearchParams({
          codigo: codigo.value,
          cnpj: cnpj.value,
          razaoSocial: razaoSocial.value,
          novoRegime: novoRegime.value,
          responsavelInterno: responsavelInterno.value,
          dataFormatada: dataFormatada,
        }),
        mode: 'no-cors',
      },
    );

    alert('Resposta enviada com sucesso!!');
    setTimeout(() => {
      window.location.reload();
    }, 900);
    return true;
  } catch (error) {
    console.error(error);
    alert('[ERRO] Falha ao enviar dados');
    return false;
  }
}
