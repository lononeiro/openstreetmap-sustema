
async function buscarEnderecoPorCEP(cep) {
    if (cep.length !== 8) return null;
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.erro) return null;
        return {
            estado: data.uf,
            cidade: data.localidade,
            bairro: data.bairro,
            rua: data.logradouro,
            cep: data.cep
        };
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
}

async function pesquisarEndereco() {
    const estado = document.getElementById('estado').value;
    const cidade = document.getElementById('cidade').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;

    if (cidade.toLowerCase() !== 'resende') {
        alert("Só são permitidos endereços no município de Resende-RJ");
        return;
    }

    const endereco = `${rua}, ${numero}, ${cidade}, ${estado}, Brasil`;
    const coordenadas = await obterCoordenadas(endereco);

    if (coordenadas) {
        if (!municipioBounds.contains(coordenadas)) {
            alert("Endereço fora dos limites do município!");
            return;
        }
        
        map.setView([coordenadas.lat, coordenadas.lng], 15);
        if (marcadorAtual) map.removeLayer(marcadorAtual);
        marcadorAtual = L.marker([coordenadas.lat, coordenadas.lng])
            .addTo(map)
            .bindPopup("Local pesquisado")
            .openPopup();
    } else {
        alert("Não foi possível encontrar o endereço. Verifique os dados.");
    }
}

async function obterCoordenadas(endereco) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        return null;
    } catch (error) {
        console.error('Erro ao obter coordenadas:', error);
        return null;
    }
}

let coordenadasClicadas = null;

export {buscarEnderecoPorCEP, pesquisarEndereco, obterCoordenadas};