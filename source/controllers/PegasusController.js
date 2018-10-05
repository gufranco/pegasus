const ExpressHelper = require('../helpers/ExpressHelper');
const AuthenticationController = require('./AuthenticationController');

module.exports = class PegasusController {
  /**
   * constructor
   */
  constructor() {
    this.express = ExpressHelper.getInstance();
    this.authenticationController = new AuthenticationController(this.express);
  }

  /**
   * checkEnvironment - Checa as variáveis de ambiente da aplicação
   */
  checkEnvironment() {
    if (!process.env.EXPRESS_PORT) {
      throw new Error('Missing EXPRESS_PORT environment var.');
    }

    if (!process.env.MONGODB_USERNAME) {
      throw new Error('Missing MONGODB_USERNAME environment var.');
    }

    if (!process.env.MONGODB_PASSWORD) {
      throw new Error('Missing MONGODB_PASSWORD environment var.');
    }

    if (!process.env.MONGODB_HOST) {
      throw new Error('Missing MONGODB_HOST environment var.');
    }

    if (!process.env.MONGODB_PORT) {
      throw new Error('Missing MONGODB_PORT environment var.');
    }

    if (!process.env.MONGODB_DATABASE) {
      throw new Error('Missing MONGODB_DATABASE environment var.');
    }

    if (!process.env.MONGODB_AUTH_DATABASE) {
      throw new Error('Missing MONGODB_AUTH_DATABASE environment var.');
    }

    if (!process.env.SALT_WORK_FACTOR) {
      throw new Error('Missing SALT_WORK_FACTOR environment var.');
    }
  }

  /**
  * run - Inicializa a aplicação
   *
   * @param {function} callback Método executado após inicializar a aplicação
   */
  run(callback) {
    this.checkEnvironment();
    this.express.listen(process.env.EXPRESS_PORT, callback);
  }
};
