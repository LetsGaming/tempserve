const { insertTemp, selectTemps } = require("../model/tempModel");
const { successResponse, errorResponse } = require("../utils/responseUtils");

const addTemp = (req, res) => {
  const userId = req.user.id;
  const { temperature } = req.body;
  try {
    if (!temperature) {
      return errorResponse(res, "Temperature is required", 404);
    }
    const parsedTemp = parseFloat(temperature);
    const [result] = insertTemp(userId, parsedTemp);
    successResponse(res, result.id, 201);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getTemps = async (req, res) => {
  try {
    const components = await selectTemps();
    successResponse(res, components);
  } catch (err) {
    errorResponse(res, err);
  }
};

module.exports = {
  addTemp,
  getTemps,
};
