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
      if (!expressInstance) {
        expressInstance = express();
        expressInstance.use(bodyParser.json());
        expressInstance.use(bodyParser.urlencoded({ extended: true }));
        expressInstance.use('/', express.static(`${__dirname}/../../public`));
        expressInstance.use(morgan('combined'));
      }

      return expressInstance;
    }
  };
})();
