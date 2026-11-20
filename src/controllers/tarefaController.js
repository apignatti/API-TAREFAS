const { response } = require("express");
const {Responsavel, Tarefa} = require("../models/")

const listarTarefas = async (require, response)=>{
       try{
        const tarefas = await Tarefa.findAll({
            include: [
                {
                    model: Responsavel, 
                    as: 'responsavel'
                }
           ],
           //attributes: {exclude:['senha']}
        });

        if(tarefas.length > 0){
            return response.status(200).json(tarefas)
        }
        return response.status(404).json({
            "mensagem":"Nenhum tarefa cadastrado."
        })
    }catch(error){
        return response.status(500).json({
            mensagem: "Erro interno do servidor", 
            erro: error.message
        });
    }
}

const  buscarPorId = async (require, response)=>{
    try{
        const id = Number(require.params.id);

        if(isNaN(id)){
            return response.status(400).json({
                mensagem: "O campo id, precisa ser numérico."
            })
        }
        const tarefa = await Tarefa.findByPk(id, {
            include: [{
                model: Responsavel, 
                as: 'responsavel'
            }]
        });
        if(tarefa){
            return response.status(200).json({
                idBusca: id,
                tarefa
            })
        }else{
            return response.status(404).json({
                idBusca: id,
                mensagem: "Registro não encontrado"
            })
        }
    }catch(error){
        return response.status(500).json({
            mensagem: "Erro interno do Servidor",
            erro: error.message
        })
    }
}

const cadastrarTarefa = async(request, response)=>{

    try{
        const { titulo, descricao, preco, tempo_estimado_horas, data_limite, prioridade, id_responsavel} = request.body;
        
        if(!titulo || !descricao || !id_responsavel){
            return response.status(400).json({
                mensagem: "Os campos [titulo, descrição e responsável] são obrigatórios",                
            })
        }

        if(id_responsavel){
            const responsavelExiste = await Responsavel.findByPk(id_responsavel);
            
            if(!responsavelExiste){
                return response.status(404).json({
                    mensagem: "Responsável não cadastrado."
                })
            }
        }
        const novaTarefa = await Tarefa.create(request.body);

        const tarefaCriada = await Tarefa.findByPk(novaTarefa.id, {
            include: [
                {
                    model: Responsavel,
                    as: 'responsavel',
                    attributes: {exclude:['senha']}
                }
            ]
        });
        return response.status(201).json({
            mensagem: "Tarefa criada com sucesso!!!",
            tarefa: tarefaCriada
        })
        
    }catch(error){
        return response.status(500).json({
            mensagem:"Erro ao cria a tarefa",
            erro: error.message
        })
    }
}

module.exports = {
    listarTarefas, cadastrarTarefa, buscarPorId
};