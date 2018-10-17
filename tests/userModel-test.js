const assert = require("assert");
const UserModel = require("../source/models/UserModel");

/*
 * Finaliza o processo após a execução de todos os testes para que não fique
 * pendente devido a conexão com o MongoDB
 */
after(() => {
  process.exit();
});

describe("userModel", () => {
  describe("name", () => {
    it("should pass if not blank", () => {
      const userModel = new UserModel({
        name: "Gustavo Franco",
        email: "gustavocfranco@gmail.com",
        password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
      });

      const actual = userModel.validateSync();
      const expected = undefined;

      assert.deepStrictEqual(actual, expected);
    });

    it("should return an error message if blank", () => {
      const userModel = new UserModel({
        name: "",
        email: "gustavocfranco@gmail.com",
        password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
      });

      const actual = userModel.validateSync();
      const expected = "Name is required";

      assert.deepStrictEqual(actual.errors.name.message, expected);
    });
  });

  describe("email", () => {
    it("should pass if valid", () => {
      const userModel = new UserModel({
        name: "Gustavo Franco",
        email: "gustavocfranco@gmail.com",
        password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
      });

      const actual = userModel.validateSync();
      const expected = undefined;

      assert.deepStrictEqual(actual, expected);
    });

    it("should return an error message if blank", () => {
      const userModel = new UserModel({
        name: "Gustavo Franco",
        email: "",
        password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
      });

      const actual = userModel.validateSync();
      const expected = "Email is required";

      assert.deepStrictEqual(actual.errors.email.message, expected);
    });

    it("should return an error message if invalid", () => {
      const userModel = new UserModel({
        name: "Gustavo Franco",
        email: "gustavocfranco@invalid",
        password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
      });

      const actual = userModel.validateSync();
      const expected = "gustavocfranco@invalid is not a valid email!";

      assert.deepStrictEqual(actual.errors.email.message, expected);
    });
  });

  describe("password", () => {
    it("should pass if valid", () => {
      const userModel = new UserModel({
        name: "Gustavo Franco",
        email: "gustavocfranco@gmail.com",
        password: "XzOL39n8WN7bnemRaIcfR7a3sId3fEgx"
      });

      const actual = userModel.validateSync();
      const expected = undefined;

      assert.deepStrictEqual(actual, expected);
    });

    it("should return an error message if blank", () => {
      const userModel = new UserModel({
        name: "Gustavo Franco",
        email: "gustavocfranco@gmail.com",
        password: ""
      });

      const actual = userModel.validateSync();
      const expected = "Password is required";

      assert.deepStrictEqual(actual.errors.password.message, expected);
    });

    it("should return an error message if invalid", () => {
      const userModel = new UserModel({
        name: "Gustavo Franco",
        email: "gustavocfranco@gmail.com",
        password: "password123"
      });

      const actual = userModel.validateSync();
      const expected = "password123 is not a valid password!";

      assert.deepStrictEqual(actual.errors.password.message, expected);
    });
  });
});
