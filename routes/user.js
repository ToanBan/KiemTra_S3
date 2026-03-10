const express = require("express");
let router = express.Router();
let User = require("../schemas/User");

// CREATE USER
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL USER (search username includes)
router.get("/users", async (req, res) => {
  try {
    const username = req.query.username;

    let filter = { isDeleted: false };

    if (username) {
      filter.username = {
        $regex: username,
        $options: "i",
      };
    }

    const users = await User.find(filter).populate("role");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USER BY ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE USER
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SOFT DELETE USER
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ENABLE USER
router.post("/enable", async (req, res) => {
  try {
    const { email, username } = req.body;

    const user = await User.findOne({
      email: email,
      username: username,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.status = true;

    await user.save();

    res.json({
      message: "User enabled",
      user: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DISABLE USER
router.post("/disable", async (req, res) => {
  try {
    const { email, username } = req.body;

    const user = await User.findOne({
      email: email,
      username: username,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.status = false;

    await user.save();

    res.json({
      message: "User disabled",
      user: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;