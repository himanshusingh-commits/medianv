import express from 'express' 
import emailValidator from 'deep-email-validator'
const app = express()

const PORT = 3000
app.use(express.json())

const user = [{id:1,name:"Rahul",email:"rahul@gmail.com",phone:1234567809},{id:2,name:"Rakesh",email:"rakesh@gmail.com",phone:1023456789},{id:3,name:"John",email:'john@gmail.com',phone:1234567890}]
app.post('/user',async(req,res)=>{
try{
    const {id,name,phone,email} = req.body
    console.log(phone.length)
    const userId= Number(req.params.id)
    const userIndex= user.findIndex(u=>u.id===userId)
     console.log('userIndex: ', userIndex);
if(userIndex>-1){
    return res.status(401).json({message:'user is already found'})
}
if(!emailValidator.validate(email)){
    console.log("Email is not verified")
}

if(  String(phone).length!=10){
   return res.status(401).json({message:"phone is not in 10 digit"})
}
 
const users = {
    id,name,phone:Number(phone),email
}
    user.push(users)
    console.log("User api is running correctly")
    res.status(201).json({message:'UserPost is running',users})
}catch{
  return res.status(401).json({message:"there is some in posting"})
}
})

app.get('/user',(req,res)=>{
    try{
        console.log("useGet is running perfectly",user)
        res.status(200).json({message:"user is getting",user})
    }catch{
        return res.status(201).json({message:"Get is working",user})
    }
})

app.delete('/user/:id',(req,res)=>{
    const userId = Number(req.params.id)
    const userIndex = user.findIndex(u=>u.id===userId)
    
    const delted= user.splice(userIndex,1)
    return res.status(201).json({message:"deleted siccessfully",delted})
})
app.put('/user/:id',(req,res)=>{
    const userId= Number(req.params.id)
    const userIndex = user.findIndex(u=>u.id===userId)
    const data = req.body
    user[userIndex]= {id:userId,...data}
    res.status(201).json({message:"done data",data})
})
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)

})

