const { readData, writeData } = require('../utils/fileManager');
const fileName = 'tasks.json';

const getTasks = async () => await readData(fileName);
const getTasksByUser = async (userId) => (await getTasks()).filter((task) => task.userId === userId);
const createTask = async (task) => {
  const tasks = await getTasks();
  tasks.push(task);
  await writeData(fileName, tasks);
  return task;
};
const updateTask = async (id, newData) => {
  const tasks = await getTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...newData };
  await writeData(fileName, tasks);
  return tasks[index];
};
const deleteTask = async (id) => {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter((task) => task.id !== id);
  await writeData(fileName, filteredTasks);
  return filteredTasks.length < tasks.length;
};

module.exports = { getTasks, getTasksByUser, createTask, updateTask, deleteTask };
