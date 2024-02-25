const { notificationService } = require('../service/notification/notification');

/** list of notification: the body format {page: {size, number}, client } */
const findAllNotificationByClient= async (req, res) => {
     const { page, client } = req.body;
     const db = req.db;
     const notifications = await notificationService.findAllNotificationByClient(page, client, db);
     res.status(200).json(notifications);
}

exports.notificationController={
     findAllNotificationByClient
}
