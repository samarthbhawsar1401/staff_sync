const mongoose = require('mongoose');
const { getCollection, isMongoConnected } = require('../data/dbAdapter');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
  department: { type: String, default: 'All' },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

let MongooseAnnouncement;
try {
  MongooseAnnouncement = mongoose.model('Announcement', announcementSchema);
} catch (e) {
  MongooseAnnouncement = mongoose.models.Announcement;
}

const Announcement = {
  find: (q) => isMongoConnected() ? MongooseAnnouncement.find(q) : getCollection('Announcement').find(q),
  findOne: (q) => isMongoConnected() ? MongooseAnnouncement.findOne(q) : getCollection('Announcement').findOne(q),
  findById: (id) => isMongoConnected() ? MongooseAnnouncement.findById(id) : getCollection('Announcement').findById(id),
  create: (data) => isMongoConnected() ? MongooseAnnouncement.create(data) : getCollection('Announcement').create(data),
  findByIdAndUpdate: (id, u, o) => isMongoConnected() ? MongooseAnnouncement.findByIdAndUpdate(id, u, { new: true, ...o }) : getCollection('Announcement').findByIdAndUpdate(id, u, o),
  findByIdAndDelete: (id) => isMongoConnected() ? MongooseAnnouncement.findByIdAndDelete(id) : getCollection('Announcement').findByIdAndDelete(id),
  countDocuments: (q) => isMongoConnected() ? MongooseAnnouncement.countDocuments(q) : getCollection('Announcement').countDocuments(q)
};

module.exports = Announcement;
