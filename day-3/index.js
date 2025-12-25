import express from 'express'
import fspromises from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'

const app= express()
const __filename = fileURLToPath(import.meta.url);
console.log(__filename)
const __dirname = path.dirname(__filename);
console.log(__dirname)
const filePath = path.join(__dirname, 'input.txt');
console.log('filePath: ', filePath);
app.use(cors())
const PORT=3000


app.get('/file',async(req,res)=>{
    try{
    const data = await fspromises.readFile(filePath, 'utf-8');
    console.log('data: ', data);
   res.status(201).json({message:"this is the readfile",data})
    }catch{
      return res.status(401).json({message:"there is an error in readFile"})
    }
})

const myPromises=new Promise((resolve,reject)=>{
    let con = true;
if(con){
    resolve("promises fulfiled")
}else{
    reject("promises reject")
}
})
myPromises.then(message=>console.log(message)).catch(error=>console.log(error));

const promise1 = Promise.resolve(101);
//const promise2 = new Promise(resolve => setTimeout(() => resolve(202), 2000));
const promise3 = Promise.resolve(303);
const promise4=Promise.resolve("task B failed ")
Promise.all([promise1, promise3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

  Promise.allSettled([promise1, promise3,promise4]).then(result=>console.log(result))
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})
 