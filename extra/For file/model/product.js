const fs = require('fs');
const path = require('path');
const RootDir = require('../util/path');
const p = path.join(RootDir, 'data', 'products.json');  

const Cart =require('./cart');

const getProductFromFile = cb => {
    fs.readFile(p, (err,fileContent) => {
        if(err){
           return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductFromFile( products => {
            if(this.id){
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {    
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });        
    }

    static deleteById (id) {
        getProductFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter( prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if(!err){
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductFromFile(cb);
    }

    static findById(id, cb) {
        getProductFromFile(products => {
            const product = products.find( p => p.id === id);
            cb(product);
        });
    }
};