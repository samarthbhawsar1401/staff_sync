const mongoose = require('mongoose');
const { getCollection, isMongoConnected } = require('../data/dbAdapter');

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  clockIn: { type: String, required: true },
  clockOut: { type: String, default: null },
  totalHours: { type: Number, default: 0 },
  status: { type: String, enum: ['Present', 'Late', 'Half-day', 'Absent'], default: 'Present' },
  notes: { type: String, default: '' }
}, { timestamps: true });

let MongooseAttendance;
try {
  MongooseAttendance = mongoose.model('Attendance', attendanceSchema);
} catch (e) {
  MongooseAttendance = mongoose.models.Attendance;
}

const Attendance = {
  find: (q) => isMongoConnected() ? MongooseAttendance.find(q) : getCollection('Attendance').find(q),
  findOne: (q) => isMongoConnected() ? MongooseAttendance.findOne(q) : getCollection('Attendance').findOne(q),
  findById: (id) => isMongoConnected() ? MongooseAttendance.findById(id) : getCollection('Attendance').findById(id),
  create: (data) => isMongoConnected() ? MongooseAttendance.create(data) : getCollection('Attendance').create(data),
  findByIdAndUpdate: (id, u, o) => isMongoConnected() ? MongooseAttendance.findByIdAndUpdate(id, u, { new: true, ...o }) : getCollection('Attendance').findByIdAndUpdate(id, u, o),
  findByIdAndDelete: (id) => isMongoConnected() ? MongooseAttendance.findByIdAndDelete(id) : getCollection('Attendance').findByIdAndDelete(id),
  countDocuments: (q) => isMongoConnected() ? MongooseAttendance.countDocuments(q) : getCollection('Attendance').countDocuments(q)
};

module.exports = Attendance;
