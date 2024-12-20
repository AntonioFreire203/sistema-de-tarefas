const { v4: uuidv4 } = require('uuid');
const { getUsers, getUserById, createUser, deleteUser } = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Lista todos os usuários
const listUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários.' });
  }
};

// Obtém um usuário pelo ID
const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ message: 'Erro ao obter usuário.' });
  }
};

// Adiciona um novo usuário comum
const addUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha
    const newUser = { id: uuidv4(), username, password: hashedPassword, isAdmin: false };
    const createdUser = await createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    res.status(500).json({ message: 'Erro ao adicionar usuário.' });
  }
};

// Adiciona um novo administrador
const addAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = { id: uuidv4(), username, password: hashedPassword, isAdmin: true };
    const createdUser = await createUser(newAdmin);
    res.status(201).json({ message: 'Administrador criado com sucesso.', createdUser });
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    res.status(500).json({ message: 'Erro ao criar administrador.' });
  }
};

// Remove um usuário pelo ID
const removeUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.isAdmin) {
      return res.status(403).json({ message: 'Administradores não podem ser excluídos.' });
    }

    const success = await deleteUser(id);
    if (success) {
      res.json({ message: 'Usuário excluído com sucesso.' });
    } else {
      res.status(500).json({ message: 'Erro ao excluir usuário.' });
    }
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    res.status(500).json({ message: 'Erro ao remover usuário.' });
  }
};

module.exports = { listUsers, getUser, addUser, addAdmin, removeUser };
