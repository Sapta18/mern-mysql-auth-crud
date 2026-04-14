const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats
} = require("../controllers/itemController");

router.use(auth);

router.get("/", getItems);
router.get("/stats", getStats);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;