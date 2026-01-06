const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const chatRoutes = require("./routes/chat");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/gemini", require("./routes/ai"));

app.get("/", (req, res) => {
  res.send("MCKart Backend Running");
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
