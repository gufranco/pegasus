const AWS = require('aws-sdk');
const fs = require('fs');

module.exports = (() => {
  let s3Instance = null;

  return class S3Helper {
    /**
     * @static getInstance - Singleton que retorna o objeto de acesso ao S3
     * configurado com as necessidades da aplicação.
     *
     * @returns {object} Instância
     */
    static getInstance() {
      if (!s3Instance) {
        [
          'AWS_ACCESS_KEY_ID',
          'AWS_SECRET_ACCESS_KEY',
          'AWS_REGION',
          'AWS_S3_BUCKET',
        ].forEach((mandatoryEnvironmentVar) => {
          if (!process.env[mandatoryEnvironmentVar]) {
            throw new Error(
              `Missing ${mandatoryEnvironmentVar} environment var.`,
            );
          }
        });

        s3Instance = new AWS.S3({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          region: process.env.AWS_REGION,
          params: {
            Bucket: process.env.AWS_S3_BUCKET,
          },
        });
      }

      return s3Instance;
    }

    /**
     * uploadFile - Efetua o upload do arquivo para o S3 e, ao terminar, apaga o
     * mesmo.
     *
     * @param {string} origin Caminho do arquivo que será enviado
     * @param {string} destination Caminho do arquivo que será persistido
     * @param {string} callback Método que receberá o retorno
     */
    static uploadFile(origin, destination, callback) {
      fs.readFile(origin, (error, content) => {
        if (error) {
          return callback(`Error reading ${origin}`);
        }

        this.getInstance().upload(
          {
            Key: destination,
            Body: Buffer.from(content, 'binary'),
            ACL: 'public-read',
          },
          (error, result) => {
            if (error) {
              return callback(`Error sending ${origin} to ${destination}`);
            }

            fs.unlink(origin, (error) => {
              if (error) {
                console.error(error);
              }
            });

            callback(
              null,
              `https://s3.${process.env.AWS_REGION}.amazonaws.com/${
                process.env.AWS_S3_BUCKET
              }/${destination}`,
            );
          },
        );
      });
    }
  };
})();
