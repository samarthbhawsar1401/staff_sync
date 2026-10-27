const mongoose = require('mongoose');
const { getCollection, isMongoConnected } = require('../data/dbAdapter');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'system' },
  read: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

let MongooseNotification;
try {
  MongooseNotification = mongoose.model('Notification', notificationSchema);
} catch (e) {
  MongooseNotification = mongoose.models.Notification;
}

const Notification = {
  find: (q) => isMongoConnected() ? MongooseNotification.find(q) : getCollection('Notification').find(q),
  findOne: (q) => isMongoConnected() ? MongooseNotification.findOne(q) : getCollection('Notification').findOne(q),
  findById: (id) => isMongoConnected() ? MongooseNotification.findById(id) : getCollection('Notification').findById(id),
  create: (data) => isMongoConnected() ? MongooseNotification.create(data) : getCollection('Notification').create(data),
  findByIdAndUpdate: (id, u, o) => isMongoConnected() ? MongooseNotification.findByIdAndUpdate(id, u, { new: true, ...o }) : getCollection('Notification').findByIdAndUpdate(id, u, o),
  findByIdAndDelete: (id) => isMongoConnected() ? MongooseNotification.findByIdAndDelete(id) : getCollection('Notification').findByIdAndDelete(id),
  countDocuments: (q) => isMongoConnected() ? MongooseNotification.countDocuments(q) : getCollection('Notification').countDocuments(q)
};

module.exports = Notification;
