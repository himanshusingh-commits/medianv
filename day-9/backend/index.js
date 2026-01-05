"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let name = "Himanshu";
console.log('name: ', name);
let age = 32;
console.log('age: ', age);
let address = "Testing address";
console.log('ddress: ', address);
let price = 32.33;
console.log('price: ', price);
const mySchool = {
    id: 101,
    name: "Spring field",
    age: 32,
    address: "there is main street",
    price: 15000
};
mySchool.name = "Himanshu";
console.log(mySchool);
let product = ["electronics", "mobile", "phones"];
console.log('product: ', product);
var order;
(function (order) {
    order["pending"] = "pending";
    order["accept"] = "accept";
    order["failed"] = "failed";
})(order || (order = {}));
const mobile = {
    id: 102,
    name: "Mobile",
    price: 22000,
    description: "THis is mobile is best "
};
console.log(order.pending);
console.log(mobile);
class shopping {
    items = [];
    addToCart(item) {
        this.items.push(item);
        console.log(`${item.name} added`);
    }
}
console.log('shopping: ', shopping);
const myCart = new shopping();
myCart.addToCart(mobile);
console.log('myCart:', myCart);
class Container {
    items = [];
    add(items) {
        this.items.push(items);
    }
    getAll() {
        return this.items;
    }
}
const productBox = new Container();
/*class Animal{
  name:string;
  constructor(name:string){
    this.name=name;
  }
  move(distance:number=0):void{
    console.log(`${this.name} moved ${distance}m.`)
  }
}
class Dog extends Animal{
  bark(): void{
console.log('Woof! Woof!')
  }
}

const myDog= new Dog("Buddy")
myDog.bark()
myDog.move(10)*/
productBox.add(mobile);
console.log('productBox : ', productBox);
function searchProduct(query) {
    if (query === 'mobile')
        return mobile;
    return "Product not found";
}
console.log('searchProduct: ', searchProduct);
console.log('searchProduct result for "mobile": ', searchProduct('mobile'));
class Animal {
    name;
    constructor(name) {
        this.name = name;
    }
    move(distance = 0) {
        console.log(`${this.name} moved ${distance}m.`);
    }
}
class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}
const myDog = new Dog("Buddy");
myDog.bark();
console.log('myDog.bark(): ', myDog.bark());
myDog.move(10);
console.log('myDog.move(10): ', myDog.move(10));
/*name:  Himanshu
age:  32
ddress:  Testing address
price:  32.33
{
  id: 101,
  name: 'Himanshu',
  age: 32,
  address: 'there is main street',
  price: 15000
}
product:  [ 'electronics', 'mobile', 'phones' ]
pending
{
  id: 102,
  name: 'Mobile',
  price: 22000,
  description: 'THis is mobile is best '
}
shopping:  [class shopping]
Mobile added
myCart: shopping {
  items: [
    {
      id: 102,
      name: 'Mobile',
      price: 22000,
      description: 'THis is mobile is best '
    }
  ]
}
productBox :  Container {
  items: [
    {
      id: 102,
      name: 'Mobile',
      price: 22000,
      description: 'THis is mobile is best '
    }
  ]
}
searchProduct:  [Function: searchProduct]
searchProduct result for "mobile":  {
  id: 102,
  name: 'Mobile',
  price: 22000,
  description: 'THis is mobile is best '
}*/ 
//# sourceMappingURL=index.js.map