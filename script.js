async function atualizarClima() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-26.4125&longitude=-49.0731&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto";

    async function buscarClima() {
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

            const temperaturas = document.querySelectorAll('.hora-item .temperatura');
            temperaturas.forEach((temp, index) => {
                if (temp.textContent !== 'Nascer') {
                    const tempHora = Math.round(tempMin + (tempMax - tempMin) * (index / temperaturas.length));
                    temp.textContent = tempHora + '°';
                }
            });

            const probabilidades = document.querySelectorAll('.prob-item');
            probabilidades.forEach((prob) => {
                prob.textContent = probChuva + '%';
            });

        } catch (error) {
            console.error('Erro ao buscar dados do clima:', error);
        }
    }

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