const bcrypt = require('bcrypt');

const { Responsavel, Tarefa } = require("../models/");
const { request, response } = require('express');

const jwt = require("jsonwebtoken")
const listarResponsaveis = async (request, response) => {
    try {
        const responsaveis = await Responsavel.findAll({
            include: [
                {
                    model: Tarefa,
                    as: 'tarefas'
                }
            ],
            attributes: { exclude: ['senha'] }
        });
        if (responsaveis.length > 0) {
            return response.status(200).json(responsaveis)
        }
        return response.status(404).json({
            "mensagem": "Nenhum responsavel cadastrado."
        })
    } catch (error) {
        return response.status(500).json({
            mensagem: "Erro interno do servidor",
            erro: error.message
        });
    }
}

const criarResponsavel = async (request, response) => {
    try {
        const { nome, email, telefone, senha, foto, especialidade, cargo, departamento } = request.body;

        if (!nome || !email || !senha) {
            return response.status(400).json({
                mensagem: "Os campos 'nome', 'email' e 'senha' são obrigatórios."
            });
        }

        const salto = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salto);

        const novoResponsavel = await Responsavel.create({
            nome,
            email,
            telefone: telefone || null,
            senha: senhaHash,
            foto: foto || null,
            especialidade: especialidade || null,
            cargo: cargo || null,
            departamento: departamento || null
        });

        novoResponsavel.senha = undefined;

        return response.status(201).json({
            mensagem: "Responsável criado com sucesso!",
            responsavel: novoResponsavel
        });

    } catch (error) {
        console.error('Erro ao criar responsável:', error);
        return response.status(500).json({
            mensagem: "Erro interno do servidor",
            erro: error.message
        });
    }
};

const login = async (request, response) => {
    try {
        const { email, senha } = request.body;

        if (!email || !senha) {
            return response.status(400).json({
                mensagem: "Os campos 'email' e 'senha' são obrigatórios!"
            })
        }
        const responsavel = await Responsavel.findOne({ where: { email } });

        if (!responsavel) {
            return response.status(400).json({
                mensagem: "E-mail não cadastrado"
            })
        }
        const senhaValida = await bcrypt.compare(senha, responsavel.senha);

        if (!senhaValida) {
            return response.status(400).json({
                mensagem: "Senha incorreta!!!"
            })
        }

        const payload = {
            id: responsavel.id,
            nome: responsavel.nome,
            email: responsavel.email,
        }

        const segredo = process.env.JWT_SECRET;

        const opcoes = {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

        const token = jwt.sign(payload, segredo, opcoes);

        return response.status(201).json({
            mensagem: "Login realizado com sucesso!!!",
            responsavel: responsavel,
            token: token
        });

    } catch (error) {
        console.error('Erro ao criar responsavel:', error);
        return response.status(500).json({
            mensagem: "Erro interno do servidor", erro: error.message }
        );
    }
}

module.exports = {
    listarResponsaveis, criarResponsavel, login
};