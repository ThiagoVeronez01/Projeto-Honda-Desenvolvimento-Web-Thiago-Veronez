// ===== TOGGLE SENHA =====
function toggleSenha() {
  const input = document.getElementById('senha-input');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ===== TABELA DINÂMICA =====
function carregarTabelaDinamica() {
  fetch('motos.json')
    .then(response => response.json())
    .then(dados => {
      const tabela = document.getElementById('tabela-motos');
      tabela.innerHTML = '';

      dados.forEach(moto => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td><strong>${moto.nome}</strong></td>
          <td><span class="badge-categoria ${moto.categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}">${moto.categoria}</span></td>
          <td>${moto.cilindrada}</td>
          <td>${moto.potencia}</td>
          <td>${moto.torque}</td>
          <td>${moto.consumo}</td>
          <td>${moto.peso}</td>
          <td>${moto.velocidade_maxima}</td>
          <td>${moto.transmissao}</td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch(erro => console.error('Erro ao carregar tabela:', erro));
}

// ===== CARROSSÉIS =====
function initCarousels() {
  const rows = document.querySelectorAll('.carousel-row');

  rows.forEach((row) => {
    const track = row.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const prevButton = row.querySelector('.carousel-btn.prev');
    const nextButton = row.querySelector('.carousel-btn.next');
    let currentIndex = 0;

    const updateActiveCard = () => {
      cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentIndex);
      });
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateActiveCard();
    };

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateActiveCard();
    };

    updateActiveCard();
    let autoSlide = setInterval(showNext, 5500);

    const resetAutoSlide = () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(showNext, 5500);
    };

    nextButton.addEventListener('click', () => { showNext(); resetAutoSlide(); });
    prevButton.addEventListener('click', () => { showPrev(); resetAutoSlide(); });
  });
}

// ===== CARDS FLIP =====
function virarCard(card) {
  card.classList.toggle('virado');
}

// ===== NAVEGAÇÃO ENTRE SUB-ABAS DO CADASTRO =====
function proximaAba(targetId) {
  const tab = document.querySelector(`[data-bs-target="#${targetId}"]`);
  if (tab) {
    const bsTab = new bootstrap.Tab(tab);
    bsTab.show();
  }
}

function finalizarCadastro() {
  alert('Cadastro finalizado com sucesso! 🎉');
}

// ===== MÁSCARA CPF =====
const cpfInput = document.getElementById('cpf-input');
if (cpfInput) {
  cpfInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.value = v;
  });
}

// ===== MÁSCARA DATA =====
const nascInput = document.getElementById('nasc-input');
if (nascInput) {
  nascInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    v = v.replace(/(\d{2})(\d)/, '$1/$2');
    v = v.replace(/(\d{2})(\d)/, '$1/$2');
    this.value = v;
  });
}

// ===== MÁSCARA CEP =====
const cepInput = document.getElementById('cep-input');
if (cepInput) {
  cepInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.value = v;
  });

  cepInput.addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(r => r.json())
        .then(data => {
          if (!data.erro) {
            document.getElementById('endereco-input').value = data.logradouro || '';
            document.getElementById('bairro-input').value = data.bairro || '';
            document.getElementById('cidade-input').value = data.localidade || '';
            const estadoSelect = document.getElementById('estado-input');
            for (let opt of estadoSelect.options) {
              if (opt.value === data.uf) { estadoSelect.value = data.uf; break; }
            }
          }
        })
        .catch(() => {});
    }
  });
}

// ===== PESQUISA =====
const btnPesquisa = document.getElementById('btnPesquisa');
const barraPesquisa = document.getElementById('barraPesquisa');
const inputPesquisa = document.getElementById('inputPesquisa');
const resultadosPesquisa = document.getElementById('resultadosPesquisa');
const btnFecharPesquisa = document.getElementById('btnFecharPesquisa');

const motosData = [
  { nome: 'Fan 160',            img: './images/fan-removebg-preview.png',           aba: 'motos' },
  { nome: 'CBR 300',            img: './images/cbr300r-removebg-preview.png',        aba: 'motos' },
  { nome: 'Sahara 300',         img: './images/sahara-removebg-preview.png',         aba: 'motos' },
  { nome: 'CB 500F',            img: './images/cb500f.avif',                         aba: 'motos' },
  { nome: 'CBR 600RR',          img: './images/cbr600.png',                          aba: 'motos' },
  { nome: 'NC 500X',            img: './images/nc500.avif',                          aba: 'motos' },
  { nome: 'CB 1000 Hornet',     img: './images/cb1000hornet-removebg-preview.png',   aba: 'motos' },
  { nome: 'CBR 1000RR Fireblade', img: './images/fireblade.webp',                   aba: 'motos' },
  { nome: 'Africa Twin',        img: './images/africatwin-removebg-preview.png',     aba: 'motos' },
];

