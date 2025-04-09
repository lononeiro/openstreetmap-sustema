// mockDataEdu.js

// Funções de armazenamento
export function carregarConteudosDoLocalStorage() {
    const dados = localStorage.getItem("conteudosEducacionais");
    return dados ? JSON.parse(dados) : [];
}

export function salvarConteudosNoLocalStorage(conteudos) {
    localStorage.setItem("conteudosEducacionais", JSON.stringify(conteudos));
}

// Dados iniciais
const conteudosIniciais = [
    {
        id: 1,
        titulo: "Como Reciclar Agulhas",
        tipo: "Artigo",
        descricao: "Guia completo para descarte seguro de materiais perfurocortantes",
        conteudo: "Lorem ipsum dolor sit amet...",
        dataPublicacao: "2024-03-15",
        autor: "Secretaria do Meio Ambiente"
    },
    {
        id: 2,
        titulo: "Otimização de Coleta",
        tipo: "Vídeo",
        descricao: "Técnicas para melhorar a eficiência da coleta seletiva",
        conteudo: "https://youtube.com/embed/...",
        dataPublicacao: "2024-02-28",
        autor: "Instituto de Reciclagem"
    },
    {
        id: 3,
        titulo: "Otimização de Coleta",
        tipo: "Vídeo",
        descricao: "Técnicas para melhorar a eficiência da coleta seletiva",
        conteudo: "https://youtube.com/embed/...",
        dataPublicacao: "2024-02-28",
        autor: "Instituto de Reciclagem"
    },
    {
        id: 3,
        titulo: "Otimização de Coleta",
        tipo: "Vídeo",
        descricao: "Técnicas para melhorar a eficiência da coleta seletiva",
        conteudo: "https://youtube.com/embed/...",
        dataPublicacao: "2024-02-28",
        autor: "Instituto de Reciclagem"
    },
    {
        id: 3,
        titulo: "Otimização de Coleta",
        tipo: "Vídeo",
        descricao: "Técnicas para melhorar a eficiência da coleta seletiva",
        conteudo: "https://youtube.com/embed/...",
        dataPublicacao: "2024-02-28",
        autor: "Instituto de Reciclagem"
    },
    {
        id: 3,
        titulo: "Otimização de Coleta",
        tipo: "Vídeo",
        descricao: "Técnicas para melhorar a eficiência da coleta seletiva",
        conteudo: "https://youtube.com/embed/...",
        dataPublicacao: "2024-02-28",
        autor: "Instituto de Reciclagem"
    },
    {
        id: 3,
        titulo: "Otimização de Coleta",
        tipo: "Vídeo",
        descricao: "Técnicas para melhorar a eficiência da coleta seletiva",
        conteudo: "https://youtube.com/embed/...",
        dataPublicacao: "2024-02-28",
        autor: "Instituto de Reciclagem"
    },
];

// Carregar dados
export let conteudos = carregarConteudosDoLocalStorage();

// Se não houver dados salvos, inicializa com os dados iniciais
if(conteudos.length === 0) {
    conteudos = [...conteudosIniciais];
    salvarConteudosNoLocalStorage(conteudos);
}

// Funções da API
export function buscarConteudosEducacionais() {
    return new Promise((resolve) => {
        // Sempre carrega os dados mais recentes do localStorage
        const conteudosAtualizados = carregarConteudosDoLocalStorage();
        setTimeout(() => resolve(conteudosAtualizados), 500);
    });
}

export function adicionarConteudo(novoConteudo) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const conteudos = carregarConteudosDoLocalStorage();
            novoConteudo.id = Date.now();
            const novosConteudos = [...conteudos, novoConteudo];
            salvarConteudosNoLocalStorage(novosConteudos);
            resolve(novoConteudo);
        }, 300);
    });
}