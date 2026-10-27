const mongoose = require('mongoose');
const { getCollection, isMongoConnected } = require('../data/dbAdapter');

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  department: { type: String, default: 'All' },
  durationHours: { type: Number, default: 8 },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  maxCapacity: { type: Number, default: 20 },
  enrolledEmployees: [{ type: String }],
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' }
}, { timestamps: true });

let MongooseTraining;
try {
  MongooseTraining = mongoose.model('Training', trainingSchema);
} catch (e) {
  MongooseTraining = mongoose.models.Training;
}

const Training = {
  find: (q) => isMongoConnected() ? MongooseTraining.find(q) : getCollection('Training').find(q),
  findOne: (q) => isMongoConnected() ? MongooseTraining.findOne(q) : getCollection('Training').findOne(q),
  findById: (id) => isMongoConnected() ? MongooseTraining.findById(id) : getCollection('Training').findById(id),
  create: (data) => isMongoConnected() ? MongooseTraining.create(data) : getCollection('Training').create(data),
  findByIdAndUpdate: (id, u, o) => isMongoConnected() ? MongooseTraining.findByIdAndUpdate(id, u, { new: true, ...o }) : getCollection('Training').findByIdAndUpdate(id, u, o),
  findByIdAndDelete: (id) => isMongoConnected() ? MongooseTraining.findByIdAndDelete(id) : getCollection('Training').findByIdAndDelete(id),
  countDocuments: (q) => isMongoConnected() ? MongooseTraining.countDocuments(q) : getCollection('Training').countDocuments(q)
};

module.exports = Training;