btnPesquisa.addEventListener('click', () => {
  barraPesquisa.classList.toggle('ativa');
  if (barraPesquisa.classList.contains('ativa')) inputPesquisa.focus();
  else resultadosPesquisa.innerHTML = '';
});

btnFecharPesquisa.addEventListener('click', () => {
  barraPesquisa.classList.remove('ativa');
  resultadosPesquisa.innerHTML = '';
  inputPesquisa.value = '';
});

inputPesquisa.addEventListener('input', function () {
  const termo = this.value.toLowerCase().trim();
  resultadosPesquisa.innerHTML = '';

  if (!termo) return;

  const filtrados = motosData.filter(m => m.nome.toLowerCase().includes(termo));

  if (filtrados.length === 0) {
    resultadosPesquisa.innerHTML = '<div class="resultado-item">Nenhuma moto encontrada.</div>';
    return;
  }

  filtrados.forEach(moto => {
    const div = document.createElement('div');
    div.className = 'resultado-item';
    div.innerHTML = `<img src="${moto.img}" alt="${moto.nome}"><span>${moto.nome}</span>`;
    div.addEventListener('click', () => {
      const tab = document.querySelector(`[data-bs-target="#${moto.aba}"]`);
      if (tab) new bootstrap.Tab(tab).show();
      barraPesquisa.classList.remove('ativa');
      resultadosPesquisa.innerHTML = '';
      inputPesquisa.value = '';
    });
    resultadosPesquisa.appendChild(div);
  });
});

// ===== GRÁFICO (Chart.js) =====
let motoChart = null;

const dadosGrafico = {
  nomes: ['Fan 160', 'CBR 300', 'Sahara 300', 'CB 500F', 'CBR 600RR', 'NC 500X', 'CB 1000 Hornet', 'Fireblade', 'Africa Twin'],
  potencia:    [15,  26,  25,  50,  120, 50,  150, 215, 100],
  consumo:     [50,  38,  42,  28,  25,  30,  18,  16,  15],
  peso:        [124, 164, 157, 189, 210, 220, 215, 201, 240],
  velocidade:  [130, 170, 165, 200, 250, 200, 280, 300, 210],
};

function atualizarGrafico() {
  const metrica = document.getElementById('metrica-select').value;
  const valores = dadosGrafico[metrica];
  const labels = {
    potencia:   'Potência (cv)',
    consumo:    'Consumo (km/l)',
    peso:       'Peso (kg)',
    velocidade: 'Velocidade Máx. (km/h)',
  };

  if (motoChart) motoChart.destroy();

  const ctx = document.getElementById('motoChart').getContext('2d');
  motoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dadosGrafico.nomes,
      datasets: [{
        label: labels[metrica],
        data: valores,
        backgroundColor: [
          '#cc0000', '#dd1111', '#ee2222',
          '#ff6600', '#ff7711', '#ff8822',
          '#ff0000', '#ff1111', '#cc3300',
        ],
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#fff' } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} ` } }
      },
      scales: {
        x: { ticks: { color: '#ccc', maxRotation: 30 }, grid: { color: '#333' } },
        y: { ticks: { color: '#ccc' }, grid: { color: '#333' }, beginAtZero: true }
      }
    }
  });
}

// ===== COOKIE BANNER =====
const banner = document.getElementById('cookieBanner');
const btnAceitar = document.getElementById('btnAceitar');
const btnRecusar = document.getElementById('btnRecusar');

function fecharBanner() {
  banner.classList.remove('visivel');
  setTimeout(() => { banner.style.display = 'none'; }, 500);
}

window.addEventListener('load', () => {
  setTimeout(() => { banner.classList.add('visivel'); }, 800);

  // Inicializa tudo
  carregarTabelaDinamica();
  initCarousels();

  // Inicializa gráfico quando a aba é aberta
  document.querySelector('[data-bs-target="#grafico"]').addEventListener('shown.bs.tab', () => {
    atualizarGrafico();
  });
});

btnAceitar.addEventListener('click', () => { fecharBanner(); });
btnRecusar.addEventListener('click', () => { fecharBanner(); });

// Badge de categoria na tabela (CSS inline via JS)
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .badge-categoria {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .badge-categoria.iniciante     { background: #d4f5d4; color: #1a6600; }
    .badge-categoria.intermediario { background: #fff3cd; color: #664400; }
    .badge-categoria.avancado      { background: #fde2e2; color: #660000; }
  `;
  document.head.appendChild(style);
});
