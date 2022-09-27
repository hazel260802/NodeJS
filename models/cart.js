const config = require('../util/database');
const sql = require('mssql');

module.exports = class Cart{
  constructor(id,quantity, totalPrice) {
      this.id=id;
      this.quantity=quantity;
      this.totalPrice=totalPrice;
  }

  async addProduct() {
    try{
      let pool = await sql.connect(config);
      const sqlString = "INSERT INTO cart(id) VALUES (@id)"
      let res = await pool.request()
      .input('id', sql.Int, this.id)
      .query(sqlString);
      return res.recordsets;
    } 
    catch (error){
        console.log(" mathus-error :" + error);
    }
  }

  static async deleteProduct(id) {
    try{
        let pool = await sql.connect(config);
        const sqlString = "DELETE FROM cart WHERE id=@id"
        let res = await pool.request()
        .input('id', sql.Int, id)
        .query(sqlString);
        return res.recordsets;
    } catch (error){
        console.log(" mathus-error :" + error);
    }
  }
  static async getCart(){
    try{
        let pool = await sql.connect(config);
        const sqlString = "SELECT * FROM cart"
        let res = await pool.request()
        .query(sqlString);
        return res.recordsets;
    } catch (error){
        console.log(" mathus-error :" + error);
    }
}
};
