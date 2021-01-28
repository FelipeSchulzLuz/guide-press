const User = require("../user/User");

function adminAuth(req, res, next) {
    if (req.session.user != undefined) {
        next()
    } else {
        console.log("Falha ao autenticar");
        res.redirect("/login")
    }
}

module.exports = adminAuth