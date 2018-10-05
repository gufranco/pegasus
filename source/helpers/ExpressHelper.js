const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = (() => {
  let expressInstance = null;

  return class ExpressHelper {
    /**
     * @static getInstance - Singleton que retorna o objeto do Express
     * configurado com as necessidades da aplicação.
     *
     * @returns {object} Instância do Express
     */
    static getInstance() {
      if (expressInstance) {
        return expressInstance;
      }

      // Inicializa o Express.js
      expressInstance = express();

      // Configura body-parser
      expressInstance.use(bodyParser.json());
      expressInstance.use(bodyParser.urlencoded({ extended: true }));

      // Configura o acesso de arquivos estáticos
      expressInstance.use('/', express.static(`${__dirname}/../../public`));

      // Configura log de requisições HTTP em formato Apache
      expressInstance.use(morgan('combined'));

      return expressInstance;
    }
  };
})();
