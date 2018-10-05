const ExpressHelper = require('../helpers/ExpressHelper');
const AuthenticationController = require('./AuthenticationController');

module.exports = class PegasusController {
  /**
   * constructor
   */
  constructor() {
    this.mandatoryEnvironmentVars = [
      'EXPRESS_PORT',
      'MONGODB_USERNAME',
      'MONGODB_PASSWORD',
      'MONGODB_HOST',
      'MONGODB_PORT',
      'MONGODB_DATABASE',
      'MONGODB_AUTH_DATABASE',
      'SALT_WORK_FACTOR',
    ];

    this.express = ExpressHelper.getInstance();
    this.authenticationController = new AuthenticationController(this.express);
  }

  /**
   * checkEnvironment - Checa as variáveis de ambiente da aplicação
   */
  checkEnvironment() {
    this.mandatoryEnvironmentVars.forEach((mandatoryEnvironmentVar) => {
      if (!process.env[mandatoryEnvironmentVar]) {
        throw new Error(`Missing ${mandatoryEnvironmentVar} environment var.`);
      }
    });
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
