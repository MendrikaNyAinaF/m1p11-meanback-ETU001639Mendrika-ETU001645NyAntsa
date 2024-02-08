const {generic} = require("../controller/generic/generic");
const {register} = require("../controller/person");
const notProtectedRoutes = [
    "/personne/register",
    "/personne/login"
]
exports.notProtectedRoutes = () => notProtectedRoutes;