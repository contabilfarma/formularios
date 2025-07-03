// script.js — válido em index.html e form.html

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  // Se estivermos em form.html, blocos a entrada direta
  if (form) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('access') !== 'granted') {
      // sem ?access=granted → volta pra home
      window.location.href = 'index.html';
      return;
    }
    // opcional: limpa a query string para a URL ficar limpa
    history.replaceState({}, '', 'form.html');

    // campos e URL do Apps Script
    const msg = document.getElementById('msg');
    const cnpjInput = document.getElementById('cnpj');
    const phoneInput = document.getElementById('contato');
    const URL =
      'https://script.google.com/macros/s/AKfycbyYamPCT4mNuLGStC0UwMbNB3Vwvocs352MNP5um9IabFsApyvXdkomQMr2GqbQTiTLwg/exec'; // coloque sua Web App URL aqui

    // — Máscara CNPJ (00.000.000/0000-00)
    function maskCNPJ(v) {
      return v
        .replace(/\D/g, '')
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }

    // — Máscara Telefone ((00) 00000-0000 ou (00) 0000-0000)
    function maskPhone(v) {
      let x = v.replace(/\D/g, '').slice(0, 11);
      if (x.length > 10)
        return x.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      if (x.length > 6)
        return x.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      if (x.length > 2) return x.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      return x.replace(/^(\d*)/, '($1');
    }

    cnpjInput.addEventListener(
      'input',
      (e) => (e.target.value = maskCNPJ(e.target.value)),
    );
    phoneInput.addEventListener(
      'input',
      (e) => (e.target.value = maskPhone(e.target.value)),
    );

    // — Envio via fetch
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      msg.textContent = 'Enviando...';

      fetch(URL, {
        method: 'POST',
        body: new FormData(form),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.result === 'success') {
            msg.textContent = '✅ Dados enviados com sucesso!';
            form.reset();
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          msg.textContent = '❌ Erro ao enviar. Tente novamente.';
        })
        .finally(() => {
          btn.disabled = false;
        });
    });
  }

  // Em index.html, script.js não faz mais nada
});
