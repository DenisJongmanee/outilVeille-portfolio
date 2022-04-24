const { default: mongoose } = require('mongoose');
const Article = require('../models/Article');

exports.addArticle = (req, res, next) => {
    try {
        const article = req.body
        Article.find({ url: article.url, title: article.title, date: article.date, site: article.site }).then(searchArticle => {
            if (searchArticle.length === 0) {
                console.log("nouveau");
                const newArticle = new Article(article);
                newArticle.save().then(() => res.status(200).send());
            } else {
                console.log("deja");
                res.status(201).send();
            }
        });
        
    } catch(error) {
        console.log(error);
        res.status(400).send();
    }
}

exports.getArticles = (req, res, next) => {
    try {
        Article.find().then(articles => {
            console.log(articles);
            res.status(200).json(articles);
        });

    } catch(error) {
        console.log(error);
        res.status(400).send();
    }
}

exports.delArticle = (req, res, next) => {
    try {
        const id = mongoose.Types.ObjectId(req.params.id);
        Article.deleteOne({ _id: id }).then(()=> {
            console.log(id);
            res.status(200).send();
        });
    } catch(error) {
        console.log(error);
        res.status(400).send();
    }
}
