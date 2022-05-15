const { ObjectId } = require("mongoose").Types;
const { name } = require("./model");
const { dynamicSearch } = require("../../core/repository");

const getQuery = (payload) => {
  const createdBySubQuery = { createdBy: ObjectId(payload.userId) };

  let query = createdBySubQuery;
  if (payload.text) {
    query = {
      $and: [
        createdBySubQuery,
        {
          $or: [
            { number: { $regex: payload.text, $options: "i" } },
            { alias: { $regex: payload.text, $options: "i" } },
          ],
        },
      ],
    };
  }
  return query;
};

const checkIfPhoneExists = async (payload) => {
  const { createdBy } = payload;
  const result = await dynamicSearch({ createdBy }, name);
  return result.length > 0;
};

module.exports = {
  getQuery,
  modelName: name,
  checkIfPhoneExists,
};
