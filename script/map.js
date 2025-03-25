import { buscarPontos } from "./api.js";
import { criarIcone } from "./createIcons.js";


const municipioBounds = L.latLngBounds(
    L.latLng(-22.5689, -44.5469),
    L.latLng(-22.3689, -44.3469)
);

var map = L.map('map', {
    maxBounds: municipioBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 12
}).setView([-22.4689, -44.4469], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

map.on('drag', function() {
    map.panInsideBounds(municipioBounds, { animate: false });
});

1
 

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    opacity: 0.3,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team'
}).addTo(map);

const baseLayers = {
    "Mapa Padrão": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }),
    "Tema Sustentável": L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO'
    })
};

L.control.layers(baseLayers, null, {position: 'topright'}).addTo(map);

const legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    div.style.backgroundColor = '#f8f9fa';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
    
    let labels = ['<strong>Tipos de Reciclagem</strong>'];
    

    
    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);

async function adicionarMarcador(local) {
    const icone = criarIcone(local.tipo);
    const marcador = L.marker([local.lat, local.lng], { icon: icone })
        .addTo(map)
        .bindPopup(`
            <div style="min-width: 200px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <img src="${icone.options.iconUrl}" width="24" height="24" style="margin-right: 8px;">
                    <h4 style="margin: 0; color: #2e7d32;">${local.nome}</h4>
                </div>
                <p><strong>Tipo:</strong> ${local.tipo}</p>
                <p><strong>Descrição:</strong> ${local.descricao}</p>
                <p><strong>Endereço:</strong> ${local.endereco}</p>
                <div style="text-align: center; margin-top: 10px;">
                    <button style="
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        Ver detalhes
                    </button>
                </div>
            </div>
        `);
    
    marcador.on('mouseover', function() {
        this.openPopup();
    });
}

async function simularCreateBackend(dados) {
    console.log("Dados enviados para o backend:", dados);
}

async function carregarPontos() {
    const pontos = await buscarPontos();
    pontos.forEach(adicionarMarcador);
}

carregarPontos();

let marcadorAtual = null;

document.getElementById('cep').addEventListener('blur', async function() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    const endereco = await buscarEnderecoPorCEP(cep);
    if (endereco) {
        document.getElementById('estado').value = endereco.estado;
        document.getElementById('cidade').value = endereco.cidade;
        document.getElementById('bairro').value = endereco.bairro;
        document.getElementById('rua').value = endereco.rua;
    }
});

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

map.on('click', function(e) {
    if (e.originalEvent.ctrlKey) {
        if (!municipioBounds.contains(e.latlng)) {
            alert("Só é permitido adicionar pontos dentro do município!");
            return;
        }

        const estado = document.getElementById('estado').value;
        const cidade = document.getElementById('cidade').value;
        const bairro = document.getElementById('bairro').value;
        const rua = document.getElementById('rua').value;
        const numero = document.getElementById('numero').value;
        const cep = document.getElementById('cep').value;

        if (!estado || !cidade || !bairro || !rua || !numero || !cep) {
            alert("Preencha todos os campos do endereço corretamente.");
            return;
        }

        if (cidade.toLowerCase() !== 'resende') {
            alert("Só são permitidos endereços no município de Resende-RJ");
            return;
        }

        coordenadasClicadas = e.latlng;
        document.getElementById('modal').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }
});

document.getElementById('btnAdicionar').addEventListener('click', async function() {
    const estado = document.getElementById('estado').value;
    const cidade = document.getElementById('cidade').value;
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const cep = document.getElementById('cep').value;
    const nomeEmpresa = document.getElementById('nomeEmpresa').value;
    const descricao = document.getElementById('descricao').value;
    const tipoColeta = document.getElementById('tipoColeta').value;
    const cepSwitch = document.getElementById('naoSeiCepSwitch');
    
    if (!nomeEmpresa || !descricao || !tipoColeta || !coordenadasClicadas) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    if (cidade.toLowerCase() !== 'resende') {
        alert("Só são permitidos endereços no município de Resende-RJ");
        return;
    }

    let endereco;
    if(cepSwitch.checked) {
        endereco = `${cep}, ${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}, Brasil`;
    } else {
        endereco = `${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}, Brasil`;
    }

    const novoPonto = {
        nome: nomeEmpresa,
        descricao: descricao,
        endereco: endereco,
        lat: coordenadasClicadas.lat,
        lng: coordenadasClicadas.lng,
        tipo: tipoColeta
    };

    await simularCreateBackend(novoPonto);
    adicionarMarcador(novoPonto);

    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('nomeEmpresa').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('tipoColeta').value = '';
    coordenadasClicadas = null;
    alert("Ponto de reciclagem adicionado com sucesso!");
});

document.getElementById('btnCancelar').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    coordenadasClicadas = null;
});

document.getElementById('btnPesquisar').addEventListener('click', pesquisarEndereco);

const cepSwitch = document.getElementById('naoSeiCepSwitch');
const cepInput = document.getElementById('cep');

function gerenciarCEP() {
    if(cepSwitch.checked) {


        cepInput.classList.add('cep-bloqueado');
        cepInput.value = '';
        // Previne qualquer interação
        cepInput.addEventListener('keydown', bloquearEntrada);
        cepInput.addEventListener('click', bloquearClique);
        cepInput.ariaPlaceholder("CEP desabilitado.")
    } else {
       
        cepInput.classList.remove('cep-bloqueado');
        cepInput.removeEventListener('keydown', bloquearEntrada);
        cepInput.removeEventListener('click', bloquearClique);
    }
}

function bloquearEntrada(e) {
    e.preventDefault();
    return false;
}

function bloquearClique(e) {
    e.preventDefault();
    cepInput.blur();
    return false;
}

// Event listeners
cepSwitch.addEventListener('change', gerenciarCEP);
window.addEventListener('load', gerenciarCEP);