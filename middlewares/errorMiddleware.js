const { logError } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const errorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const errorMessage = `[Error ID: ${errorId}] ${err.message || 'Internal Server Error'}`;
  console.error(errorMessage);
  logError(`${errorMessage}\nStack: ${err.stack}`);
  res.status(err.status || 500).json({ errorId, message: err.message || 'Erro interno do servidor.' });
};

module.exports = errorHandler;
