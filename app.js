require('pretty-error').start();
require('dotenv').config();
const PegasusController = require('./source/controllers/PegasusController');

const pegasusController = new PegasusController();
pegasusController.run(() => console.log('Pegasus is up and running!'));
