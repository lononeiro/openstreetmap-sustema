import { criarIcone } from "../map/mapIcons.js";
import { municipioBounds, map } from "../map/mapConfig.js";
import { getPontos } from "../services/apiService.js";

let coordenadasClicadas = null;

export function initModalEvents() {
    map.on('click', function(e) {
        if (e.originalEvent.ctrlKey) {
            // if (!municipioBounds.contains(e.latlng)) {
            //     alert("Só é permitido adicionar pontos dentro do município!");
            //     return;
            // }
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

        console.log("Dados enviados para o backend:", novoPonto);
        adicionarMarcador(novoPonto);

        fecharModal();
        alert("Ponto de reciclagem adicionado com sucesso!");
    });

    document.getElementById('btnCancelar').addEventListener('click', fecharModal);
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('nomeEmpresa').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('tipoColeta').value = '';
    coordenadasClicadas = null;
}

export function adicionarMarcador(local) {
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

                </div>
            </div>
        `);
    marcador.on('mouseover', function() {
        this.openPopup();
    });
}
