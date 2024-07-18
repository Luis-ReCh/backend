const express = require("express");
const {
  create,
  get,
  filteredList,
  update,
  list,
} = require("../usecases/user.usecase");
const { auth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = await create(req.body);
    res.status(201);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await list(req.query);
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await get(req.params.id);
    res.json({
      succes: true,
      data: user,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const user = await update(req.params.id, req.body, req);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:id/posts", async (req, res) => {
  try {
    const user = await get(req.params.id);
    const posts = await filteredList({ id: `${user.id}` });
    res.json({
      succes: true,
      data: posts,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
