const pool = require("../config/db");

const insertTemp = (tempClientId, temp) =>
  pool.query("INSERT INTO tempData (client_id, temperature) VALUES (?, ?)", [
    tempClientId,
    temp,
  ]);

const selectTemps = () => 
  pool.query("SELECT * FROM tempData");

module.exports = {
  insertTemp,
  selectTemps
};
