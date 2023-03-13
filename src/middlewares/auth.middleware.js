export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("se está autenticando")
        next();
    } else {
        res.redirect("/auth/login");
    }
}
        