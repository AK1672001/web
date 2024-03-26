
const express = require("express");
const Data = require("../Modal/Modal");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
// const middle=require("../middleware/requriedlogin");
const requriedlogin = require("../middleware/requriedlogin");
dotenv.config();
// router.use(middle);
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  
  // Check if all required fields are provided
  if (!name || !username || !email || !password) {
    return res.status(422).json({ error: "Please fill in all fields" });
  }

  try {
    // Check if user already exists with the provided email or username
    const existingUser = await Data.findOne({ $or: [{ email: email }, { username: username }] });
    if (existingUser) {
      return res.status(422).json({ error: "User already exists with that email or username" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new Data({
      name,
      email,
      username,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.json({ message: "Registered successfully",newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const Jwt_secret = process.env.JWT_SECRET

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(422).json({ error: "Please add email and password" })
  }
  Data.findOne({ email: email }).then((savedUser) => {
      if (!savedUser) {
          return res.status(422).json({ error: "Invalid email" })
      }
      bcrypt.compare(password, savedUser.password).then((match) => {
          if (match) {
              // return res.status(200).json({ message: "Signed in Successfully" })
              const token = jwt.sign({ _id: savedUser.id }, Jwt_secret)
              const { _id, name, email, username } = savedUser

              res.json({ token, user: { _id, name, email, username } })

              console.log({ token, user: { _id, name, email, username } })
          } else {
              return res.status(422).json({ error: "Invalid password" })
          }
      })
          .catch(err => console.log(err))
  })
})

module.exports = router;
