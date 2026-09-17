const { DataTypes } = require('sequelize');
const { toDefaultValue } = require('sequelize/lib/utils');


module.exports = (sequelize) => {
    return sequelize.define("Tarefa",
        {
            titulo: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            descricao: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            preco: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: 0.00
            },
            status: {
                type: DataTypes.ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO'),
                allowNull: false,
                toDefaultValue: 'PENDENTE'
            },
            tempo_estimado_horas: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
                defaultValue: 0.00
            },
            prioridade: {
                type: DataTypes.ENUM('BAIXA', 'MEDIA', 'ALTA'),
                allowNull: false,
                defaultValue: 'MEDIA'
            },
            tags: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },
        {
            tableName: "tarefas",
            timestamps: true

        }
    );
};