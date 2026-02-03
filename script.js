async function atualizarClima() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-26.4125&longitude=-49.0731&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto";









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