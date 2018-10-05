const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const MongooseHelper = require('../helpers/MongooseHelper');

// Captura a instância do Mongoose
const mongoose = MongooseHelper.getInstance();

/*
 * Define o schema com as propriedades, características e validações de cada uma
 * das propriedades.
 */
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    index: {
      unique: true,
    },
    trim: true,
    validate: {
      validator: email => /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      ),
      message: '{VALUE} is not a valid email!',
    },
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: (password) => {
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{12,}$/;

        return regexPassword.test(password) || password.startsWith('$2b$');
      },
      message: '{VALUE} is not a valid password!',
    },
  },

  token: {
    type: String,
  },
});

/*
 * Normaliza os campos do objeto que é retornado ao capturar o documento do
 * MongoDB. Remove o versionamento interno (__v) e a senha criptografada.
 */
schema.options.toObject = {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
  },
};

/*
 * Hook utilizado para gerar a versão criptografada da senha informada e um novo
 * token sempre que persistir no MongoDB.
 */
schema.pre('save', function preSave(next) {
  const user = this;

  // Gera um novo token
  user.token = uuidv4();

  // Gera um novo hash da senha se ela for alterada
  if (user.isModified('password')) {
    return bcrypt.hash(
      user.password,
      parseInt(process.env.SALT_WORK_FACTOR, 10),
      (error, hash) => {
        user.password = hash;

        next();
      },
    );
  }

  next();
});

/*
 * Método DE INSTÂNCIA que compara a senha do informada com a versão
 * criptografada no MongoDB. Só é disponibilizado no objeto do documento já
 * capturado.
 */
schema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

/*
 * Método ESTÁTICO que captura o usuário autenticado através do usuário e da
 * senha informada, persisti um novo token para ele e retorna o objeto completo
 */
schema.statics.getAuthenticated = function getAuthenticated(
  email,
  password,
  callback,
) {
  this.findOne({ email }, (error, user) => {
    if (error) {
      return callback(error);
    }

    user.comparePassword(password, (error, isMatch) => {
      if (error) {
        return callback(error);
      }

      if (isMatch) {
        const token = uuidv4();

        return user.set({ token }).save((error, updatedUser) => {
          if (error) {
            return callback(error);
          }

          callback(null, updatedUser);
        });
      }
    });
  });
};

// Exporta o model
module.exports = mongoose.model('User', schema);
