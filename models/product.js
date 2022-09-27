const config = require('../util/database');
const sql = require('mssql');


module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }


  async AddProduct() {
    try{
        let pool = await sql.connect(config);
        const sqlString = "INSERT INTO products (title, price, imageUrl, description) VALUES (@title,@price,@imageUrl,@description)"
        let res = await pool.request()
        .input('title', sql.VarChar, this.title)
        .input('price', sql.VarChar, this.price)
        .input('imageUrl', sql.VarChar, this.imageUrl)
        .input('description', sql.VarChar, this.description)
        .query(sqlString);
        return res.recordsets;
    } catch (error){
        console.log(" mathus-error :" + error);
    }
}
  static async DeleteProduct(id) {
    try{
        let pool = await sql.connect(config);
        const sqlString = "DELETE FROM products WHERE products.id=@id"
        let res = await pool.request()
        .input('id', sql.Int, id)
        .query(sqlString);
        return res.recordsets;
    } catch (error){
        console.log(" mathus-error :" + error);
    }
}
  static async fetchAll() {
    try{
        let pool = await sql.connect(config);
        const sqlString = "SELECT * FROM products"
        let res = await pool.request()
        .query(sqlString);
        return res.recordsets;
    } catch (error){
        console.log(" mathus-error :" + error);
    }
}

  static async findById(id) {
    try{
        let pool = await sql.connect(config);
        const sqlString = "SELECT * FROM products WHERE products.id = @id"
        let res = await pool.request()
        .input('id', sql.Int, id)
        .query(sqlString);
        return res.recordsets;
    } catch (error){
        console.log(" mathus-error :" + error);
    }
}
};
