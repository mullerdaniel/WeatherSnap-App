// Coordenadas padrão (Schroeder)
let coordenadasAtuais = {
    latitude: -26.4125,
    longitude: -49.0731,
    cidade: 'Schroeder'
};

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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordenadasAtuais.latitude}&longitude=${coordenadasAtuais.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const tempMax = Math.round(data.daily.temperature_2m_max[0]);
        const tempMin = Math.round(data.daily.temperature_2m_min[0]);
        const tempAtual = Math.round((tempMax + tempMin) / 2); 
        const probChuva = data.daily.precipitation_probability_max[0];
        
        document.querySelector('.temperatura-atual').textContent = tempAtual + '°';
        
        document.querySelector('.variacao-temperatura h3').textContent = tempMin + '° / ' + tempMax + '°';
        
        const descricao = probChuva > 50 ? 'Nublado' : 'Limpo';
        document.querySelector('.descricao-do-dia h3').textContent = descricao;
        
        document.querySelector('.descricao').textContent = 
            `Clima ${descricao}. Máximas na casa dos ${tempMax}°C e mínimas em torno de ${tempMin}°C.`;
        
        const horaAtual = new Date().getHours();
        const horasItems = document.querySelectorAll('.hora-item');
        
        horasItems.forEach((item, index) => {
            const horaElemento = item.querySelector('.hora');
            const tempElemento = item.querySelector('.temperatura');
            
            const hora = (horaAtual + index) % 24;
            horaElemento.textContent = hora + 'h';
            
            let tempHora;
            if (hora >= 6 && hora <= 14) {
                tempHora = Math.round(tempMin + (tempMax - tempMin) * ((hora - 6) / 8));
            } else if (hora > 14 && hora <= 18) {
                tempHora = Math.round(tempMax - (tempMax - tempMin) * ((hora - 14) / 4));
            } else {
                tempHora = tempMin;
            }
            
            tempElemento.textContent = tempHora + '°';
        });
        
        const probabilidades = document.querySelectorAll('.prob-item');
        probabilidades.forEach((prob) => {
            prob.textContent = probChuva + '%';
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