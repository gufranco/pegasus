const mysql = require('mysql2');

module.exports = (() => {
  let mysqlInstance = null;

  return class MySQLHelper {
    /**
     * @static getInstance - Singleton que retorna o objeto do MySQL
     * configurado com as necessidades da aplicação.
     *
     * @returns {object} Instância
     */
    static getInstance() {
      if (!mysqlInstance) {
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

        mysqlInstance = mysql.createPool({
          connectionLimit: 10,
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT, 10),
          user: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
        });
      }

      return mysqlInstance;
    }
  };
})();
