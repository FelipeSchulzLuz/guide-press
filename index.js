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
const session = require('express-session')
const adminAuth = require('./middlewares/adminAuth')

// # View Engine
app.set('view engine', 'ejs')

// # Session
app.use(session({
    secret: 'textoaqualquer',
    cookie: {
        maxAge: 180000
    }
}))

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
    let session = req.session
    Article.findAll({
        limit: 3,
        order:[['id', 'DESC']]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {
                articles: articles,
                categories: categories,
                session: session
            })
        })
    })
})

app.get("/admin/",adminAuth, (req, res) => {
    res.redirect("/admin/articles")
})

app.get("/:slug", (req, res) => {
    let slug = req.params.slug
    let session = req.session
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {
                    article: article,
                    categories: categories,
                    session: session
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
    let session = req.session
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
                    categories: categories,
                    session:session
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