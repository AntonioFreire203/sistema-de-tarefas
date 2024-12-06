const express = require('express');
const { getStats } = require('../controllers/statsController');
const router = express.Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Retorna estatísticas da aplicação
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 10
 *                 completedTasks:
 *                   type: integer
 *                   example: 5
 */
router.get('/', getStats);

module.exports = router;
