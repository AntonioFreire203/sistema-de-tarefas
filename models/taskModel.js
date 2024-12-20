const { readData, writeData } = require('../utils/fileManager');
const fileName = 'tasks.json';

// Lê todas as tarefas
const getTasks = async () => await readData(fileName);

// Obtém tarefas associadas a um usuário
const getTasksByUser = async (userId) => (await getTasks()).filter((task) => task.userIds?.includes(userId));

// Cria uma nova tarefa
const createTask = async (task) => {
  const tasks = await getTasks();
  tasks.push(task);
  await writeData(fileName, tasks);
  return task;
};

// Atualiza uma tarefa existente
const updateTask = async (id, updatedData) => {
  const tasks = await getTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  const updatedTask = { ...tasks[index], ...updatedData };
  tasks[index] = updatedTask;
  await writeData(fileName, tasks);
  return updatedTask;
};

// Exclui uma tarefa
const deleteTask = async (id) => {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter((task) => task.id !== id);
  await writeData(fileName, filteredTasks);
  return filteredTasks.length < tasks.length;
};

module.exports = { getTasks, getTasksByUser, createTask, updateTask, deleteTask };
