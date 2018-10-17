const assert = require("assert");
const { spawn } = require("child_process");
const axios = require("axios");

/*
 * Inicializa a aplicação em ambiente, considerando o ambiente como
 * desenvolvimento, em um processo filho do teste. Todas as variáveis de
 * ambiente são repassadas para a aplicação.
 */
let application = null;
before(done => {
  application = spawn("node", ["app.js"], { env: process.env });

  /*
   * Monitora o stdout da aplicação para garantir que foi inicializada corretamente
   * para que os testes possam começar a serem executados.
   */
  application.stdout.on("data", data => {
    const message = data.toString().trim();

    if (message === "Pegasus is up and running!") {
      done();
    }
  });

  /*
   * Monitora o stderr da aplicação para exibir todo erro que for capturado, fechar
   * o teste, matar o processo filho e sair com status 1.
   */
  application.stderr.on("data", data => {
    const message = data.toString().trim();
    console.error(message);

    application.kill();
    process.exit(1);
  });
});

/*
 * Finaliza o processo após a execução de todos os testes para que não fique
 * pendente devido a conexão com o MongoDB
 */
after(() => {
  application.kill();
  process.exit();
});

describe("API", () => {
  describe("POST /api/authentication/sign_up", () => {
    it("should return the created user and status 200 if everything is valid", done => {
      axios({
        method: "POST",
        url: `http://localhost:${
          process.env.EXPRESS_PORT
        }/api/authentication/sign_up`,
        data: {
          name: "Gustavo Franco",
          email: "gustavocfranco@gmail.com",
          password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
        }
      }).then(response => {
        const actual = response.data;

        // Valida status HTTP e propriedades que variam de valor
        assert.deepStrictEqual(response.status, 200);
        assert.deepStrictEqual(actual._id.length, 24);
        assert.deepStrictEqual(actual.token.length, 36);

        // Valida o retorno sem as propriedades que variam de valor
        delete actual._id;
        delete actual.token;
        delete actual.password;
        delete actual.__v;
        assert.deepStrictEqual(actual, {
          name: "Gustavo Franco",
          email: "gustavocfranco@gmail.com"
        });
        done();
      });
    });

    it("should return error messages and status 400 if everything is missing", done => {
      axios({
        method: "POST",
        url: `http://localhost:${
          process.env.EXPRESS_PORT
        }/api/authentication/sign_up`
      }).catch(error => {
        const expected = [
          "Password is required",
          "Email is required",
          "Name is required"
        ];

        assert.deepStrictEqual(error.response.status, 400);
        assert.deepStrictEqual(error.response.data, expected);
        done();
      });
    });

    it("should return error message and status 400 if name is missing", done => {
      axios({
        method: "POST",
        url: `http://localhost:${
          process.env.EXPRESS_PORT
        }/api/authentication/sign_up`,
        data: {
          name: "",
          email: "gustavocfranco@gmail.com",
          password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
        }
      }).catch(error => {
        const expected = ["Name is required"];

        assert.deepStrictEqual(error.response.status, 400);
        assert.deepStrictEqual(error.response.data, expected);
        done();
      });
    });

    it("should return error message and status 400 if email is missing", done => {
      axios({
        method: "POST",
        url: `http://localhost:${
          process.env.EXPRESS_PORT
        }/api/authentication/sign_up`,
        data: {
          name: "Gustavo Franco",
          email: "",
          password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
        }
      }).catch(error => {
        const expected = ["Email is required"];

        assert.deepStrictEqual(error.response.status, 400);
        assert.deepStrictEqual(error.response.data, expected);
        done();
      });
    });

    it("should return error message and status 400 if password is missing", done => {
      axios({
        method: "POST",
        url: `http://localhost:${
          process.env.EXPRESS_PORT
        }/api/authentication/sign_up`,
        data: {
          name: "Gustavo Franco",
          email: "gustavocfranco@gmail.com",
          password: ""
        }
      }).catch(error => {
        const expected = ["Password is required"];

        assert.deepStrictEqual(error.response.status, 400);
        assert.deepStrictEqual(error.response.data, expected);
        done();
      });
    });

    it("should return error message and status 400 if email is invalid", done => {
      axios({
        method: "POST",
        url: `http://localhost:${
          process.env.EXPRESS_PORT
        }/api/authentication/sign_up`,
        data: {
          name: "Gustavo Franco",
          email: "invalid@email",
          password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
        }
      }).catch(error => {
        const expected = ["invalid@email is not a valid email!"];

        assert.deepStrictEqual(error.response.status, 400);
        assert.deepStrictEqual(error.response.data, expected);
        done();
      });
    });

    it("should return error message and status 400 if password is invalid", done => {
      axios({
        method: "POST",
        url: `http://localhost:${
          process.env.EXPRESS_PORT
        }/api/authentication/sign_up`,
        data: {
          name: "Gustavo Franco",
          email: "gustavocfranco@gmail.com",
          password: "senha123"
        }
      }).catch(error => {
        const expected = ["senha123 is not a valid password!"];

        assert.deepStrictEqual(error.response.status, 400);
        assert.deepStrictEqual(error.response.data, expected);
        done();
      });
    });
  });
});
