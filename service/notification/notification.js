

const insertNotification = async (notification, db) => {
     return db.collection('notification').insertOne(notification);
}

const findAllNotificationByClient = async (page, client, db) => {
     return db.collection('notification').find({
          $or: [{ client: client }, { client: null }]
     }
     ).sort({ date_creation: -1 }).skip(page.size * page.number).limit(page.size).toArray();
}

module.exports = {
     insertNotification,
     findAllNotificationByClient
}
