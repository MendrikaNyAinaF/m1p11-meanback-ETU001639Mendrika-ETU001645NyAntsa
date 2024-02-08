const {generic} = require('../controller/generic/generic');
const {register, login} = require('../controller/person');

// anything that ends with crud
const findAllCrudRegex = /crud$/;
const findOneUpdateDeleteCrudRegex = /crud\/([a-fA-F0-9]+)$/;

const routes = [
    // generic crud routes
    {
        path: findAllCrudRegex,
        method: 'get',
        handler: generic.findAll
    },
    {
        path: findOneUpdateDeleteCrudRegex,
        method: 'get',
        handler: generic.findOne
    },
    {
        path: findOneUpdateDeleteCrudRegex,
        method: 'put',
        handler: generic.update
    },
    {
        path: findOneUpdateDeleteCrudRegex,
        method: 'delete',
        handler: generic.deleteOne
    },
    {
        path: findAllCrudRegex,
        method: 'post',
        handler: generic.create
    },
    {
        path:"/personne/register",
        method:"post",
        handler: register
    },
    {
        path: "/personne/login",
        method: "post",
        handler: login
    }
]
exports.routes = () => routes;