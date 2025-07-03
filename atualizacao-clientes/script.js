document.addEventListener('DOMContentLoaded', () => {
  const blocosCnpj = document.getElementById('blocosCnpj');

  const form = document.getElementById('contactForm');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get('access') !== 'granted') {
    window.location.href = 'index.html';
    return;
  }
  history.replaceState({}, '', 'form.html');

  const cnpjContainer = document.getElementById('cnpj-container');
  const outroCnpjDiv = document.querySelector('.outroCnpj');
  const addCnpjBtn = document.getElementById('addCnpjBtn');
  let removeCnpjBtn = document.getElementById('removeCnpjBtn');
  const phoneInput = document.getElementById('contato');
  const deptSim = document.getElementById('deptSim');
  const deptNao = document.getElementById('deptNao');
  const deptContainer = document.getElementById('dept-container');
  const msg = document.getElementById('msg');
  const URL =
    'https://script.google.com/macros/s/AKfycbyYamPCT4mNuLGStC0UwMbNB3Vwvocs352MNP5um9IabFsApyvXdkomQMr2GqbQTiTLwg/exec';

  if (!removeCnpjBtn) {
    removeCnpjBtn = document.createElement('button');
    removeCnpjBtn.type = 'button';
    removeCnpjBtn.id = 'removeCnpjBtn';
    removeCnpjBtn.textContent = '- Remover CNPJ';
    removeCnpjBtn.className = 'remove-cnpj';
    removeCnpjBtn.disabled = true;
    outroCnpjDiv.querySelector('.campoBtn').append(removeCnpjBtn);
  }

  let blockCounter = 0;

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

  function toggleDeptRequired(visible) {
    const inputs = deptContainer.querySelectorAll('input');
    inputs.forEach((input) => {
      if (visible) {
        input.setAttribute('required', 'required');
      } else {
        input.removeAttribute('required');
      }
    });
  }

  function refreshCnpjPlaceholders() {
    const inputs = document.querySelectorAll('input[name="cnpj"]');
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
  refreshCnpjPlaceholders();

  addCnpjBtn.addEventListener('click', () => {
    blockCounter++;

    // cria container do bloco
    const bloco = document.createElement('div');
    bloco.className = 'bloco-completo';
    bloco.dataset.block = blockCounter;

    // campo de CNPJ
    const cnpjInp = document.createElement('input');
    cnpjInp.type = 'text';
    cnpjInp.name = 'cnpj';
    cnpjInp.required = true;
    cnpjInp.placeholder = `CNPJ${blockCounter}`;
    cnpjInp.dataset.maskAttached = false;
    cnpjInp.addEventListener('input', (e) => {
      e.target.value = maskCNPJ(e.target.value);
    });
    bloco.appendChild(cnpjInp);

    // bloco HTML com campos
    const html = `
    <div class="contact-block" data-block="${blockCounter}">
      <input name="responsavelLegal${blockCounter}" type="text" placeholder="Responsável Legal" required>
      <input name="nomeContato${blockCounter}" type="text" placeholder="Nome do Contato" required>
      <input name="contato${blockCounter}" type="text" placeholder="Telefone" required>
      <input name="email${blockCounter}" type="email" placeholder="Email" required>
      <div class="sim">
        <input type="radio" id="deptSim${blockCounter}" name="mesmoContato${blockCounter}" value="sim" checked>
        <label for="deptSim${blockCounter}">Mesmo contato serve para todos os departamentos</label>
      </div>
      <div class="nao">
        <input type="radio" id="deptNao${blockCounter}" name="mesmoContato${blockCounter}" value="nao">
        <label for="deptNao${blockCounter}">Não, adicionar contato por departamento</label>
      </div>
      <div class="dept-container-block"></div>
    </div>
  `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const blockEl = tempDiv.firstElementChild;
    bloco.appendChild(blockEl);

    blocosCnpj.appendChild(bloco); // ⬅️ insere tudo agrupado

    // lógica dos radios do bloco
    blockEl
      .querySelector(`#deptSim${blockCounter}`)
      .addEventListener('change', () => {
        const localDept = blockEl.querySelector('.dept-container-block');
        localDept.innerHTML = '';
        localDept.style.display = 'none';
      });

    blockEl
      .querySelector(`#deptNao${blockCounter}`)
      .addEventListener('change', () => {
        const localDept = blockEl.querySelector('.dept-container-block');
        buildDeptLocal(localDept, blockCounter);
        localDept.style.display = 'block';
      });

    blockEl
      .querySelector(`input[name="contato${blockCounter}"]`)
      .addEventListener('input', (e) => {
        e.target.value = maskPhone(e.target.value);
      });

    refreshCnpjPlaceholders();
  });

  removeCnpjBtn.addEventListener('click', () => {
    const all = document.querySelectorAll('input[name="cnpj"]');
    if (all.length > 1) {
      all[all.length - 1].remove();
      const blocks = form.querySelectorAll('.contact-block');
      if (blocks.length) blocks[blocks.length - 1].remove();
      refreshCnpjPlaceholders();
    }
  });

  phoneInput.addEventListener(
    'input',
    (e) => (e.target.value = maskPhone(e.target.value)),
  );

  function buildDeptLocal(container, idx) {
    const deps = [
      'Pessoal',
      'Contábil',
      'Financeiro',
      'Fiscal',
      'Registro e Legalização',
      'Comercial',
    ];
    container.innerHTML = '';
    deps.forEach((d, i) => {
      const w = document.createElement('div');
      w.className = 'dept-field';
      const l1 = document.createElement('label');
      l1.textContent = `Contato ${d}`;
      const i1 = document.createElement('input');
      i1.type = 'text';
      i1.name = `contato${idx}${d.replace(/\s+/g, '')}`;
      i1.placeholder = `Telefone ${d}`;
      i1.required = true;
      i1.addEventListener(
        'input',
        (ev) => (ev.target.value = maskPhone(ev.target.value)),
      );

      const l2 = document.createElement('label');
      l2.textContent = `Responsável ${d}`;
      const i2 = document.createElement('input');
      i2.type = 'text';
      i2.name = `responsavel${idx}${d.replace(/\s+/g, '')}`;
      i2.placeholder = `Nome do Responsável ${d}`;
      i2.required = true;

      w.append(l1, i1, l2, i2);
      container.append(w);
      if (i < deps.length - 1) container.append(document.createElement('hr'));
    });
  }

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
    deps.forEach((d, i) => {
      const w = document.createElement('div');
      w.className = 'dept-field';
      const l1 = document.createElement('label');
      l1.textContent = `Contato ${d}`;
      const i1 = document.createElement('input');
      i1.type = 'text';
      i1.name = `contato${d.replace(/\s+/g, '')}`;
      i1.placeholder = `Telefone ${d}`;
      i1.required = true;
      i1.addEventListener(
        'input',
        (ev) => (ev.target.value = maskPhone(ev.target.value)),
      );

      const l2 = document.createElement('label');
      l2.textContent = `Responsável ${d}`;
      const i2 = document.createElement('input');
      i2.type = 'text';
      i2.name = `responsavel${d.replace(/\s+/g, '')}`;
      i2.placeholder = `Nome do Responsável ${d}`;
      i2.required = true;

      w.append(l1, i1, l2, i2);
      deptContainer.append(w);
      if (i < deps.length - 1)
        deptContainer.append(document.createElement('hr'));
    });
  }

  deptSim.addEventListener('change', () => {
    deptContainer.style.display = 'none';
    toggleDeptRequired(false);
  });

  deptNao.addEventListener('change', () => {
    buildDeptFields();
    deptContainer.style.display = 'block';
    toggleDeptRequired(true);
  });

  deptContainer.style.display = 'none';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    msg.textContent = 'Enviando…';
    const cnpjs = Array.from(document.querySelectorAll('input[name="cnpj"]'))
      .map((i) => i.value.trim())
      .join(', ');
    const fd = new FormData(form);
    fd.delete('cnpj');
    fd.append('cnpjs', cnpjs);
    fetch(URL, { method: 'POST', body: fd })
      .then((r) => r.json())
      .then((d) => {
        if (d.result === 'success') {
          msg.textContent = '✅ Dados enviados!';
          form.reset();
          refreshCnpjPlaceholders();
          deptContainer.style.display = 'none';
        } else throw '';
      })
      .catch(() => (msg.textContent = '❌ Erro ao enviar.'))
      .finally(() => (btn.disabled = false));
  });
});
