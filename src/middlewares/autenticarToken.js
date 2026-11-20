
const jwt = require('jsonwebtoken');

function autenticarToken(request, response, next) {
    const authHeader = request.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return response.status.json({
            mensagem: "Token não recebido!!!"
        })

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario)=>{
        if(err) return response.status(403).json({
            mensagem: "Toekn Inválido"
        })

        request.usuario = usuario
        next();
    })
}

module.exports = autenticarToken;