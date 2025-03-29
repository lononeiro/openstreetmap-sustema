// Dados simulados da API
const pontos = [
    {
        nome: "Ponto de Reciclagem Centro",
        tipo: "Eletrônico",
        lat: -22.4689,
        lng: -44.4469,
        descricao: "teste1",
        endereco: "teste1",
    },
    {
        nome: "Ponto de Reciclagem Jardim Jalisco",
        tipo: "Orgânico",
        lat: -22.4735,
        lng: -44.4523,
        descricao: "teste2",
        endereco: "teste2",
    },
    {
        nome: "Ponto de Reciclagem Vila Moderna",
        tipo: "Metal",
        lat: -22.4667,
        lng: -44.4384,
        descricao: "teste3",
        endereco: "teste3",
    },
    {
        nome: "Ponto de Reciclagem Parque das Águas",
        tipo: "Químico",
        lat: -22.4702,
        lng: -44.4418,
        descricao: "teste4",
        endereco: "teste4",
    },
    {
        nome: "Ponto de Reciclagem Nova Liberdade",
        tipo: "Eletrônico",
        lat: -22.4758,
        lng: -44.4476,
        descricao: "teste5",
        endereco: "teste5",
    }
];

function buscarPontos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(pontos);
        }, 1000);
    });
}

export { pontos, buscarPontos };
