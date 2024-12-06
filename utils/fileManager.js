const fs = require('fs').promises;
const path = require('path');

// Função para ler dados de um arquivo JSON
const readData = async (fileName) => {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Arquivo não encontrado, retorna uma lista vazia
      return [];
    }
    throw error;
  }
};

// Função para escrever dados em um arquivo JSON
const writeData = async (fileName, data) => {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
};

module.exports = { readData, writeData };
