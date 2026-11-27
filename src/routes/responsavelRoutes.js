const express = require("express");
const router = express.Router();
const autenticarToken = require("../middlewares/autenticarToken.js")

const {listarResponsaveis, buscarPorId, criarResponsavel, atualizarResponsavel, deletarResponsavel, login} = require("../controllers/responsavelController.js");

router.get("/",autenticarToken, listarResponsaveis);
router.post("/",autenticarToken, criarResponsavel);
router.get("/:id",autenticarToken, buscarPorId);
router.put("/:id",autenticarToken, atualizarResponsavel);
router.delete("/:id",autenticarToken, deletarResponsavel);

router.post("/autenticar", login )

module.exports = router;
