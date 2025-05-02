import dotenv from 'dotenv';
import express from 'express';
import connnectDB from './db/index.js';

// Load environment variables from .env file
dotenv.config({
    path:'./.env'
});

const app = express();

connnectDB().then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
})
.catch((err)=>{
    console.log("MONGO db connection failed !!!",err)
})
console.log('MongoDB URL:', process.env.MONGODB_URL);




















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



 
