// script.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Controle de acesso (via ?access=granted)
  const params = new URLSearchParams(window.location.search);
  if (params.get('access') !== 'granted') {
    window.location.href = 'index.html';
    return;
  }
  history.replaceState({}, '', 'form.html');

  // Elementos
  const cnpjContainer = document.getElementById('cnpj-container'); // contém o CNPJ nativo
  const outroCnpjDiv = document.querySelector('.outroCnpj'); // bloco dos botões
  const addCnpjBtn = document.getElementById('addCnpjBtn');
  let removeCnpjBtn = document.getElementById('removeCnpjBtn');
  const phoneInput = document.getElementById('contato');
  const deptSim = document.getElementById('deptSim');
  const deptNao = document.getElementById('deptNao');
  const deptContainer = document.getElementById('dept-container');
  const msg = document.getElementById('msg');
  const URL = 'SUA_URL_DO_APPS_SCRIPT'; // substitua pela sua URL

  // Cria botão “- Remover CNPJ”, se não existir
  if (!removeCnpjBtn) {
    removeCnpjBtn = document.createElement('button');
    removeCnpjBtn.type = 'button';
    removeCnpjBtn.id = 'removeCnpjBtn';
    removeCnpjBtn.textContent = '- Remover CNPJ';
    removeCnpjBtn.className = 'remove-cnpj';
    removeCnpjBtn.disabled = true;
    outroCnpjDiv.querySelector('.campoBtn').append(removeCnpjBtn);
  }

  // Máscaras
  function maskCNPJ(v) {
    return v
      .replace(/\D/g, '')
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  function maskPhone(v) {
    let x = v.replace(/\D/g, '').slice(0, 11);
    if (x.length > 10) return x.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (x.length > 6)
      return x.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    if (x.length > 2) return x.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    return x.replace(/^(\d*)/, '($1');
  }

  // Atualiza placeholders e habilita/desabilita “Remover”
  function refreshCnpjPlaceholders() {
    const inputs = [...document.querySelectorAll('input[name="cnpj"]')];
    inputs.forEach((inp, i) => {
      inp.placeholder = `CNPJ${i + 1}`;
      if (!inp.dataset.maskAttached) {
        inp.addEventListener(
          'input',
          (e) => (e.target.value = maskCNPJ(e.target.value)),
        );
        inp.dataset.maskAttached = 'true';
      }
    });
    removeCnpjBtn.disabled = inputs.length <= 1;
  }

  // Inicializa o CNPJ original
  refreshCnpjPlaceholders();

  // Adiciona novo CNPJ **abaixo** dos botões
  addCnpjBtn.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.name = 'cnpj';
    inp.required = true;
    // insere após o bloco .campoBtn, dentro de .outroCnpj
    outroCnpjDiv.append(inp);
    inp.dataset.maskAttached = false;
    refreshCnpjPlaceholders();
  });

  // Remove o último CNPJ (sempre um campo adicional)
  removeCnpjBtn.addEventListener('click', () => {
    const inputs = [...document.querySelectorAll('input[name="cnpj"]')];
    if (inputs.length > 1) {
      inputs[inputs.length - 1].remove();
      refreshCnpjPlaceholders();
    }
  });

  // Máscara de telefone principal
  phoneInput.addEventListener(
    'input',
    (e) => (e.target.value = maskPhone(e.target.value)),
  );

  // Constrói campos de contato por departamento
  function buildDeptFields() {
    const deps = [
      'Pessoal',
      'Contábil',
      'Financeiro',
      'Fiscal',
      'Registro e Legalização',
      'Comercial',
    ];
    deptContainer.innerHTML = '';
    deps.forEach((d, idx) => {
      const w = document.createElement('div');
      w.className = 'dept-field';
      // Contato
      const lc = document.createElement('label');
      lc.textContent = `Contato ${d}`;
      const ic = document.createElement('input');
      ic.type = 'text';
      ic.name = `contato${d.replace(/\s+/g, '')}`;
      ic.placeholder = `Telefone ${d}`;
      ic.required = true;
      ic.addEventListener(
        'input',
        (e) => (e.target.value = maskPhone(e.target.value)),
      );
      // Responsável
      const lr = document.createElement('label');
      lr.textContent = `Responsável ${d}`;
      const ir = document.createElement('input');
      ir.type = 'text';
      ir.name = `responsavel${d.replace(/\s+/g, '')}`;
      ir.placeholder = `Nome do Responsável ${d}`;
      ir.required = true;
      w.append(lc, ic, lr, ir);
      deptContainer.append(w);
      if (idx < deps.length - 1)
        deptContainer.append(document.createElement('hr'));
    });
  }

  // Toggle departamentos
  deptSim.addEventListener(
    'change',
    () => (deptContainer.style.display = 'none'),
  );
  deptNao.addEventListener('change', () => {
    buildDeptFields();
    deptContainer.style.display = 'block';
  });
  deptContainer.style.display = 'none';

  // Envio do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    msg.textContent = 'Enviando...';

    const cnpjs = [...document.querySelectorAll('input[name="cnpj"]')]
      .map((i) => i.value.trim())
      .join(', ');
    const fd = new FormData(form);
    fd.delete('cnpj');
    fd.append('cnpjs', cnpjs);

    fetch(URL, { method: 'POST', body: fd })
      .then((r) => r.json())
      .then((d) => {
        if (d.result === 'success') {
          msg.textContent = '✅ Dados enviados com sucesso!';
          form.reset();
          refreshCnpjPlaceholders();
          deptContainer.style.display = 'none';
        } else throw new Error();
      })
      .catch(() => (msg.textContent = '❌ Erro ao enviar.'))
      .finally(() => (btn.disabled = false));
  });
});
