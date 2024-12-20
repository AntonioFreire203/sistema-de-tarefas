const { v4: uuidv4 } = require('uuid');
const { getTasks, getTasksByUser, getTaskById, createTask, updateTask, deleteTask } = require('../models/taskModel');


// Listar tarefas
const listTasks = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      // Admin pode ver apenas as tarefas que ele criou
      const tasks = await getTasks();
      const adminTasks = tasks.filter((task) => task.adminId === req.user.id);
      return res.json(adminTasks);
    }

    // Usuário comum só pode ver as tarefas atribuídas a ele
    return res.json(await getTasksByUser(req.user.id));
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ message: 'Erro ao listar tarefas.' });
  }
};

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



module.exports = { listTasks,getTaskById ,addTask, updateTaskDetails, updateTaskStatus, removeTask };
