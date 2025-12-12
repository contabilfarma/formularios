var quill = new Quill('#editor-container', {
  theme: 'snow',
});

$(document).ready(function () {
  $('#cnpj-empresa').mask('00.000.000/0000-00');
});

const codigoEmpresa = document.getElementById('codigo');
codigoEmpresa.addEventListener('input', (e) => {
  let valor = e.target.value.replace(/\D/g, '');
  if (valor.length > 4) {
    valor = valor.slice(0, 4);
  }

  e.target.value = valor;
});

function enviarDados() {
  const formulario = document.getElementById('formulario');
  const razaoSocial = document
    .getElementById('razaoSocial')
    .value.toUpperCase();
  const dataEncerramento = document.getElementById('data').value;
  const email = document.getElementById('email').value.toLowerCase();
  const cnpj = document.getElementById('cnpj-empresa').value;
  let valorObs = quill.root.innerHTML;
  const codigo = document.getElementById('codigo').value;

  const [ano, mes, dia] = dataEncerramento.split('-');
  const data = `${dia}/${mes}/${ano}`;

  if (valorObs === '<p><br></p>') {
    valorObs = '';
  }

  if (
    razaoSocial.trim() === '' ||
    data.trim() === '' ||
    email.trim() === '' ||
    codigo.trim() === ''
  ) {
    alert('[ERRO] Faltam dados. Tente novamente!!');
    botao.disabled = false;
    return false;
  } else if (cnpj.length !== 18) {
    alert('[ERRO] Campo CNPJ faltam dígitos!');
    botao.disabled = false;
    return false;
  } else if (codigo.trim().length < 4) {
    alert('[ERRO] Código precisa estar no formato 0000');
    botao.disabled = false;
    return false;
  } else {
    const appScriptsAPI1 =
      'https://script.google.com/macros/s/AKfycbxkQ2NpE5ErTM1MYz06kD7INYBUtayudEZx6AgUmees00aODzHmft9hqxUrmJSyHOoTUg/exec';
    const appScriptsAPI2 =
      'https://script.google.com/macros/s/AKfycbzqRyCdqaYXK0JlUdIlu75fn73LDR2VrdTCn51Q9zg-MEHdmq9EhvtllXl79RyuDXPjIg/exec';

    const dados = new URLSearchParams();
    dados.append('codigo', codigo);
    dados.append('razaoSocial', razaoSocial);
    dados.append('cnpj', cnpj);
    dados.append('data', data);
    dados.append('email', email);
    dados.append('valorObs', valorObs);

    Promise.all([
      fetch(appScriptsAPI1, {
        method: 'POST',
        mode: 'no-cors',
        body: dados,
      }).then((response) => response.text()),

      fetch(appScriptsAPI2, {
        method: 'POST',
        mode: 'no-cors',
        body: dados,
      }),
    ])
      .then(() => {
        alert('Formulário enviado com sucesso para ambas as bases!');
        formulario.reset();
        quill.setContents([]);
        botao.disabled = false;
      })
      .catch((error) => {
        console.error('Erro: ', error);
        alert('Erro na conexão com uma das bases de dados');
        botao.disabled = false;
      });

    return true;
  }
}

const botao = document.querySelector('.btn');

botao.addEventListener('click', (e) => {
  e.preventDefault();
  e.target.disabled = true;
  enviarDados();
});
