const express = require('express')
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("../articles/Article")
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles',adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles })
    })
})
router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories })
    })
})
router.post("/articles/save",adminAuth, (req, res) => {
    const title = req.body.title;
    const body = req.body.body
    const category = req.body.category
    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})
router.get("/admin/articles/update/:id",adminAuth, (req, res) => {
    const id = req.params.id
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/update", { article: article, categories: categories })
            })
        }
    }).catch(err => {
        console.log(err);
        res.redirect("/admin/articles")
    })
})
router.post("/articles/update",adminAuth, (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const category = req.body.category
    const body = req.body.body
    if (isNaN(id)) {
        res.redirect("/admin/articles")
    } else {
        Article.update({ title: title, slug: slugify(title), categoryId: category, body: body }, {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/articles")
        }).catch(err => {
            console.log(err);
            res.redirect("/")
        })
    }
})
router.post("/articles/delete",adminAuth, (req, res) => {
    const id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        } else { // IF NAN
            res.redirect("/admin/articles")
        }
    } else { // IF NULL
        res.redirect("/admin/articles")
    }
})



router.get("/articles/page/:num", (req, res) => {
    let page = req.params.num
    var offset = 0

    if (isNaN(page) || page == 1) {
        offset = 0
    } else {
        offset = (parseInt(page) - 1)  * 3
    }
    Article.findAndCountAll({
        offset: offset,
        limit: 3,
        order:[['id', 'DESC']]
    }).then(articles => {
        let next;

        if (offset + 3 > articles.count) {
            next = false;
        } else {
            next = true;
        }
        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page", { result: result, categories: categories })
        })
    })
})

module.exports = router;