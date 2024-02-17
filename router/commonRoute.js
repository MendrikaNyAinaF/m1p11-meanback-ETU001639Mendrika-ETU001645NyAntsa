const {appointmentService} = require('../controller/appointment');
const commonRoute = [
    // common routes
    {
        path: /^appointment\/[a-zA-Z0-9]+\/payment$/,
        method: 'post',
        handler: appointmentService.payAppointment
    }
]
exports.commonRoute = () => commonRoute;
