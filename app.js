const express = require("express")
require("dotenv").config()
const cors = require('cors')
const path = require("path")

const propertyRoutes = require('./routes/propertyRoute')
const authRoutes = require('./routes/authRoute')
const adminRoutes = require('./routes/adminRoute')

const app = express();

const port = process.env.PORT || 5000;

//All middleware
//cors
const allowedOrigins = [
  'http://localhost:5173',                  // for local development
  'https://admin-booking-jade.vercel.app'   // for production frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // enable if frontend sends cookies or auth headers
}));

//express
app.use(express.json())

//routes middleware
app.use('/api/property', propertyRoutes )
app.use('/api/auth', authRoutes )
app.use('/api', adminRoutes)

//upload image middleware
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
//htechsolutionz
//sZzvlMWyNriSwlQ7
//mongodb+srv://htechsolutionz:sZzvlMWyNriSwlQ7@cluster0.pkcldjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0