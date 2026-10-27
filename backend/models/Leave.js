const mongoose = require('mongoose');
const { getCollection, isMongoConnected } = require('../data/dbAdapter');

const leaveSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  leaveType: {
    type: String,
    enum: ['Annual', 'Sick', 'Casual', 'Maternity/Paternity', 'Unpaid'],
    required: true
  },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  totalDays: { type: Number, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  appliedAt: { type: String, default: () => new Date().toISOString() },
  reviewedBy: { type: String, default: null },
  reviewComments: { type: String, default: '' }
}, { timestamps: true });

let MongooseLeave;
try {
  MongooseLeave = mongoose.model('Leave', leaveSchema);
} catch (e) {
  MongooseLeave = mongoose.models.Leave;
}

const Leave = {
  find: (q) => isMongoConnected() ? MongooseLeave.find(q) : getCollection('Leave').find(q),
  findOne: (q) => isMongoConnected() ? MongooseLeave.findOne(q) : getCollection('Leave').findOne(q),
  findById: (id) => isMongoConnected() ? MongooseLeave.findById(id) : getCollection('Leave').findById(id),
  create: (data) => isMongoConnected() ? MongooseLeave.create(data) : getCollection('Leave').create(data),
  findByIdAndUpdate: (id, u, o) => isMongoConnected() ? MongooseLeave.findByIdAndUpdate(id, u, { new: true, ...o }) : getCollection('Leave').findByIdAndUpdate(id, u, o),
  findByIdAndDelete: (id) => isMongoConnected() ? MongooseLeave.findByIdAndDelete(id) : getCollection('Leave').findByIdAndDelete(id),
  countDocuments: (q) => isMongoConnected() ? MongooseLeave.countDocuments(q) : getCollection('Leave').countDocuments(q)
};

module.exports = Leave;
