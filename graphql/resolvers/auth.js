const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

///// for rootValue
module.exports = {
  // create a new user
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User exists already");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((result) => {
        console.log(result);
        return { ...result._doc, password: null };
      })
      .catch((err) => {
        throw err;
      });
  },
  // login
  login: async ({ email, password }) => {
    try {
      // check user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User does not exist!");
      }
      // check password
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Password is incorrect!");
      }
      // get token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );
      return { userId: user.id, token, tokenExpiration: 2 };
    } catch (err) {
      throw err;
    }
  },
};
