export function isAuth(req, res, next) {
    //if (req.isAuthenticated()) {
    let user = req.session?.user || req.cookies?.user;
    if (user) {
        console.log("se está autenticando") 
        next();
    } else {
        res.redirect("/auth/login");
    } 
}
        