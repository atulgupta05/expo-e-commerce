import express from "express";
import path from "path";
import { ENV } from "../config/env.js";

const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;


app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success Atul Gupta" });
})

//make our app for ready for deployment
if(ENV.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin","dist","index.html"));
  })
}

app.listen(PORT, () => console.log(`Success Atul Gupta , Server running on port ${PORT}`));