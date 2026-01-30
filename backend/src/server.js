import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'

const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(clerkMiddleware());  //req.auth // adds auth object under the req

app.get("/api/health", (req, res) => {
  req.auth
  res.status(200).json({ message: "Success Atul Gupta" });
})

// //make our app for ready for deployment
// if(ENV.NODE_ENV === "production"){
//   app.use(express.static(path.join(__dirname, "../admin/dist")));

//   app.get("/{*any}", (req, res) => {
//     res.sendFile(path.join(__dirname, "../admin","dist","index.html"));
//   })
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB();
});