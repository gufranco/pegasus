const mongoose = require('mongoose');

module.exports = (() => {
  let mongooseInstance = null;

  return class MongooseHelper {
    /**
     * @static getInstance - Singleton que retorna o objeto do Mongoose
     * configurado com as necessidades da aplicação.
     *
     * @returns {object} Instância
     */
    static getInstance() {
      if (!mongooseInstance) {
        [
          'MONGODB_USERNAME',
          'MONGODB_PASSWORD',
          'MONGODB_HOST',
          'MONGODB_PORT',
          'MONGODB_DATABASE',
          'MONGODB_AUTH_DATABASE',
        ].forEach((mandatoryEnvironmentVar) => {
          if (!process.env[mandatoryEnvironmentVar]) {
            throw new Error(
              `Missing ${mandatoryEnvironmentVar} environment var.`,
            );
          }
        });

        // Carregamento da instância do Mongoose para o escopo do Singleton
        mongooseInstance = mongoose;

        // Efetua conexão ao MongoDB
        const uri = `mongodb://${process.env.MONGODB_USERNAME}:${
          process.env.MONGODB_PASSWORD
        }@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${
          process.env.MONGODB_DATABASE
        }?authSource=${process.env.MONGODB_AUTH_DATABASE}`;

        const options = {
          autoIndex: false,
          bufferMaxEntries: 0,
          poolSize: 10,
          reconnectInterval: 500,
          reconnectTries: Number.MAX_VALUE,
          useNewUrlParser: true,
        };

        // Configura como notificar os eventos
        mongooseInstance.connection.once('open', () => {
          mongooseInstance.connection.on('error', (error) => {
            console.error(`MongoDB event error: ${error}`);
          });

          process.on('SIGINT', () => {
            mongooseInstance.connection.close(() => process.exit(0));
          });
        });

        // Inicializa a conexão ao MongoDB e trata o evento de desconexão
        mongooseInstance.connect(
          uri,
          options,
          (error) => {
            if (error) {
              console.error(`Failed to connect to MongoDB: ${error}`);

              process.exit(1);
            }
          },
        );
      }

      return mongooseInstance;
    }
  };
})();
