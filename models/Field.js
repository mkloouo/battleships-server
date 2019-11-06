/**
 * MongoDB Field Model class
 */
export default class FieldModel {

  /**
   * Constructs FieldModel instance
   * @param {mongoose.Connection} connection mongoose connection
   */
  constructor(connection) {
    const props = {
      sessionId: { type: String, required: true },
      playerId: { type: String, required: true },
      state: { type: String }
    };

    const schema = new mongoose.Schema(props);

    this._Field = connection.model('Field', schema);
  }

  /**
   * Returns mongoose model
   * @returns {mongoose.Model} mongoose model
   */
  get Field() {
    return this._Field;
  }

}
