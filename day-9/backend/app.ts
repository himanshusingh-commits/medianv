enum Orders{
    pending="pending",
    accepted="accepted",
    failed="failed"
}

interface school{
    readonly id:number
    name:string
    age:number
    address:string
    price?:number
    status:Orders
}

const mySchool:school[]=[{  
    id:102,
    name:"Rahul",
    age:20,
    address:"This is amnm ndress",
    price:32000.00,
    status:Orders.accepted},{
    id:101,
    name:"Himanshu",
    age:15,
    address:"This is adress",
    price:320.00,
    status:Orders.pending

}]
console.log(mySchool)

class student{

    private stud:school[]=[]
    addToSchool(studs:school){
        this.stud.push(studs)
        console.log(`${studs.name} added`)
    }
}
    console.log('student: ', student);

    const myStudent=new student()

      console.log('myStudent=: ', myStudent);

      class container<T>{
        private items:T[]=[]
        add(items:T){
            this.items.push(items)

        }
        getAll():T[]{
return this.items
        }
      }

const productBox = new container<school>();
mySchool.forEach(schoolItem => {
    productBox.add(schoolItem);
})
console.log('SchoolStudent: ',productBox)


function searchStudent(query:string):school | null{
   const foundStudent=mySchool.find(student=>student.name===query)
   
return foundStudent  || null

}
console.log('searchProduct result for "Rahul": ', searchStudent('Rahul'));

/*Output is 
[
  {
    id: 102,
    name: 'Rahul',
    age: 20,
    address: 'This is amnm ndress',
    price: 32000,
    status: 'accepted'
  },
  {
    id: 101,
    name: 'Himanshu',
    age: 15,
    address: 'This is adress',
    price: 320,
    status: 'pending'
  }
]
student:  [class student]
myStudent=:  student { stud: [] }
SchoolStudent:  container {
  items: [
    {
      id: 102,
      name: 'Rahul',
      age: 20,
      address: 'This is amnm ndress',
      price: 32000,
      status: 'accepted'
    },
    {
      id: 101,
      name: 'Himanshu',
      age: 15,
      address: 'This is adress',
      price: 320,
      status: 'pending'
    }
  ]
}
searchProduct result for "Rahul":  {
  id: 102,
  name: 'Rahul',
  age: 20,
  address: 'This is amnm ndress',
  price: 32000,
  status: 'accepted'
}*/