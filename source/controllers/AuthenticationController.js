const BaseController = require('./BaseController');
const UserModel = require('../models/UserModel');

module.exports = class AuthenticationController extends BaseController {
  /**
   * constructor
   *
   * @param {object} express  Instância do Express
   */
  constructor(express) {
    super();

    if (express) {
      this.express = express;
      this.applyRoutes();
    }
  }

  /**
   * applyRoutes - Adiciona as rotas HTTP
   */
  applyRoutes() {
    // Rotas públicas
    this.express.post(
      '/api/authentication/sign_in',
      (request, response, next) => this.signin(request, response, next),
    );
    this.express.post(
      '/api/authentication/sign_up',
      (request, response, next) => this.signup(request, response, next),
    );

    // Rotas privadas
    // this.express.get('/api/authentication/sign_off', (request, response, next) => this.authenticate(request, response, next), (request, response, next) => this.signoff(request, response, next));
  }

  /**
   * signin - Efetua a autenticação de usuário
   *
   * @param {object} request  Objeto da requisição recebida
   * @param {object} response Objeto do retorno da requisição
   * @param {function} next Método usado para chamar a próxima rota encontrada
   */
  signin(request, response, next) {
    const { email, password } = request.body;

    UserModel.getAuthenticated(email, password, (error, user) => {
      if (error) {
        return response.status(400).json(error);
      }

      response.json(user);
    });
  }

  /**
   * signup - Efetua o cadastro de usuário
   *
   * @param {object} request  Objeto da requisição recebida
   * @param {object} response Objeto do retorno da requisição
   * @param {function} next Método usado para chamar a próxima rota encontrada
   */
  signup(request, response, next) {
    const user = new UserModel(request.body);
    user
      .save()
      .then(user => response.json(user))
      .catch((error) => {
        const messages = Object.values(error.errors).map(
          error => error.message,
        );

        response.status(400).json(messages);
      });
  }
};
