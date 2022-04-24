
const express = require("express"); 
const router = express.Router();
const article = require("../controllers/article");



router.post("/", article.addArticle);
router.get("/", article.getArticles);
router.delete("/:id", article.delArticle);
module.exports = router;