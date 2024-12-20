const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'data', 'logs', 'errors.log');

const logError = (error) => {
  const logMessage = `${new Date().toISOString()} - ${error}\n`;
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Erro ao salvar log:', err);
  });
};

module.exports = { logError };
