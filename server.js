require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();

const tarefaRoutes = require("./src/routes/tarefaRoutes.js");
const responsavelRoutes = require("./src/routes/responsavelRoutes");
const { sequelize } = require('./src/models/index.js');

app.use(express.json());
app.use(cors());

app.use("/tarefas", tarefaRoutes);
app.use("/responsaveis", responsavelRoutes);

app.get("/", (require, response) => {
    response.status(200).json({
        mensagem: "Seja Bem Vindo ao Gerenciador de Tarefas"
    });
});

app.use((require, response) => {
    response.status(404).json({
        erro: "Essa rota não existe!!!"
    })
});

const port = process.env.PORT || 5000;

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        console.log("Conexão com o banco de dados estabelecida com sucesso")

        await sequelize.sync();
        //await sequelize.sync({ alter: true });
        //await sequelize.sync({ force: true });

        console.log("Tabelas sincronizadas com sucesso.");
        if (process.env.NODE_ENV !== "production") {
            app.listen(port, function () {
                console.log(`Servidor rodando no link http://localhost:${port}`)
            });
        }
    } catch (error) {
        console.log("Não foi possivel conectar ao banco de dados", error)
    }
}

iniciarServidor();
module.exports = app;


/*app.get("/tarefas", (require, response) => {
    if (dbTarefa.length > 0) {
        response.status(200).json(dbTarefa);
    } else {
        response.status(404).json({
            mensagem: "Lista de Tarefas está vazia!!"
        });
    }
});

app.get("/tarefa/:id", (require, response) => {
    const idBusca = Number(require.params.id);

    if (isNaN(idBusca)) {
        return response.status(400).json({
            erro: "ID Inválido"
        })
    }
    const tarefa = dbTarefa.find((item) => item.id === idBusca);

    if (!tarefa)
        return response.status(404).json({
            idBusca: idBusca,
            erro: "Tarefa não encontrada"
        })
    return response.status(200).json({
        idBusca: idBusca, tarefa
    })
})

app.post("/tarefa", (require, response) => {

    const { titulo, descricao, responsavel } = require.body

    if (!titulo || !descricao || !responsavel) {
        return responsavel.status().json({
            erro: "Todos os campos são Obrigatórios"
        })
    }

    const dataAtual = new Date().toISOString().split('T')[0];

    const novoId = dbTarefa.length > 0 ? dbTarefa[dbTarefa.length - 1].id + 1 : 1

    const novaTarefa = {
        id: novoId, titulo, descricao, status: 'EM ANDAMENTO',
        responsavel: {
            id: responsavel?.id || (novoId + 10),
            nome: responsavel?.nome || 'Não Atribuido',
            data_criacao: dataAtual,
            data_atualizacao: dataAtual
        },
        data_criacao: dataAtual,
        data_atualizacao: dataAtual
    }

    dbTarefa.push(novaTarefa);
    return response.status(201).json({
        mensagem: 'Tarefa criada com sucesso!!!',
        tarefa: novaTarefa
    })
})

app.put("/tarefa/:id", (require, response) => {

    const id = Number(require.params.id);
    if (isNaN(id)) {
        return response.status(400).json({
            erro: "ID Inválido"
        })
    }
    const index = dbTarefa.findIndex(t => t.id === id);
    if (index === -1) {
        return response.status(404).json({
            erro: "Tarefa não encontrada!!!"
        })
    }

    const {titulo, descricao, responsavel, status} = require.body;
    const dataAtual = new Date().toISOString().split('T')[0];

    dbTarefa[index]={
        ...dbTarefa[index],
        titulo : titulo || dbTarefa[index]. titulo,
        descricao : descricao || [index].descricao,
        status : status || [index].status,
        responsavel : responsavel ? {
            ...dbTarefa[index].responsavel,
            ...responsavel,
            data_atualizacao:dataAtual
        } : dbTarefa[index].responsavel,
        data_atualizacao: dataAtual
    }
    return response.status(200).json({
        mensagem: "Tarefa Atualizada com Sucesso!!!",
        tarefa: dbTarefa[index]
    })
})

app.delete("/tarefa/:id", (require, response)=>{
    const id = Number(require.params.id);

    if (isNaN(id)) {
        return response.status(400).json({
            erro: "ID Inválido"
        })
    }
    const index = dbTarefa.findIndex(t => t.id === id);

    if (index === -1) {
        return response.status(404).json({
            erro: "Tarefa não encontrada!!!"
        })
    }
        const tarefaRemovida = dbTarefa.splice(index, 1);

        return response.status(200).json({
            mensagem: "Tarefa removida com sucesso!!!",
            tarefaRemovida: tarefaRemovida
        })

})*/

