const { readData, writeData } = require('../utils/fileManager');
const fileName = 'users.json';

// Lê todos os usuários
const getUsers = async () => {
  return await readData(fileName);
};

// Obtém um usuário pelo ID
const getUserById = async (id) => {
  const users = await getUsers();
  return users.find((user) => user.id === id);
};

// Adiciona um novo usuário
const createUser = async (user) => {
  const users = await getUsers();
  users.push(user);
  await writeData(fileName, users);
  return user;
};

// Remove um usuário pelo ID
const deleteUser = async (id) => {
  const users = await getUsers();
  const filteredUsers = users.filter((user) => user.id !== id);
  await writeData(fileName, filteredUsers);
  return filteredUsers.length < users.length; // Retorna true se um usuário foi removido
};

module.exports = { getUsers, getUserById, createUser, deleteUser };
