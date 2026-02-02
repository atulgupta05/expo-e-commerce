import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";

import { functions, inngest } from "./config/inngest.js";

const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;


app.use(express.json())

app.use(clerkMiddleware());  //req.auth // adds auth object under the req

app.use("/api/inngest", serve({ client: inngest, functions }));


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

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();