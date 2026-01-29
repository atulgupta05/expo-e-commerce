import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;


app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success Atul Gupta" });
})

app.listen(PORT, () => console.log(`Success Atul Gupta , Server running on port ${PORT}`));