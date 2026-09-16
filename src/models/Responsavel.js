const {DataTypes} = require ('sequelize');


module.exports = (sequelize) => {
    return sequelize.define("Responsavel",
        {
            /*id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },*/
            nome:{
                type: DataTypes.STRING(150),
                allowNull: false
            },
             telefone:{
                type: DataTypes.STRING(20),
                allowNull: true
            },
            email:{
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Informe um e-mail válida"
                    }
                }
            },
            senha: {
                type: DataTypes.STRING.apply(255),
                allowNull: false
            },
            foto:{
                type: DataTypes.STRING.apply(150),
                allowNull: true,
                validate:{
                    usUrl: {
                        msg: "O campo foto deve ser uma URL válida"
                    }
                }
            }
        },
        {
                tableName: "responsaveis",
                timestamps: true
            
        }
    );
};