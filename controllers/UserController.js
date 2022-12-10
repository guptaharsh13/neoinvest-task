require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.users;

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
};

const register = (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  let errors = [];

  // Validate fields
  if (!firstName || !lastName || !email || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  // Check passwords match
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.status(400).json({
      errors,
    });
  } else {
    // Validation passed
    User.findByPk(email).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.status(400).json({
          errors,
        });
      } else {
        const newUser = {
          firstName,
          lastName,
          email,
          password,
        };

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // Save user
            User.create(newUser)
              .then((user) => {
                const accessToken = generateAccessToken({
                  email: newUser.email,
                });
                res.json({
                  message: "User registered successfully",
                  accessToken,
                });
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  let errors = [];

  // Validate fields
  if (!email || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.status(400).json({
      errors,
    });
  } else {
    // Validation passed
    User.findByPk(email).then((user) => {
      if (!user) {
        errors.push({ msg: "User not found" });
        return res.status(400).json({
          errors,
        });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const accessToken = generateAccessToken({ email: user.email });
          res.json({
            message: "User logged in successfully",
            userId: user.id,
            accessToken,
          });
        } else {
          errors.push({ msg: "Password incorrect" });
          res.status(400).json({
            errors,
          });
        }
      });
    });
  }
};

module.exports = {
  register,
  login,
};
