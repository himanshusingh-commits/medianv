let name:string = "Himanshu"
console.log('name: ', name);
let age:number=32
console.log('age: ', age);
let address:string="Testing address"
console.log('ddress: ', address);
let price:number=32.33
console.log('price: ', price);

interface school{
    readonly id:number
    name:string
    age:number
    address:string
    price?:number
}
 const mySchool:school={
    id:101,
    name:"Spring field",
    age:32,
    address:"there is main street",
    price:15000
 }
 mySchool.name="Himanshu"
console.log(mySchool)
let product:string[] = ["electronics","mobile","phones"]
console.log('product: ', product);
enum order{
    pending ="pending",
    accept="accept",
    failed="failed"

}

interface Product{
    readonly id:number
    name:string
    price:number
    description:string
    getDiscountPrice?:(percent:number)=>number


}

 const mobile:Product={
    id:102,
    name:"Mobile",
    price:22000,
    description:"THis is mobile is best "
 }

console.log(order.pending)

console.log(mobile)
class shopping{

    private items:Product[]=[]
    addToCart(item:Product){
        this.items.push(item)
        console.log(`${item.name} added`)
    }

}
    console.log('shopping: ', shopping);

const myCart= new shopping()

myCart.addToCart(mobile);
console.log('myCart:' , myCart);

class Container<T>{
    private items:T[]=[]
    add(items:T){
        this.items.push(items)
    }
    getAll():T[]{
        return this.items
    }
}

const productBox = new Container<Product>(); 
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
console.log('productBox : ', productBox );
function searchProduct(query:string):Product | string {
    
    if(query==='mobile') return mobile;
    return "Product not found"
}

console.log('searchProduct: ', searchProduct);
console.log('searchProduct result for "mobile": ', searchProduct('mobile'));


class Animal{
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
console.log('myDog.bark(): ', myDog.bark());
myDog.move(10)
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