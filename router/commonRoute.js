const { appointmentService } = require('../controller/appointment');
const  personService=  require('../controller/person');
const {findCurrentsSpecialOffer}=require('../controller/specialOffer');
const {appointmentServiceCrud} = require('../service/appointment/appointment');
const {clientService} = require("../service/client");

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
        handler: findCurrentsSpecialOffer
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

    //special offer
    {
        path: "offre_special/actuels",
        method: 'get',
        handler: appointmentService.payAppointment
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
    }
]
exports.commonRoute = () => commonRoute;
