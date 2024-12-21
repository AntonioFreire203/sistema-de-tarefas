const { readData, writeData } = require('../utils/fileManager');
const bcrypt = require('bcryptjs');

const fileName = 'users.json';

// Lê todos os usuários
const getUsers = async () => {
  try {
    return await readData(fileName);
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    return [];
  }
};

// Obtém um usuário pelo ID
const getUserById = async (id) => {
  try {
    const users = await getUsers();
    return users.find((user) => user.id === id);
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    return null;
  }
};

// Obtém um usuário pelo nome de usuário
const getUserByUsername = async (username) => {
  try {
    const users = await getUsers();
    return users.find((user) => user.username === username);
  } catch (error) {
    console.error('Erro ao buscar usuário por nome de usuário:', error);
    return null;
  }
};

// Adiciona um novo usuário
const createUser = async (user) => {
  try {
    const users = await getUsers();
    // Adiciona o novo usuário com campos padrão se não fornecidos
    users.push({
      ...user,
      role: user.role || 'Sem cargo', 
      team: user.team || 'Sem equipe', 
    });
    await writeData(fileName, users);
    return user;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Remove um usuário pelo ID
const deleteUser = async (id) => {
  try {
    const users = await getUsers();
    const filteredUsers = users.filter((user) => user.id !== id);
    const userRemoved = filteredUsers.length < users.length;
    await writeData(fileName, filteredUsers);
    return userRemoved;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};

// Atualiza um usuário pelo ID
const updateUser = async (id, updatedData) => {
  try {
    const users = await getUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    const updatedUser = {
      ...users[index],
      ...updatedData, // Atualiza os dados fornecidos
      role: updatedData.role || users[index].role, // Mantém o cargo atual se não for fornecido
      team: updatedData.team || users[index].team, // Mantém a equipe atual se não for fornecida
    };

    users[index] = updatedUser;
    await writeData(fileName, users);
    return updatedUser;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

module.exports = { getUsers, getUserById, getUserByUsername, createUser, deleteUser, updateUser };
