require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userRouter = require("./routes/UserRoutes");
const rentalPlaceRouter = require("./routes/RentalPlaceRoutes");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV == "production" ? "common" : "dev"));

app.use("/api/user", userRouter);
app.use("/api/rental-place", rentalPlaceRouter);

console.log(
  "⚠️  Starting ",
  process.env.NODE_ENV == "production" ? "prod" : "staging",
  " Environment"
);

const force = process.env.NODE_ENV == "production" ? false : true;

const db = require("./models");
db.sequelize
  .sync({ force })
  .then(() => {
    console.log("✅ Database Connected!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("🚀 Server Ready! at port:", PORT);
    });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
