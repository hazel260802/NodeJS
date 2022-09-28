const Sequelize = require('sequelize').Sequelize;
const sequelize = new Sequelize('master', 'sa', 'Trang26082k2', {
    dialect: 'mssql',
    host: 'localhost',
    dialectOptions: {
      // Observe the need for this nested `options` field for MSSQL
      options: {
        // Your tedious options here
        useUTC: false,
        dateFirst: 1
      }
    }
});
module.exports = sequelize;