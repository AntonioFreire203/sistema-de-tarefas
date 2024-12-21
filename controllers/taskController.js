const { v4: uuidv4 } = require('uuid');
const { getTasks, getTasksByUser, getTaskById, createTask, updateTask, deleteTask } = require('../models/taskModel');
const { getUserById } = require('../models/userModel');


// Listar tarefas
const listTasks = async (req, res) => {
  try {
    const tasks = await getTasks();

    if (req.user.isAdmin) {
      // Admin pode ver apenas as tarefas que ele criou
      const adminTasks = tasks.filter(task => task.adminId === req.user.id);

      // Adiciona os detalhes dos usuários atribuídos
      const tasksWithUsers = await Promise.all(
        adminTasks.map(async task => ({
          ...task,
          users: await Promise.all(
            (task.userIds || []).map(userId => getUserById(userId))
          )
        }))
      );

      return res.json(tasksWithUsers);
    }

    // Usuário comum só pode ver as tarefas atribuídas a ele
    const userTasks = await getTasksByUser(req.user.id);

    // Adiciona os detalhes dos usuários atribuídos
    const tasksWithUsers = await Promise.all(
      userTasks.map(async task => ({
        ...task,
        users: await Promise.all(
          (task.userIds || []).map(userId => getUserById(userId))
        )
      }))
    );

    return res.json(tasksWithUsers);
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ message: 'Erro ao listar tarefas.' });
  }
};


// Criar tarefa
const addTask = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Apenas administradores podem criar tarefas.' });
    }

    const { title, userIds } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Campo "title" é obrigatório.' });
    }

    const newTask = {
      id: uuidv4(),
      title,
      status: 'pending', // Status inicial
      adminId: req.user.id, // ID do administrador que criou a tarefa
      userIds: userIds || [], // Usuários atribuídos
    };

    const createdTask = await createTask(newTask);
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ message: 'Erro ao criar tarefa.' });
  }
};

// Atualizar detalhes de uma tarefa
const updateTaskDetails = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    // Verifica se o usuário é o administrador responsável pela tarefa
    if (task.adminId !== req.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para alterar esta tarefa.' });
    }

    const updatedTask = await updateTask(req.params.id, req.body);
    res.json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
  }
};

// Vincular usuários a uma tarefa existente
const assignUsersToTask = async (req, res) => {
  try {
    const { userIds } = req.body;
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    // Verifica se o usuário é o administrador responsável pela tarefa
    if (task.adminId !== req.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para alterar esta tarefa.' });
    }

    task.userIds = [...new Set([...task.userIds, ...userIds])]; // Adiciona usuários sem duplicar
    const updatedTask = await updateTask(req.params.id, task);

    res.json(updatedTask);
  } catch (error) {
    console.error('Erro ao vincular usuários à tarefa:', error);
    res.status(500).json({ message: 'Erro ao vincular usuários à tarefa.' });
  }
};

// Atualizar status de uma tarefa
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Em andamento', 'Pausada', 'Concluída'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status inválido.' });
    }

    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    // Apenas usuários atribuídos podem alterar o status
    if (!task.userIds.includes(req.user.id)) {
      return res.status(403).json({ message: 'Você não tem permissão para alterar o status desta tarefa.' });
    }

    task.status = status; // Atualiza o status
    const updatedTask = await updateTask(id, task);
    res.json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa:', error);
    res.status(500).json({ message: 'Erro ao atualizar status da tarefa.' });
  }
};

// Remover tarefa
const removeTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    // Apenas o administrador responsável pela tarefa pode excluí-la
    if (task.adminId !== req.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar esta tarefa.' });
    }

    const success = await deleteTask(req.params.id);
    res.json({ message: success ? 'Tarefa removida com sucesso.' : 'Falha ao remover a tarefa.' });
  } catch (error) {
    console.error('Erro ao remover tarefa:', error);
    res.status(500).json({ message: 'Erro ao remover tarefa.' });
  }
};




module.exports = {
  listTasks,
  addTask,
  updateTaskDetails,
  assignUsersToTask,
  updateTaskStatus,
  removeTask,
  
};
