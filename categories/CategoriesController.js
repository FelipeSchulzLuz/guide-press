const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')

router.get("/admin/categories/new", (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
    const title = req.body.title;
    if (title != undefined || title.lenght >= 3) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/")
        })
    } else {
        res.redirect("admin/categories/new")
    }
})

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", { categories: categories })

    })
})

router.post("/categories/delete", (req, res) => {
    const id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        } else { // IF NAN
            res.redirect("/admin/categories")
        }
    } else { // IF NULL
        res.redirect("/admin/categories")
    }
})


router.get("/admin/categories/update/:id", (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }
    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/update", { category: category })
        } else {
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})


router.post("/categories/update", (req, res) => {
    const id = req.body.id
    const title = req.body.title

    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }

    Category.update({ title: title, slug: slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router;