const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const ArticlesController = require("./articles/ArticlesController")
const connection = require("./database/database")
const CategoriesController = require("./categories/CategoriesController")
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const { render } = require("ejs")
const UserController = require("./user/UserController")
// # View Engine
app.set('view engine', 'ejs')

// # Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// # Static
app.use(express.static('public'))


// # Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão estabelecida")
    }).catch((err) => {
        console.log(err);
    })


app.use('/', CategoriesController)
app.use('/', ArticlesController)
app.use('/', UserController)

app.get("/", (req, res) => {
    Article.findAll({
        limit: 3,
        order:[['id', 'DESC']]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {
                articles: articles,
                categories: categories
            })
        })
    })
})

app.get("/admin/", (req, res) => {

    res.redirect("/admin/articles")
})

app.get("/:slug", (req, res) => {
    const slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {
                    article: article,
                    categories: categories
                })
            })
        } else {
            res.redirect("/")
        }
    }).catch(err => {
        console.log(err);
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res) => {
    const slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {
                    articles: category.articles,
                    categories: categories
                })
            })

        } else {
            res.redirect("/")
        }
    }).catch(err => {
        console.log(err);
        res.redirect("/")
    })
})


app.listen(8000, () => {
    console.log("O servidor esta rodando...");
})