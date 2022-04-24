const express = require("express"); 
const router = express.Router();
const subject = require("../controllers/subject");


router.get("/", subject.getSubjects);
router.get("/:name", subject.getSubject);
router.post("/", subject.addSubject);
router.delete("/:name", subject.delSubject);
module.exports = router;