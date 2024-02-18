/** list of notification: the body format {page: {size, number}, client } */
const findAllNotificationByClient= async (req, res) => {
     const { page, client } = req.body;
     const notifications = await notificationService.findAllNotificationByClient(page, client);
     res.status(200).json(notifications);
}
module.exports={
     findAllNotificationByClient
}
