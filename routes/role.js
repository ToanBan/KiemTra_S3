const express = require("express");
let router = express.Router();
let Role = require("../schemas/Role");
let User = require("../schemas/User");
// CREATE ROLE
router.post("/roles", async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL ROLE
router.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ROLE BY ID
router.get("/roles/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role || role.isDeleted) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE ROLE
router.put("/roles/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SOFT DELETE ROLE
router.delete("/roles/:id", async (req, res) => {
  try {
    await Role.findByIdAndUpdate(req.params.id, { isDeleted: true });

    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/roles/:id/users", async (req, res) => {
  try {
    const users = await User.find({
      role: req.params.id,
      isDeleted: false,
    }).populate("role");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
