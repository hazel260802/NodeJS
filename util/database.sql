DROP TABLE products;
CREATE TABLE products(
    id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    description TEXT NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    CONSTRAINT id_product UNIQUE (id)
);

INSERT INTO products(title, price, description, imageUrl) VALUES ('A Book','19','This is an awesome book!',
'https://www.publicdomainpictures.net/pictures/10000/velka/1-1210009435EGmE.jpg');

INSERT INTO products(title, price, description, imageUrl) VALUES ('Book 2','20','Amazing one!',
'https://www.publicdomainpictures.net/pictures/10000/velka/1-1210009435EGmE.jpg');

DELETE FROM products where id = 4;

SELECT * FROM products;

CREATE TABLE cart(
    id INT NOT NULL PRIMARY KEY,
    quantity INT NOT NULL, 
    totalPrice FLOAT CHECK(totalPrice>=0),
    CONSTRAINT FK_PersonCart FOREIGN KEY(id)
    REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);
-------------------- CART FUNCTION -------------------------------------------
DROP TRIGGER deleteProductonCart
GO
CREATE TRIGGER deleteProductonCart
ON cart AFTER DELETE
AS
    DECLARE @id DECIMAL(10,2)
    SELECT @id = id FROM deleted
    IF NOT EXISTS(
    SELECT id FROM cart
    WHERE cart.id = @id
    )
    BEGIN
        PRINT 'Product is not existed'
        ROLLBACK
    END
    ELSE
        BEGIN
            PRINT 'Product has been deleted'
            DELETE FROM cart WHERE id = @id
        END 
----------------------Add product to cart---------------------------------
DROP TRIGGER addToCart

GO
CREATE TRIGGER addToCart
ON cart
AFTER INSERT
AS
DECLARE @id INT, @price FLOAT, @totalPrice FLOAT
SELECT @id = id FROM inserted
SELECT @price = price FROM products
WHERE products.id = @id

IF EXISTS(
  SELECT cart.id FROM cart, products
  WHERE cart.id = @id AND cart.id = products.id
)
BEGIN
	UPDATE cart
	SET quantity = quantity + 1
	WHERE id = @id 
	PRINT 'The product data has been updated'
END
ELSE
BEGIN
	PRINT 'The product data has been added'
	INSERT INTO cart(id, quantity)
	VALUES (@id, 1)
END
SELECT @totalPrice = (
    SELECT cart.quantity* products.price as TOTAL FROM cart, products 
    WHERE cart.id=products.id
)
UPDATE cart
SET totalPrice = @totalPrice
WHERE id = @id

SELECT * FROM cart
-------------------- PRODUCT FUNCTION -------------------------------------------
----------------------Update price ----------------------------------------------
DROP TRIGGER upadatePrice
GO
CREATE TRIGGER updatePrice 
ON products
FOR UPDATE
AS 
    DECLARE @oldprice decimal(10,2),@newprice decimal(10,2)
    SELECT @oldprice = price FROM deleted
    PRINT'Old price ='
    PRINT CONVERT(varchar(6),@oldprice)
    SELECT @newprice = price FROM inserted
    PRINT'New price ='PRINT CONVERT(varchar(6),@newprice)
    IF(@newprice > (@oldprice*1.10))
        BEGIN
        PRINT'New price increased over 10%, not update'
        ROLLBACK
        END
        ELSE
        PRINT'New price is accepted'
-----------------------Delete function-----------------------------------------------
--Xóa Sách------------------------------

DROP TRIGGER deleteProduct
GO
CREATE TRIGGER deleteProduct
ON products
INSTEAD OF DELETE
AS
DECLARE @id varchar(20)
SELECT @id = id FROM deleted
IF NOT EXISTS(
  SELECT id FROM products
  WHERE products.id = @id
)
BEGIN
	PRINT 'Book is not existed'
	ROLLBACK
END
ELSE 
BEGIN
	PRINT 'Book has been deleted'
	DELETE FROM products WHERE id = @id
END