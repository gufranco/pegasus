const ExpressHelper = require("../helpers/ExpressHelper");
const AuthenticationController = require("./AuthenticationController");

module.exports = class PegasusController {
  /**
   * constructor
   */
  constructor() {
    this.express = ExpressHelper.getInstance();
    this.authenticationController = new AuthenticationController(this.express);
  }

  /**
   * run - Inicializa a aplicação
   *
   * @param {function} callback Método executado após inicializar a aplicação
   */
  run(callback) {
    this.express.listen(parseInt(process.env.EXPRESS_PORT, 10), callback);
  }
};
