const { getUsers } = require('../models/userModel');
const { getTasks } = require('../models/taskModel');

// Retorna estatísticas básicas da aplicação
const getStats = async (req, res) => {
  try {
    const users = await getUsers(); // Obtém a lista de usuários
    const tasks = await getTasks(); // Obtém a lista de tarefas

    // Calcula as estatísticas
    const completedTasks = tasks.filter((task) => task.status === 'completed').length;
    const pendingTasks = tasks.length - completedTasks;

    // Retorna as estatísticas
    res.json({
      totalUsers: users.length,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter estatísticas.' });
  }
};

module.exports = { getStats };
