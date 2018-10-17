const Sequelize = require('sequelize');

module.exports = (() => {
  let sequelizeInstance = null;

  return class SequelizeHelper {
    /**
     * @static getInstance - Singleton que retorna o objeto do Sequelize
     * configurado com as necessidades da aplicação.
     *
     * @returns {object} Instância
     */
    static getInstance() {
      if (!sequelizeInstance) {
        [
          'MYSQL_HOST',
          'MYSQL_PORT',
          'MYSQL_USERNAME',
          'MYSQL_PASSWORD',
          'MYSQL_DATABASE',
        ].forEach((mandatoryEnvironmentVar) => {
          if (!process.env[mandatoryEnvironmentVar]) {
            throw new Error(
              `Missing ${mandatoryEnvironmentVar} environment var.`,
            );
          }
        });

        sequelizeInstance = new Sequelize({
          dialect: 'mysql',
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT,
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,

          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },

          define: {
            underscored: true,
            freezeTableName: false,
            charset: 'utf8',
            dialectOptions: {
              collate: 'utf8_general_ci',
            },
            timestamps: true,
          },
        });
      }

      return sequelizeInstance;
    }
  };
})();
