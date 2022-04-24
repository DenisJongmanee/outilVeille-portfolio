const mongoose = require('mongoose');
const { Schema } = mongoose;


mongoose.connect('mongodb://localhost:27017/veille_db');

const ArticleSchema = new Schema ({
    url: String,
    title: String,
    date: String,
    site: String
}, { collection: 'article', versionKey: false });

module.exports = mongoose.model('Article', ArticleSchema);
