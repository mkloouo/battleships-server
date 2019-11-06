const mongoose = require('mongoose');

/**
 * MongoDB Session Model class
 */
class SessionModel {

  /**
   * Constructs SessionModel instance
   * @param {mongoose.Connection} connection mongoose connection
   */
  constructor(connection) {
    const props = {
      _id: { type: String, required: true },
      playerOneId: { type: String },
      playerTwoId: { type: String },
      password: { type: String }
    };

    const schema = new mongoose.Schema(props);

    this._Session = connection.model('Session', schema);
  }

  /**
   * Returns mongoose model
   * @returns {mongoose.Model} mongoose model
   */
  get Session() {
    return this._Session;
  }

}

module.exports = SessionModel;
