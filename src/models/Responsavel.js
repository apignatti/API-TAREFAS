
const { DataTypes } = require('sequelize');
 
module.exports = (sequelize) => {
    return sequelize.define("Responsavel",
        {
            nome: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            telefone: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Informe um e-mail válido"
                    }
                }
            },
            senha: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            foto: {
                type: DataTypes.STRING(150),
                allowNull: true,
                validate: {
                    isUrl: {
                        msg: "O campo foto deve ser uma URL válida"
                    }
                }
            },

            especialidade: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            cargo: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            departamento: {
                type: DataTypes.STRING(100),
                allowNull: true
            }
        },
        {
            tableName: "responsaveis",
            timestamps: true
        }
    );
};
 




