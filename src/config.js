const dotenv = require('dotenv')

dotenv.config()

const { NODE_ENV, PORT, SECRET_KEY, SECRET_IV, ECNRYPTION_METHOD } = process.env

module.exports = {
  env: NODE_ENV,
  port: PORT,
  secret_key: SECRET_KEY,
  secret_iv: SECRET_IV,
  ecnryption_method: ECNRYPTION_METHOD,
}