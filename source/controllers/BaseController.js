const UserModel = require('../models/UserModel');

module.exports = class BaseController {
  /**
   * authenticate - Método utilizado para autenticar as rotas que precisam de
   * controle de acesso por login.
   *
   * @param {object} request  Objeto da requisição recebida
   * @param {object} response Objeto do retorno da requisição
   * @param {function} next Método usado para chamar a próxima rota encontrada
   */
  authenticate(request, response, next) {
    const token = request.get('X-Auth-Token');

    if (!token) {
      return response.status(400).json(['Missing X-Auth-Token header']);
    }

    UserModel.findOne({ token })
      .then((user) => {
        if (user) {
          return next();
        }

        response.status(401).json(['Missing a valid X-Auth-Token header']);
      })
      .catch(error => console.error(error));
  }
};
