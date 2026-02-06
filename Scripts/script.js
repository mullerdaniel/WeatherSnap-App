let coordenadasAtuais = {
    latitude: -26.4125,
    longitude: -49.0731,
    cidade: 'Schroeder'
};

function obterIcone(codigoClima, isDia, probChuva) {

    if (codigoClima >= 95) {
        return '/Icones-clima/trovao.svg';
    }
    
    if (codigoClima >= 71 && codigoClima <= 86) {
        if (codigoClima >= 85) return '/Icones-clima/nevada-6.svg';
        if (codigoClima >= 75) return '/Icones-clima/chuvoso-4.svg';
        if (codigoClima >= 73) return '/Icones-clima/nevada-4.svg';
        if (codigoClima >= 71) return '/Icones-clima/nevada-3.svg';
        return '/Icones-clima/nevada-2.svg';
    }
    
    if (codigoClima >= 51 && codigoClima <= 82) {
        if (codigoClima >= 82) return '/Icones-clima/chuvoso-7.svg';
        if (codigoClima >= 80) return '/Icones-clima/chuvoso-6.svg';
        if (codigoClima >= 65) return '/Icones-clima/chuvoso-5.svg';
        if (codigoClima >= 63) return '/Icones-clima/chuvoso-4.svg';
        if (codigoClima >= 61) return '/Icones-clima/chuvoso-3.svg';
        if (codigoClima >= 55) return '/Icones-clima/chuvoso-2.svg';
        return '/Icones-clima/chuvoso-1.svg';
    }
    
    if (codigoClima >= 2 && codigoClima <= 3) {
        if (isDia) {
            if (codigoClima === 3) return '/Icones-clima/dia-nublado-3.svg';
            return '/Icones-clima/dia-nublado-2.svg';
        } else {
            if (codigoClima === 3) return '/Icones-clima/noite-nublada-3.svg';
            return '/Icones-clima/noite-nublada-2.svg';
        }
    }
    
    if (codigoClima === 1) {
        return isDia ? '/Icones-clima/dia-nublado-1.svg' : '/Icones-clima/noite-nublada-1.svg';
    }
    
    if (codigoClima >= 45) {
        return '/Icones-clima/nublada.svg';
    }
    
    return isDia ? '/Icones-clima/dia.svg' : '/Icones-clima/noite.svg';
}

function obterEmoji(codigoClima, probChuva) {
    if (codigoClima >= 95) return '⛈️';
    if (codigoClima >= 71 && codigoClima <= 86) return '❄️';
    if (codigoClima >= 51 && codigoClima <= 82) return '🌧️';
    if (codigoClima >= 1 && codigoClima <= 3) return '☁️';
    return '☀️';
}

// Função para obter a cor de fundo baseada no clima e hora
function obterCorFundo(codigoClima, isDia, probChuva) {
    // Trovoada
    if (codigoClima >= 95) {
        return isDia ? 'rgb(60, 70, 85)' : 'rgb(30, 35, 45)';
    }
    
    // Neve
    if (codigoClima >= 71 && codigoClima <= 86) {
        return isDia ? 'rgb(200, 210, 220)' : 'rgb(80, 90, 110)';
    }
    
    // Chuva
    if (codigoClima >= 51 && codigoClima <= 82) {
        return isDia ? 'rgb(70, 85, 100)' : 'rgb(40, 50, 65)';
    }
    
    // Nublado
    if (codigoClima >= 1 && codigoClima <= 3) {
        return isDia ? 'rgb(90, 110, 130)' : 'rgb(50, 65, 80)';
    }
    
    // Céu limpo
    return isDia ? 'rgb(91, 117, 150)' : 'rgb(46, 73, 85)';
}

// Função para buscar cidades usando a API Nominatim (OpenStreetMap)
async function buscarCidades(query) {
    if (query.length < 2) return [];
    
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        return [];
    }
}

// Configurar a barra de pesquisa
function configurarPesquisa() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let timeoutId;

    searchInput.addEventListener('input', async (e) => {
        clearTimeout(timeoutId);
        const query = e.target.value.trim();

        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        timeoutId = setTimeout(async () => {
            const cidades = await buscarCidades(query);
            mostrarResultados(cidades);
        }, 300);
    });

    // Fechar resultados ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// Mostrar resultados da pesquisa
function mostrarResultados(cidades) {
    const searchResults = document.getElementById('search-results');
    
    if (cidades.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">Nenhuma cidade encontrada</div>';
        searchResults.classList.add('active');
        return;
    }

    searchResults.innerHTML = cidades.map(cidade => {
        const nome = cidade.display_name.split(',')[0];
        const detalhes = cidade.display_name.split(',').slice(1, 3).join(',');
        
        return `
            <div class="search-result-item" data-lat="${cidade.lat}" data-lon="${cidade.lon}" data-nome="${nome}">
                <div class="city-name">${nome}</div>
                <div class="city-details">${detalhes}</div>
            </div>
        `;
    }).join('');

    // Adicionar event listeners aos resultados
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const nome = item.dataset.nome;
            
            selecionarCidade(lat, lon, nome);
            searchResults.classList.remove('active');
            document.getElementById('search-input').value = '';
        });
    });

    searchResults.classList.add('active');
}

// Selecionar cidade e atualizar o clima
function selecionarCidade(lat, lon, nome) {
    coordenadasAtuais = {
        latitude: lat,
        longitude: lon,
        cidade: nome
    };
    
    document.getElementById('cidade-nome').textContent = nome;
    atualizarClima();
}

