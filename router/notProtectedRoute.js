const {generic} = require("../controller/generic/generic");
const {register} = require("../controller/person");
const notProtectedRoutes = [
    "/personne/register",
    "/personne/login",
    "/manager/login",
    "/client/login",
    "/client/register",
    "employee/login",
]
exports.notProtectedRoutes = () => notProtectedRoutes;
