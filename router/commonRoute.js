const { appointmentService } = require('../controller/appointment');
const  personService=  require('../controller/person');
const {findCurrentsSpecialOffer}=require('../controller/specialOffer');
const {appointmentServiceCrud} = require('../service/appointment/appointment');
const {clientService} = require("../service/client");
const {employeeService} = require("../service/employee/employee");

const commonRoute = [
    // common routes
    //person
    {
        path: /employee\/([a-fA-F0-9]+)$/,
        method: 'get',
        handler: personService.findOne
    },

    //appointment
    {
        path: /^appointment\/[a-zA-Z0-9]+\/payment$/,
        method: 'post',
        handler: appointmentService.payAppointment
    },
    {
        path: "/appointment",
        method: 'post',
        handler: appointmentServiceCrud.create
    },
    {
        path: "/appointment/:id/cancel",
        method: 'delete',
        handler: appointmentServiceCrud.cancel
    },
    {
        path:"/appointment/:id",
        method:'get',
        handler:appointmentService.findById
    },


    //special offer
    {
        path: "offre_special/actuels",
        method: 'get',
        handler: findCurrentsSpecialOffer
    },
    {
        path: "/appointment/:id/update",
        method: 'put',
        handler: appointmentServiceCrud.update
    },
    {
        path: "/client/register",
        method: 'post',
        handler: clientService.register
    },
    {
        path: "/employees/favourites/:clientId",
        method: 'get',
        handler: employeeService.getFavouriteEmployees
    }
]
exports.commonRoute = () => commonRoute;
