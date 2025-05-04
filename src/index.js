import dotenv from 'dotenv';
import express from 'express';
import connnectDB from './db/index.js';
import { app } from './app.js'; // ✅ Import your existing app

// Load environment variables
dotenv.config({
    path: './.env'
});

// Connect to DB and start server
connnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`✅ Server is running on http://localhost:${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed!", err);
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



 
