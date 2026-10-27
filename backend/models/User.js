const mongoose = require('mongoose');
const { getCollection, isMongoConnected } = require('../data/dbAdapter');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['hr', 'manager', 'employee'], default: 'employee' },
  department: { type: String, default: 'General' },
  designation: { type: String, default: 'Staff Member' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  salary: { type: Number, default: 60000 },
  status: { type: String, enum: ['active', 'on-leave', 'inactive'], default: 'active' },
  managerId: { type: String, default: null },
  avatar: { type: String, default: '' },
  emergencyContact: {
    name: { type: String, default: '' },
    relation: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  skills: [{ type: String }]
}, { timestamps: true });

let MongooseUser;
try {
  MongooseUser = mongoose.model('User', userSchema);
} catch (e) {
  MongooseUser = mongoose.models.User;
}

// Unified Proxy
const User = {
  find: (q) => isMongoConnected() ? MongooseUser.find(q) : getCollection('User').find(q),
  findOne: (q) => isMongoConnected() ? MongooseUser.findOne(q) : getCollection('User').findOne(q),
  findById: (id) => isMongoConnected() ? MongooseUser.findById(id) : getCollection('User').findById(id),
  create: (data) => isMongoConnected() ? MongooseUser.create(data) : getCollection('User').create(data),
  findByIdAndUpdate: (id, u, o) => isMongoConnected() ? MongooseUser.findByIdAndUpdate(id, u, { new: true, ...o }) : getCollection('User').findByIdAndUpdate(id, u, o),
  findByIdAndDelete: (id) => isMongoConnected() ? MongooseUser.findByIdAndDelete(id) : getCollection('User').findByIdAndDelete(id),
  countDocuments: (q) => isMongoConnected() ? MongooseUser.countDocuments(q) : getCollection('User').countDocuments(q)
};

module.exports = User;
