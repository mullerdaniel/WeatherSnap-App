// Configuração da API Open-Meteo (grátis, sem necessidade de API key!)
// Coordenadas de Schroeder, SC
const LATITUDE = -26.4125;
const LONGITUDE = -49.0731;

// URLs da API
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Sao_Paulo&forecast_days=7`;

// Mapeamento de códigos de clima WMO para descrições em português
const codigosClima = {
    0: 'Limpo',
    1: 'Principalmente Limpo',
    2: 'Parcialmente Nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Névoa',
    51: 'Garoa Leve',
    53: 'Garoa Moderada',
    55: 'Garoa Forte',
    56: 'Garoa Gelada Leve',
    57: 'Garoa Gelada Forte',
    61: 'Chuva Leve',
    63: 'Chuva Moderada',
    65: 'Chuva Forte',
    66: 'Chuva Gelada Leve',
    67: 'Chuva Gelada Forte',
    71: 'Neve Leve',
    73: 'Neve Moderada',
    75: 'Neve Forte',
    77: 'Grãos de Neve',
    80: 'Pancadas Leves',
    81: 'Pancadas Moderadas',
    82: 'Pancadas Fortes',
    85: 'Pancadas de Neve Leves',
    86: 'Pancadas de Neve Fortes',
    95: 'Tempestade',
    96: 'Tempestade com Granizo Leve',
    99: 'Tempestade com Granizo Forte'
};

// Emojis para cada código de clima
const emojisClima = {
    0: { dia: '☀️', noite: '🌙' },
    1: { dia: '🌤️', noite: '🌙' },
    2: { dia: '⛅', noite: '☁️' },
    3: { dia: '☁️', noite: '☁️' },
    45: { dia: '🌫️', noite: '🌫️' },
    48: { dia: '🌫️', noite: '🌫️' },
    51: { dia: '🌦️', noite: '🌧️' },
    53: { dia: '🌧️', noite: '🌧️' },
    55: { dia: '🌧️', noite: '🌧️' },
    61: { dia: '🌧️', noite: '🌧️' },
    63: { dia: '🌧️', noite: '🌧️' },
    65: { dia: '🌧️', noite: '🌧️' },
    71: { dia: '❄️', noite: '❄️' },
    73: { dia: '❄️', noite: '❄️' },
    75: { dia: '❄️', noite: '❄️' },
    80: { dia: '🌦️', noite: '🌧️' },
    81: { dia: '🌧️', noite: '🌧️' },
    82: { dia: '🌧️', noite: '🌧️' },
    85: { dia: '❄️', noite: '❄️' },
    86: { dia: '❄️', noite: '❄️' },
    95: { dia: '⛈️', noite: '⛈️' },
    96: { dia: '⛈️', noite: '⛈️' },
    99: { dia: '⛈️', noite: '⛈️' }
};

// Mapeamento de códigos de clima para ícones SVG
const iconesClimaSVG = {
    0: { dia: 'dia.svg', noite: 'noite.svg' },
    1: { dia: 'dia.svg', noite: 'noite.svg' },
    2: { dia: 'dia-nublado-3.svg', noite: 'noite-nublada-3.svg' },
    3: { dia: 'dia-nublado-3.svg', noite: 'noite-nublada-3.svg' },
    45: { dia: 'nublado.svg', noite: 'nublado.svg' },
    48: { dia: 'nublado.svg', noite: 'nublado.svg' },
    51: { dia: 'chuvoso-1.svg', noite: 'chuvoso-5.svg' },
    53: { dia: 'chuvoso-1.svg', noite: 'chuvoso-5.svg' },
    55: { dia: 'chuvoso-6.svg', noite: 'chuvoso-5.svg' },
    61: { dia: 'chuvoso-1.svg', noite: 'chuvoso-5.svg' },
    63: { dia: 'chuvoso-6.svg', noite: 'chuvoso-5.svg' },
    65: { dia: 'chuvoso-6.svg', noite: 'chuvoso-5.svg' },
    71: { dia: 'nevada-3.svg', noite: 'nevada-5.svg' },
    73: { dia: 'nevada-3.svg', noite: 'nevada-5.svg' },
    75: { dia: 'nevada-3.svg', noite: 'nevada-5.svg' },
    80: { dia: 'chuvoso-1.svg', noite: 'chuvoso-5.svg' },
    81: { dia: 'chuvoso-6.svg', noite: 'chuvoso-5.svg' },
    82: { dia: 'chuvoso-6.svg', noite: 'chuvoso-5.svg' },
    85: { dia: 'nevada-3.svg', noite: 'nevada-5.svg' },
    86: { dia: 'nevada-3.svg', noite: 'nevada-5.svg' },
    95: { dia: 'tempestade-2.svg', noite: 'tempestade-2.svg' },
    96: { dia: 'tempestade-2.svg', noite: 'tempestade-2.svg' },
    99: { dia: 'tempestade-2.svg', noite: 'tempestade-2.svg' }
};

// Dias da semana em português
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Função para obter emoji do clima
function getEmojiClima(codigo, hora) {
    const horaNum = parseInt(hora);
    const ehNoite = horaNum < 6 || horaNum >= 18;
    
    const emoji = emojisClima[codigo] || emojisClima[0];
    return ehNoite ? emoji.noite : emoji.dia;
}

// Função para obter ícone SVG do clima
function getIconeSVG(codigo, ehNoite) {
    const icone = iconesClimaSVG[codigo] || iconesClimaSVG[0];
    return ehNoite ? icone.noite : icone.dia;
}

// Função para obter descrição do clima
function getDescricaoClima(codigo) {
    return codigosClima[codigo] || 'Variado';
}

// Função principal para buscar dados do clima
async function buscarClima() {
    try {
        const resposta = await fetch(API_URL);
        
        if (!resposta.ok) {
            throw new Error('Erro ao buscar dados do clima');
        }
        
        const dados = await resposta.json();
        
        // Atualizar todos os elementos da página
        atualizarClimaAtual(dados);
        atualizarPrevisaoHoraria(dados);
        atualizarPrevisaoSemanal(dados);
        
    } catch (erro) {
        console.error('Erro ao buscar dados do clima:', erro);
        alert('Erro ao carregar dados do clima. Verifique sua conexão com a internet.');
    }
}

// Atualizar clima atual
function atualizarClimaAtual(dados) {
    const agora = new Date();
    const horaAtual = agora.getHours();
    
    // Encontrar índice da hora atual nos dados
    const indiceAtual = dados.hourly.time.findIndex(time => {
        const dataHora = new Date(time);
        return dataHora.getHours() === horaAtual && 
               dataHora.getDate() === agora.getDate();
    });
    
    if (indiceAtual === -1) return;
    
    // Pegar dados da hora atual
    const tempAtual = Math.round(dados.hourly.temperature_2m[indiceAtual]);
    const codigoClima = dados.hourly.weather_code[indiceAtual];
    
    // Pegar temperaturas do dia (hoje)
    const tempMax = Math.round(dados.daily.temperature_2m_max[0]);
    const tempMin = Math.round(dados.daily.temperature_2m_min[0]);
    
    // Atualizar temperatura atual
    const tempAtualElement = document.querySelector('.temperatura-atual');
    if (tempAtualElement) tempAtualElement.textContent = `${tempAtual}°`;
    
    // Atualizar descrição
    const descricaoElement = document.querySelector('.descricao-do-dia h3');
    if (descricaoElement) {
        descricaoElement.textContent = getDescricaoClima(codigoClima);
    }
    
    // Atualizar variação de temperatura
    const variacaoTemp = document.querySelector('.variacao-temperatura h3');
    if (variacaoTemp) variacaoTemp.textContent = `${tempMin}° / ${tempMax}°`;
    
    // Atualizar descrição detalhada do primeiro bloco
    const descricaoBloco = document.querySelector('.bloco-temperaturas-horas .descricao');
    if (descricaoBloco) {
        descricaoBloco.textContent = `Clima ${getDescricaoClima(codigoClima)}. Máximas na casa dos ${tempMax}°C e mínimas em torno de ${tempMin}°C.`;
    }
}

// Atualizar previsão horária (primeiro bloco - próximas 7 horas)
function atualizarPrevisaoHoraria(dados) {
    const horariosContainer = document.querySelector('.horarios');
    const probabilidadesContainer = document.querySelector('.probabilidades');
    
    if (!horariosContainer || !probabilidadesContainer) return;
    
    // Limpar containers
    horariosContainer.innerHTML = '';
    probabilidadesContainer.innerHTML = '';
    
    const agora = new Date();
    
    // Encontrar índice da hora atual
    const indiceAtual = dados.hourly.time.findIndex(time => {
        const dataHora = new Date(time);
        return dataHora >= agora;
    });
    
    if (indiceAtual === -1) return;
    
    // Pegar as próximas 7 horas
    for (let i = 0; i < 7; i++) {
        const indice = indiceAtual + i;
        if (indice >= dados.hourly.time.length) break;
        
        const dataHora = new Date(dados.hourly.time[indice]);
        const hora = dataHora.getHours();
        const temp = Math.round(dados.hourly.temperature_2m[indice]);
        const codigoClima = dados.hourly.weather_code[indice];
        const probChuva = dados.hourly.precipitation_probability[indice] || 0;
        
        // Verificar se é horário de nascer do sol (entre 5h e 6h)
        const ehNascer = hora >= 5 && hora <= 6 && i === 0;
        
        // Criar elemento de hora
        const horaItem = document.createElement('div');
        horaItem.className = 'hora-item';
        horaItem.innerHTML = `
            <div class="hora">${ehNascer ? hora + ':01' : hora + 'h'}</div>
            <div class="icone">${ehNascer ? '🌤️' : getEmojiClima(codigoClima, hora)}</div>
            <div class="temperatura">${ehNascer ? 'Nascer' : temp + '°'}</div>
        `;
        horariosContainer.appendChild(horaItem);
        
        // Criar elemento de probabilidade
        const probItem = document.createElement('div');
        probItem.className = 'prob-item';
        probItem.textContent = `${Math.round(probChuva)}%`;
        probabilidadesContainer.appendChild(probItem);
    }
}

// Atualizar previsão semanal (segundo bloco - próximos 7 dias)
function atualizarPrevisaoSemanal(dados) {
    const diasContainer = document.querySelector('.dias-da-semana');
    
    if (!diasContainer) return;
    
    // Limpar container
    diasContainer.innerHTML = '';
    
    // Criar elementos para cada dia (máximo 7 dias)
    const numeroDias = Math.min(dados.daily.time.length, 7);
    
    for (let i = 0; i < numeroDias; i++) {
        const dataString = dados.daily.time[i];
        const data = new Date(dataString + 'T12:00:00');
        const diaNome = diasSemana[data.getDay()];
        
        const tempMax = Math.round(dados.daily.temperature_2m_max[i]);
        const tempMin = Math.round(dados.daily.temperature_2m_min[i]);
        const codigoClima = dados.daily.weather_code[i];
        const probChuva = dados.daily.precipitation_probability_max[i] || 0;
        
        // Determinar se é neve (códigos 71-77, 85-86)
        const ehNeve = codigoClima >= 71 && codigoClima <= 77 || codigoClima >= 85 && codigoClima <= 86;
        const iconeProbabilidade = ehNeve ? '❄️' : '💧';
        
        // Criar elemento do dia
        const diaElemento = document.createElement('div');
        diaElemento.className = diaNome.toLowerCase();
        diaElemento.innerHTML = `
            <div class="nome-do-dia-semana">
                <h3>${diaNome}</h3>
            </div>
            <div class="prob-chuva">
                <h3>${iconeProbabilidade}${Math.round(probChuva)}%</h3>
            </div>
            <div class="clima-dia">
                <img src="/Icones-clima/${getIconeSVG(codigoClima, false)}" alt="">
            </div>
            <div class="clima-noite">
                <img src="/Icones-clima/${getIconeSVG(codigoClima, true)}" alt="">
            </div>
            <div class="temperatura-dia">
                <h3>${tempMax}°</h3>
            </div>
            <div class="temperatura-noite">
                <h3>${tempMin}°</h3>
            </div>
        `;
        
        diasContainer.appendChild(diaElemento);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    buscarClima();
    
    // Atualizar a cada 15 minutos (API Open-Meteo atualiza a cada 15 min)
    setInterval(buscarClima, 900000);
});