const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require('cors')
const path = require("path")

const propertyRoutes = require('./routes/propertyRoute')
const authRoutes = require('./routes/authRoute')

const app = express();

const port = process.env.PORT || 5000;

//All middleware
//cors
app.use(cors())

//express
app.use(express.json())

//routes middleware
app.use('/api/property', propertyRoutes )
app.use('/api/auth', authRoutes )

//upload image middleware
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};
start();

//htechsolutionz
//sZzvlMWyNriSwlQ7
//mongodb+srv://htechsolutionz:sZzvlMWyNriSwlQ7@cluster0.pkcldjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0