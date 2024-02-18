const {appointmentService} = require('../controller/appointment');
const {appointmentServiceCrud} = require('../service/appointment/appointment');

const commonRoute = [
    // common routes
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
        method: 'put',
        handler: appointmentServiceCrud.cancel
    }
]
exports.commonRoute = () => commonRoute;
