const express = require("express");
const router = express.Router();
const {listarResponsaveis, buscarPorId, criarResponsaveis, atualizarResponsaveis, deletarResponsaveis} = require("../controllers/responsavelController.js");

router.get("/",listarResponsaveis);
/*router.get("/:id",buscarPorId);
router.post("/",criarResponsaveis);
router.put("/:id",atualizarResponsaveis);
router.delete("/:id",deletarResponsaveis);*/

module.exports = router;
