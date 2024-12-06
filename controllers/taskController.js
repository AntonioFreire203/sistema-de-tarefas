const { v4: uuidv4 } = require('uuid');
const { getTasks, getTasksByUser, createTask, updateTask, deleteTask } = require('../models/taskModel');

// Listar tarefas (Admin pode ver todas, usuário só as suas)
const listTasks = async (req, res) => {
  if (req.user.isAdmin) {
    return res.json(await getTasks());
  }
  return res.json(await getTasksByUser(req.user.id));
};

// Criar tarefa
const addTask = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Campo "title" é obrigatório.' });

  const newTask = { id: uuidv4(), title, status: 'pending', userId: req.user.id };
  res.status(201).json(await createTask(newTask));
};

// Alterar tarefa (somente Admin ou dono)
const updateTaskDetails = async (req, res) => {
  const task = await getTaskById(req.params.id);

  if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });

  // Verifica se o usuário é o dono ou admin
  if (task.userId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Você não tem permissão para alterar esta tarefa.' });
  }

  const updatedTask = await updateTask(req.params.id, req.body);
  res.json(updatedTask);
};

// Remover tarefa (somente Admin ou dono)
const removeTask = async (req, res) => {
  const task = await getTaskById(req.params.id);

  if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });

  // Verifica se o usuário é o dono ou admin
  if (task.userId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Você não tem permissão para deletar esta tarefa.' });
  }

  const success = await deleteTask(req.params.id);
  res.json({ message: success ? 'Tarefa removida com sucesso.' : 'Falha ao remover a tarefa.' });
};

module.exports = { listTasks, addTask, updateTaskDetails, removeTask };
