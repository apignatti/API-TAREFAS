const express = require("express");
const router = express.Router();
const autenticarToken = require("../middlewares/autenticarToken.js")

const {listarResponsaveis, buscarPorId, criarResponsavel, atualizarResponsaveis, deletarResponsaveis, login} = require("../controllers/responsavelController.js");

router.get("/",autenticarToken, listarResponsaveis);
router.post("/",autenticarToken, criarResponsavel);

//router.get("/:id",autenticarToken, buscarPorId);
//router.put("/:id",autenticarToken, atualizarResponsaveis);
//router.delete("/:id",autenticarToken, deletarResponsaveis);*/

router.post("/autenticar", login )

module.exports = router;
