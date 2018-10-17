const fs = require("fs");
const path = require("path");
const os = require("os");
const uuid = require("uuid/v4");
const axios = require("axios");

module.exports = class DownloadHelper {
  /**
   * download - Efetua o download do arquivo informado na URL e persiste no
   * diretório temporário padrão do sistema operacional.
   *
   * @param {string} url URL do arquivo
   * @param {function} callback Callback de retorno
   */
  static download(url, callback) {
    const filePath = path.join(os.tmpdir(), `${uuid()}.pdf`);

    axios({
      method: "GET",
      url,
      responseType: "stream"
    })
      .then(response => {
        response.data.pipe(fs.createWriteStream(filePath));
        response.data.on("end", () => callback(null, filePath));
        response.data.on("error", () =>
          callback(
            null,
            `Error downloading ${url} and trying to save to ${filePath}`
          )
        );
      })
      .catch(error => callback(error));
  }
};
