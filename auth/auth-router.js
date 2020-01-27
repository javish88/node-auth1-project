const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error Registering" });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.cookie("user_id", user.id);
        res.status(200).json({ message: "Logged in" });
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.status(200).json({ message: "logged out" });
  }
});

module.exports = router;
