var quill = new Quill('#editor-container', {
  theme: 'snow',
});

function enviarDados() {
  const formulario = document.getElementById('formulario');
  const razaoSocial = document
    .getElementById('razaoSocial')
    .value.toUpperCase();
  const dataEncerramento = document.getElementById('data').value;
  const email = document.getElementById('email').value.toLowerCase();
  const valorObs = quill.root.innerHTML;

  const [ano, mes, dia] = dataEncerramento.split('-');
  const data = `${dia}/${mes}/${ano}`;

  if (razaoSocial.trim() === '' || data.trim() === '' || email.trim() === '') {
    alert('Faltam dados. Tente novamente!!');
    return false;
  } else {
    const appScriptsAPI1 =
      'https://script.google.com/macros/s/AKfycbxkQ2NpE5ErTM1MYz06kD7INYBUtayudEZx6AgUmees00aODzHmft9hqxUrmJSyHOoTUg/exec';
    const appScriptsAPI2 =
      'https://script.google.com/macros/s/AKfycbzqRyCdqaYXK0JlUdIlu75fn73LDR2VrdTCn51Q9zg-MEHdmq9EhvtllXl79RyuDXPjIg/exec';

    const dados = new URLSearchParams();
    dados.append('razaoSocial', razaoSocial);
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
      })
      .catch((error) => {
        console.error('Erro: ', error);
        alert('Erro na conexão com uma das bases de dados');
      });

    return true;
  }
}

const botao = document.querySelector('.btn');

botao.addEventListener('click', (e) => {
  e.preventDefault();
  enviarDados();
});
