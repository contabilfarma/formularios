IMask(document.getElementById('cnpj'), { mask: '00.000.000/0000-00' });
IMask(document.getElementById('codigo'), { mask: '0000' });

const inputCodigo = document.getElementById('codigo');
inputCodigo.addEventListener('input', () => {
  inputCodigo.value = inputCodigo.value.replace(/\D/g, '');
});
inputCodigo.addEventListener('blur', () => {
  let valor = inputCodigo.value;

  if (valor.length > 0) {
    inputCodigo.value = valor.padStart(4, '0');
  }
});

const btnBuscar = document.getElementById('buscarCnpj');
const inputCnpj = document.getElementById('cnpj');
const inputRazaoSocial = document.getElementById('razaoSocial');

btnBuscar.addEventListener('click', async () => {
  const cnpj = inputCnpj.value.replace(/\D/g, '');

  if (cnpj.length !== 14) {
    alert('Digite um CNPJ válido');
    return;
  }

  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
    );

    if (!response.ok) {
      throw new Error('CNPJ não encontrado');
    }

    const data = await response.json();

    inputRazaoSocial.value = data.razao_social || '';
  } catch (error) {
    alert('Erro ao buscar CNPJ');
    console.error(error);
  }
});
