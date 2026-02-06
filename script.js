async function atualizarClima() {
    // URL da API
const url = "https://api.open-meteo.com/v1/forecast?latitude=-26.4125&longitude=-49.0731&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto";

// Função para buscar dados do clima
async function buscarClima() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Pegar dados do primeiro dia (hoje)
        const tempMax = Math.round(data.daily.temperature_2m_max[0]);
        const tempMin = Math.round(data.daily.temperature_2m_min[0]);
        const tempAtual = Math.round((tempMax + tempMin) / 2); // Aproximação
        const probChuva = data.daily.precipitation_probability_max[0];
        
        // Atualizar temperatura atual
        document.querySelector('.temperatura-atual').textContent = tempAtual + '°';
        
        // Atualizar variação de temperatura
        document.querySelector('.variacao-temperatura h3').textContent = tempMin + '° / ' + tempMax + '°';
        
        // Atualizar descrição
        const descricao = probChuva > 50 ? 'Nublado' : 'Limpo';
        document.querySelector('.descricao-do-dia h3').textContent = descricao;
        
        // Atualizar descrição do bloco
        document.querySelector('.descricao').textContent = 
            `Clima ${descricao}. Máximas na casa dos ${tempMax}°C e mínimas em torno de ${tempMin}°C.`;
        
        // Atualizar horários e temperaturas
        const horaAtual = new Date().getHours();
        const horasItems = document.querySelectorAll('.hora-item');
        
        horasItems.forEach((item, index) => {
            const horaElemento = item.querySelector('.hora');
            const tempElemento = item.querySelector('.temperatura');
            
            // Calcular a hora para este item (hora atual + index)
            const hora = (horaAtual + index) % 24;
            horaElemento.textContent = hora + 'h';
            
            // Calcular temperatura baseada na hora do dia
            let tempHora;
            if (hora >= 6 && hora <= 14) {
                // Manhã e início da tarde - temperatura subindo
                tempHora = Math.round(tempMin + (tempMax - tempMin) * ((hora - 6) / 8));
            } else if (hora > 14 && hora <= 18) {
                // Tarde - temperatura descendo
                tempHora = Math.round(tempMax - (tempMax - tempMin) * ((hora - 14) / 4));
            } else {
                // Noite e madrugada - temperaturas baixas
                tempHora = tempMin;
            }
            
            tempElemento.textContent = tempHora + '°';
        });
        
        // Atualizar probabilidades
        const probabilidades = document.querySelectorAll('.prob-item');
        probabilidades.forEach((prob) => {
            prob.textContent = probChuva + '%';
        });
        
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
    }
}

// Executar quando a página carregar
window.addEventListener('DOMContentLoaded', buscarClima);







    // Atualizando Clima do bloco 2
    try {
        const response = await fetch(url);
        const data = await response.json();

 
        const diasConteiner = document.querySelectorAll('.dias-da-semana > div');

        data.daily.time.forEach((dataISO, index) => {
            if (index < diasConteiner.length) {
                const diaBloco = diasConteiner[index];

                // 1. Atualizar Nome do Dia (Ex: Seg, Ter...)
                const dataObj = new Date(dataISO + "T00:00");
                const nomeDia = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' });
                diaBloco.querySelector('.nome-do-dia-semana h3').innerText = nomeDia.replace('.', '');

                // 2. Atualizar Probabilidade de Chuva
                const prob = data.daily.precipitation_probability_max[index];
                diaBloco.querySelector('.prob-chuva h3').innerHTML = `💧${prob}%`;

                // 3. Atualizar Temperaturas
                const max = Math.round(data.daily.temperature_2m_max[index]);
                const min = Math.round(data.daily.temperature_2m_min[index]);
                
                diaBloco.querySelector('.temperatura-dia h3').innerText = `${max}°`;
                diaBloco.querySelector('.temperatura-noite h3').innerText = `${min}°`;
            }
        });

    } catch (error) {
        console.error("Erro ao buscar dados do clima:", error);
    }
}

atualizarClima();