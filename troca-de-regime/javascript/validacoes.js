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

// Sistema de cache para evitar requisições repetidas
const CACHE_KEY = 'cnpj_cache';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 horas

function getCachedCNPJ(cnpj) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cached = cache[cnpj];

    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION) {
      return cached.data;
    }
  } catch (error) {
    console.error('Erro ao ler cache:', error);
  }
  return null;
}

function setCachedCNPJ(cnpj, data) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[cnpj] = {
      data: data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
  }
}

// Controle de tempo entre requisições
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 segundos entre requisições

btnBuscar.addEventListener('click', async () => {
  const cnpj = inputCnpj.value.replace(/\D/g, '');

  if (cnpj.length !== 14) {
    alert('Digite um CNPJ válido');
    return;
  }

  // Verifica se há cache disponível
  const cachedData = getCachedCNPJ(cnpj);
  if (cachedData) {
    inputRazaoSocial.value = cachedData.razao_social || '';
    alert('Razão social carregada do cache (busca anterior)');
    return;
  }

  // Controle de rate limiting manual
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = Math.ceil(
      (MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000,
    );
    alert(`Aguarde ${waitTime} segundo(s) antes de fazer nova busca`);
    return;
  }

  // Desabilita o botão e mostra feedback visual
  btnBuscar.disabled = true;
  btnBuscar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  lastRequestTime = now;

  // Lista de APIs para tentar em ordem
  const apis = [
    {
      url: `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
      name: 'BrasilAPI',
    },
    {
      url: `https://publica.cnpj.ws/cnpj/${cnpj}`,
      name: 'CNPJ.ws',
    },
    {
      url: `https://receitaws.com.br/v1/cnpj/${cnpj}`,
      name: 'ReceitaWS',
    },
  ];

  let lastError = null;
  let success = false;

  // Tenta cada API em sequência
  for (const api of apis) {
    try {
      console.log(`Tentando ${api.name}...`);

      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CNPJ não encontrado');
        } else if (response.status === 429) {
          throw new Error('Limite de requisições atingido');
        } else {
          throw new Error(`Erro ${response.status}`);
        }
      }

      const data = await response.json();

      // Normaliza os diferentes formatos de resposta
      let razaoSocial =
        data.razao_social || data.nome || data.company?.name || '';

      if (razaoSocial) {
        inputRazaoSocial.value = razaoSocial;
        setCachedCNPJ(cnpj, { razao_social: razaoSocial });
        success = true;
        break;
      } else {
        throw new Error('Razão social não disponível');
      }
    } catch (error) {
      console.warn(`${api.name} falhou:`, error);
      lastError = error;
      // Continua para a próxima API
    }
  }

  if (!success) {
    alert(
      lastError?.message ||
        'Não foi possível buscar o CNPJ. Digite a razão social manualmente.',
    );
    console.error('Todas as APIs falharam. Último erro:', lastError);
  }

  // Restaura o botão
  btnBuscar.disabled = false;
  btnBuscar.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
});
