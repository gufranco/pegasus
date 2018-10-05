require('pretty-error').start();
const PegasusController = require('./source/controllers/PegasusController');

const pegasusController = new PegasusController();
pegasusController.run(() => {
  console.log('Pegasus is up and running!');
});
