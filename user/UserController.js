const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const adminAuth = require('../middlewares/adminAuth')
const session = require('express-session')

router.get("/admin/user",adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/user/index", { users: users })
    })
})

router.get("/admin/user/new",adminAuth, (req, res) => {
    res.render('admin/user/new')
})


router.post('/user/save',adminAuth, (req, res) => {
    let users = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        repassword: req.body.repassword,
        cpf: req.body.cpf,
    }
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(users.password, salt)

    if (users.name != undefined || users.email != undefined || users.cpf != undefined || users.password != undefined && users.password == users.repassword) {
        let findByName
        User.findOne({ where: { name: users.name } })
            .then(userName => {
                if (userName) {
                    console.log("Usuário ja cadastrado com esse nome!");
                    res.redirect("/admin/user")
                }
                return findByName = userName
            })
        let findByEmail
        User.findOne({ where: { email: users.email } })
            .then(userEmail => {
                if (userEmail) {
                    console.log("Usuário ja cadastrado com esse email!");
                    res.redirect("/admin/user")
                }
                return findByEmail = userEmail
            })
        let findByCpf
        User.findOne({ where: { cpf: users.cpf } })
            .then(userCpf => {
                if (userCpf) {
                    console.log("Usuário ja cadastrado com esse cpf!");
                    res.redirect("/admin/user")
                }
                return findByCpf = userCpf
            })
        User.create({
            ...users,
            password: hash,
            repassword: hash,
        }).then(() => {
            console.log("Usuário cadastrado com sucesso");
            res.redirect("/admin/user")
        })
    }
    else {
        console.log("Valores invalidos!");
    }
})





router.post("/user/delete",adminAuth, (req, res) => {
    const id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/user")
            })
        } else { 
            res.redirect("/admin/user")
        }
    } else { 
        res.redirect("/admin/user")
    }
})




router.get("/admin/user/update/:id",adminAuth, (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/user")
    }
    User.findByPk(id).then(user => {
        if (user != undefined) {
            res.render("admin/user/update", { user: user })
        } else {
            res.redirect("/admin/user")
        }
    }).catch(erro => {
        res.redirect("/admin/user")
    })
})


router.post("/user/update",adminAuth, (req, res) => {
    let users = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        repassword: req.body.repassword
    }
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(users.password, salt)

    if (isNaN(users.id || users.password != users.repassword)) {
        res.redirect("/admin/user")
    } else {
        User.update({ ...users,
            password: hash,
            repassword: hash }, {
            where: {
                id: users.id
            }
        }).then(() => {
            console.log("Usuário atualizado!");
            res.redirect("/admin/user")
        }).catch(err => {
            console.log("ESTE È O " + err);
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) => {
    res.render("admin/user/login")
})

router.post("/authenticate", (req, res) => {
    let email = req.body.email
    let password = req.body.password
    User.findOne({ where: { email: email }}).then(user => {
        if (user != undefined) {
            let correct = bcrypt.compareSync(password, user.password)
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email   
                }
                res.redirect("/")
            } else {
                console.log("Password nao confere");
                res.redirect("/login")
            }
        } else {
            console.log("Erro ao localizar");
            res.redirect("/login")
        }
    })
})

module.exports = router;