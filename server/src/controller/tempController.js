const { insertTemp, selectTemps } = require("../model/tempModel");
const { successResponse, errorResponse } = require("../utils/responseUtils");

const addTemp = (req, res) => {
  const userId = req.user.id;
  const { temperature } = req.body;
  try {
    if (!temperature) {
      res.status(404);
    }

    const [result] = insertTemp(userId, temperature);
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
