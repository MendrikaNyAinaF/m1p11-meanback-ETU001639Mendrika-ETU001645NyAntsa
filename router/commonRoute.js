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
    }
]
exports.commonRoute = () => commonRoute;
