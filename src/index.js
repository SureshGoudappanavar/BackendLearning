import dotenv from 'dotenv';
import express from 'express';
import connnectDB from './db/index.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

connnectDB();
console.log('MongoDB URL:', process.env.MONGODB_URL);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

















// const app=express()

// ( async ()=>{
//     try{

//  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//    app.on("error",(error)=>{
//     console.log("ERR:",error)
//     throw error
//    })

//    app.listen(process.env.PORT,()=>{
//     console.log(`App is listening on port ${process.env.PORT}`);
//    })

// }catch(error){
//     console.log("error",error)
//     throw err
//     }
// })()



 
