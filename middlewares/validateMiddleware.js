const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Executa todas as validações fornecidas
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //  próximo middleware 
    next();
  };
};

// Validação de status
const validateStatus = (allowedStatuses) => {
  return (req, res, next) => {
    const { status } = req.body;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status inválido. Status permitido: ${allowedStatuses.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = { validate, validateStatus };