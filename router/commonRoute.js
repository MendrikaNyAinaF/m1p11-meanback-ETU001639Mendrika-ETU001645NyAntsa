const { appointmentService } = require('../controller/appointment');
const personService = require('../controller/person');
const { findCurrentsSpecialOffer, createSpecialOffer } = require('../controller/specialOffer');
const { clientService } = require("../service/client");
const { employeeService } = require("../service/employee/employee");
const { employeeController } = require("../controller/employee");
const { appointmentServiceCrud } = require("../service/appointment/appointment");
const { serviceService } = require("../service/service/service");
const { notificationController } = require("../controller/notification");

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
        path: "/appointment/:id/pay",
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
        path: "/appointment/:id",
        method: 'get',
        handler: appointmentService.findById
    },
    {
        path: "/appointment/:id/update",
        method: 'put',
        handler: appointmentServiceCrud.update
    },
    {
        path: "/rendez_vous-crud/employee",
        method: 'get',
        handler: appointmentServiceCrud.findAllAppointmentForEmployee
    },

    //special offer
    {
        path: "/offre_special/actuels",
        method: 'get',
        handler: findCurrentsSpecialOffer
    },
    {
        path: "/offre_special",
        method: 'post',
        handler: createSpecialOffer
    },

    //personne
    {
        path: "/client/register",
        method: 'post',
        handler: clientService.register
    },
    {
        path: "/employees/favourites/:clientId",
        method: 'get',
        handler: employeeService.getFavouriteEmployees
    },
    {
        path: "/services/favourites/:clientId",
        method: 'get',
        handler: serviceService.getFavouriteServices

    }, {
        path: "/preference/update/:clientId",
        method: 'put',
        handler: serviceService.updateStatus
    },
    //horaire
    {
        path: "/employee/:id/schedule",
        method: 'post',
        handler: employeeController.insertNewSchedule
    },
    {
        path: "/employee/:id/schedule/current",
        method: 'get',
        handler: employeeController.findCurrentSchedule
    },
    {
        path: "/employee/:id/schedule",
        method: 'get',
        handler: employeeController.findSchedule
    },
    //notification
    {
        path: "/notification",
        method: 'get',
        handler: notificationController.findAllNotificationByClient
    }
]
exports.commonRoute = () => commonRoute;
