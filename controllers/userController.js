const { v4: uuidv4 } = require('uuid');
const { getUsers, getUserById, createUser, deleteUser, updateUser: updateUserInModel, getUserByUsername } = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Função auxiliar para verificar duplicidade de username e hash de senha
const createUserObject = async (username, password, isAdmin = false) => {
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw new Error('O nome de usuário já está em uso.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return { id: uuidv4(), username, password: hashedPassword, isAdmin };
};

// Lista todos os usuários
const listUsers = async (req, res) => {
  try {
    const users = await getUsers();
    const sanitizedUsers = users.map(({ password, ...user }) => user); 
    res.json(sanitizedUsers);
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

    const { password, ...sanitizedUser } = user; 
    res.json(sanitizedUser);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ message: 'Erro ao obter usuário.' });
  }
};

// Adiciona um novo usuário comum
const addUser = async (req, res) => {
  const { username, password, role, team } = req.body;
  try {
    // Verificar se o nome de usuário já existe
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'O nome de usuário já está em uso.' });
    }

    // Validação adicional
    if (!username || !password) {
      return res.status(400).json({ message: 'Os campos "username" e "password" são obrigatórios.' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      isAdmin: false,
      role: role || 'Sem cargo', 
      team: team || 'Sem equipe', 
    };

    const createdUser = await createUser(newUser);
    res.status(201).json({ message: 'Usuário criado com sucesso.', user: createdUser });
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    res.status(500).json({ message: 'Erro ao adicionar usuário.' });
  }
};


// Adiciona um novo administrador
const addAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Os campos "username" e "password" são obrigatórios.' });
    }

    const newAdmin = await createUserObject(username, password, true);
    const createdAdmin = await createUser(newAdmin);

    const { password: _, ...responseAdmin } = createdAdmin; 
    res.status(201).json({ message: 'Administrador criado com sucesso.', admin: responseAdmin });
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    res.status(500).json({ message: error.message || 'Erro ao criar administrador.' });
  }
};

// Atualiza os dados de um usuário
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role, team } = req.body;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Permitir que apenas o próprio usuário faça a alteração
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Você não tem permissão para alterar este usuário.' });
    }

    // Atualizar campos
    const updatedData = {
      username: username || user.username,
      password: password ? await bcrypt.hash(password, 10) : user.password,
      role: role || user.role, 
      team: team || user.team, 
    };

    const updatedUser = await updateUserInModel(id, updatedData);
    const { password: _, ...responseUser } = updatedUser; 
    res.json({ message: 'Usuário atualizado com sucesso.', user: responseUser });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
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

module.exports = { listUsers, getUser, addUser, addAdmin, updateUser, removeUser };
