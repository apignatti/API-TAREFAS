const express = require("express");
const router = express.Router();
const tarefaController = require("../controllers/tarefaController.js");
const autenticarToken = require("../middlewares/autenticarToken.js")

router.get("/", autenticarToken, tarefaController.listarTarefas);
router.post("/", autenticarToken, tarefaController.cadastrarTarefa);
router.get("/:id", autenticarToken, tarefaController.buscarPorId);


/*router.put("/:id",tarefaController.atualizarTarefa);
router.delete("/:id",tarefaController.deletarTarefa);
*/
module.exports = router;
