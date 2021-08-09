const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const app = express();

const apikeyRoutes = require("./routes/apikey");

//Environment variable or constants
env.config();

const connectionString = `mongodb db string`;
// Database connection
const connectDB = async () => {
  try {
    await mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log("MongoDB Connected");
      });
  } catch (err) {
    console.error(err.message);
    // exit process with failure
    process.exit(1);
  }
};

connectDB();

app.use(express.json());

app.use("/api", apikeyRoutes);

// Listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
