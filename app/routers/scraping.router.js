
const express = require("express"); 
const router = express.Router();
const scraping = require("../controllers/scraping");



router.get("/:search/:lang", scraping.getData);

module.exports = router ;   