async function atualizarClima() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordenadasAtuais.latitude}&longitude=${coordenadasAtuais.longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const tempAtual = Math.round(data.current.temperature_2m);
        const codigoClimaAtual = data.current.weather_code;
        const tempMax = Math.round(data.daily.temperature_2m_max[0]);
        const tempMin = Math.round(data.daily.temperature_2m_min[0]);
        const probChuva = data.daily.precipitation_probability_max[0];
        
        // Determinar se é dia ou noite
        const horaAtual = new Date().getHours();
        const isDia = horaAtual >= 6 && horaAtual < 18;
        
        // Atualizar cor de fundo
        const corFundo = obterCorFundo(codigoClimaAtual, isDia, probChuva);
        document.body.style.backgroundColor = corFundo;
        const tempSection = document.querySelector('.temperaturas');
        if (tempSection) {
            tempSection.style.backgroundColor = corFundo;
        }
        
        // Atualizar temperatura atual
        document.querySelector('.temperatura-atual').textContent = tempAtual + '°';
        
        // Atualizar ícone principal
        const iconePrincipal = obterIcone(codigoClimaAtual, isDia, probChuva);
        document.querySelector('.temperatura-icone img').src = iconePrincipal;
        
        // Atualizar variação de temperatura
        document.querySelector('.variacao-temperatura h3').textContent = tempMin + '° / ' + tempMax + '°';
        
        // Atualizar descrição
        const descricoes = {
            0: 'Céu Limpo',
            1: 'Parcialmente Nublado',
            2: 'Parcialmente Nublado',
            3: 'Nublado',
            45: 'Nevoeiro',
            48: 'Nevoeiro',
            51: 'Garoa Leve',
            53: 'Garoa Moderada',
            55: 'Garoa Forte',
            61: 'Chuva Leve',
            63: 'Chuva Moderada',
            65: 'Chuva Forte',
            71: 'Neve Leve',
            73: 'Neve Moderada',
            75: 'Neve Forte',
            80: 'Pancadas de Chuva',
            81: 'Pancadas de Chuva',
            82: 'Pancadas de Chuva Forte',
            85: 'Pancadas de Neve',
            86: 'Pancadas de Neve',
            95: 'Trovoada',
            96: 'Trovoada com Granizo',
            99: 'Trovoada Forte'
        };
        
        const descricao = descricoes[codigoClimaAtual] || 'Clima Variado';
        document.querySelector('.descricao-do-dia h3').textContent = descricao;
        
        document.querySelector('.descricao').textContent = 
            `${descricao}. Máximas na casa dos ${tempMax}°C e mínimas em torno de ${tempMin}°C.`;
        
        // Atualizar previsão horária
        const horasItems = document.querySelectorAll('.hora-item');
        
        horasItems.forEach((item, index) => {
            const horaElemento = item.querySelector('.hora');
            const iconeElemento = item.querySelector('.icone');
            const tempElemento = item.querySelector('.temperatura');
            
            const hora = (horaAtual + index) % 24;
            horaElemento.textContent = hora + 'h';
            
            // Temperatura horária da API
            const tempHora = Math.round(data.hourly.temperature_2m[index]);
            tempElemento.textContent = tempHora + '°';
            
            // Ícone horário
            const isDiaHora = hora >= 6 && hora < 18;
            const codigoHora = data.hourly.weather_code[index];
            const probChuvaHora = data.hourly.precipitation_probability[index];
            const emojiHora = obterEmoji(codigoHora, probChuvaHora);
            iconeElemento.textContent = emojiHora;
        });
        
        // Atualizar probabilidades de chuva
        const probabilidades = document.querySelectorAll('.prob-item');
        probabilidades.forEach((prob, index) => {
            const probHora = data.hourly.precipitation_probability[index] || 0;
            prob.textContent = probHora + '%';
        });

        // Atualizar previsão semanal
        const diasConteiner = document.querySelectorAll('.dias-da-semana > div');

        data.daily.time.forEach((dataISO, index) => {
            if (index < diasConteiner.length) {
                const diaBloco = diasConteiner[index];

                const dataObj = new Date(dataISO + "T00:00");
                const nomeDia = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' });
                diaBloco.querySelector('.nome-do-dia-semana h3').innerText = nomeDia.replace('.', '');

                const prob = data.daily.precipitation_probability_max[index];
                diaBloco.querySelector('.prob-chuva h3').innerHTML = `💧${prob}%`;

                const max = Math.round(data.daily.temperature_2m_max[index]);
                const min = Math.round(data.daily.temperature_2m_min[index]);
                
                diaBloco.querySelector('.temperatura-dia h3').innerText = `${max}°`;
                diaBloco.querySelector('.temperatura-noite h3').innerText = `${min}°`;
                
                // Atualizar ícones do dia e noite
                const codigoDia = data.daily.weather_code[index];
                const probDia = data.daily.precipitation_probability_max[index];
                
                const iconeDia = obterIcone(codigoDia, true, probDia);
                const iconeNoite = obterIcone(codigoDia, false, probDia);
                
                diaBloco.querySelector('.clima-dia img').src = iconeDia;
                diaBloco.querySelector('.clima-noite img').src = iconeNoite;
            }
        });

    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
    }
}

// Inicializar quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    configurarPesquisa();
    atualizarClima();
});