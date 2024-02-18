const { appointmentService } = require('../controller/appointment');
const  personService=  require('../controller/person');
const {findCurrentsSpecialOffer}=require('../controller/specialOffer');

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

    //special offer
    {
        path: "offre_special/actuels",
        method: 'get',
        handler: appointmentService.payAppointment
    }


]
exports.commonRoute = () => commonRoute;
