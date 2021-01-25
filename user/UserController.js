const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get("/admin/user", (req, res) => {
    User.findAll().then(user => {
        res.render("admin/user/index", { user: user })
    })
})

router.get("/admin/user/new", (req, res) => {
    res.render('admin/user/new')
})


router.post('/user/save', (req, res) => {
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
                    res.redirect("admin/user")
                }
                return findByEmail = userEmail
            })
        let findByCpf
        User.findOne({ where: { cpf: users.cpf } })
            .then(userCpf => {
                if (userCpf) {
                    console.log("Usuário ja cadastrado com esse cpf!");
                    res.redirect("admin/user")
                }
                return findByCpf = userCpf
            })
        User.create({
            ...users,
            password: hash,
            repassword: hash,
        }).then(() => {
            console.log("Usuário cadastrado com sucesso");
            res.redirect("admin/user")
        })
    }
    else {
        console.log("Valores invalidos!");
    }
})





router.post("/user/delete", (req, res) => {
    const id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("admin/user")
            })
        } else { // IF NAN
            res.redirect("admin/user")
        }
    } else { // IF NULL
        res.redirect("admin/user")
    }
})




router.get("/admin/user/update/:id", (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/user")
    }
    User.findByPk(id).then(user => {
        if (user != undefined) {
            res.render("admin/user/update", { user: user })
        } else {
            res.redirect("admin/user")
        }
    }).catch(erro => {
        res.redirect("admin/user")
    })
})


router.post("/user/update", (req, res) => {
    let users = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        repassword: req.body.repassword
    }

    if (isNaN(users.id)) {
        res.redirect("admin/user")
    } else {
        User.update({ ...users }, {
            where: {
                id: users.id
            }
        }).then(() => {
            console.log("Usuário atualizado!");
            res.redirect("admin/user")
        }).catch(err => {
            console.log(err);
            res.redirect("/")
        })
    }
})


module.exports = router;