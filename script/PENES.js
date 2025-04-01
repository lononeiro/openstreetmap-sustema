import { buscarPontos, prepararDados, carregarPontosDoLocalStorage, salvarPontosNoLocalStorage } from "./api/mockData.js";

let pontosColeta = [];

async function carregarPontos() {
    try {
        document.getElementById("lista-pontos-container").innerHTML = '<div class="carregando">Carregando pontos de coleta...</div>';
        
        const dadosLocalStorage = carregarPontosDoLocalStorage();
        if (dadosLocalStorage.length > 0) {
            pontosColeta = prepararDados(dadosLocalStorage);
        } else {
            const dados = await buscarPontos();
            pontosColeta = prepararDados(dados);
            salvarPontosNoLocalStorage(pontosColeta);
        }
        
        renderizarPontos();
    } catch (error) {
        console.error("Erro ao carregar pontos:", error);
        document.getElementById("lista-pontos-container").innerHTML = '<div class="erro">Erro ao carregar pontos de coleta.</div>';
    }
}

function renderizarPontos() {
    const container = document.getElementById("lista-pontos-container");
    
    if (pontosColeta.length === 0) {
        container.innerHTML = '<div class="nenhum-ponto">Nenhum ponto de coleta cadastrado.</div>';
        return;
    }
    
    container.innerHTML = "";
    
    pontosColeta.forEach(ponto => {
        const item = document.createElement("div");
        item.className = "ponto-item";
        item.innerHTML = `
            <span>${ponto.nome}</span>
            <span>${ponto.endereco}</span>
            <span>${ponto.tipo}</span>
            <div class="acoes-item">
                <button class="botao-acao botao-editar" data-id="${ponto.id}">Editar</button>
                <button class="botao-acao botao-excluir" data-id="${ponto.id}">Excluir</button>
            </div>
        `;
        container.appendChild(item);
    });
    
    adicionarEventosBotoes();
}

function adicionarEventosBotoes() {
    document.querySelectorAll(".botao-editar").forEach(btn => {
        btn.addEventListener("click", function() {
            editarPonto(parseInt(this.getAttribute("data-id")));
        });
    });
    
    document.querySelectorAll(".botao-excluir").forEach(btn => {
        btn.addEventListener("click", function() {
            excluirPonto(parseInt(this.getAttribute("data-id")));
        });
    });
}

document.addEventListener("DOMContentLoaded", carregarPontos);



function editarPonto(id) {
    // 1. Encontra o ponto a ser editado
    const ponto = pontosColeta.find(p => p.id === id);
    
    if (ponto) {
        // 2. Preenche o formulário com os dados atuais
        document.getElementById("editar-id").value = ponto.id;
        document.getElementById("editar-nome").value = ponto.nome;
        document.getElementById("editar-endereco").value = ponto.endereco;
        document.getElementById("editar-tipo").value = ponto.tipo;
        
        // 3. Mostra o formulário de edição
        document.getElementById("form-edicao").style.display = "block";
        
        // 4. Configura o evento de submit do formulário
        const formEditar = document.getElementById("formEditarPonto");
        
        // Remove event listener antigo para evitar duplicação
        formEditar.replaceWith(formEditar.cloneNode(true));
        
        // Adiciona novo event listener
        document.getElementById("formEditarPonto").addEventListener("submit", function(e) {
            e.preventDefault();
            
            // 5. Obtém os valores editados
            const id = parseInt(document.getElementById("editar-id").value);
            const nome = document.getElementById("editar-nome").value;
            const endereco = document.getElementById("editar-endereco").value;
            const tipo = document.getElementById("editar-tipo").value;
            
            // 6. Atualiza o ponto no array
            const index = pontosColeta.findIndex(p => p.id === id);
            if (index !== -1) {
                pontosColeta[index] = {
                    ...pontosColeta[index],
                    nome,
                    endereco,
                    tipo
                };
                
                // 7. Salva no localStorage
                localStorage.setItem('pontosColeta', JSON.stringify(pontosColeta));
                
                // 8. Atualiza a exibição
                renderizarPontos();
                
                // 9. Esconde o formulário
                document.getElementById("form-edicao").style.display = "none";
                
                // 10. Feedback para o usuário
                alert("Ponto atualizado com sucesso!");
            }
        });
    }
}
function excluirPonto(id) {
    if (confirm("Tem certeza que deseja excluir este ponto?")) {
        pontosColeta = pontosColeta.filter(p => p.id !== id);
        salvarPontosNoLocalStorage(pontosColeta);
        renderizarPontos();
    }
}
