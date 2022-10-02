const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteById(prodId, userId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => {

        // update for one user case test
        // return db.collection('users').updateOne(
        //   { _id: new mongodb.ObjectId(userId) },
        //   {
        //     $pull: {
        //       'cart.items': { productId: new mongodb.ObjectId(prodId) },
        //     },
        //   }
        // );

        // update for many users case test
        return db
        .collection("users")
        .updateMany(
          {},
          { $pull: { "cart.items": { productId: new mongodb.ObjectId(prodId) } } }
        );
      })
      .then((result) => {
        console.log('Cart Item Deleted');
      })
      .then(() => {
        console.log('Product Deleted');
      });
  }
}

module.exports = Product;