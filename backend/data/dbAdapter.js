const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const {
  defaultUsers,
  defaultAttendance,
  defaultLeaves,
  defaultAnnouncements,
  defaultTrainings,
  defaultNotifications
} = require('./seedData');

let isMongoConnected = false;

// In-memory / JSON store fallback
const memoryStore = {
  users: [...defaultUsers],
  attendance: [...defaultAttendance],
  leaves: [...defaultLeaves],
  announcements: [...defaultAnnouncements],
  trainings: [...defaultTrainings],
  notifications: [...defaultNotifications]
};

const DATA_FILE = path.join(__dirname, 'store.json');

const persistMemory = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store to disk:', err.message);
  }
};

const loadMemory = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      Object.assign(memoryStore, data);
    } else {
      persistMemory();
    }
  } catch (err) {
    console.warn('Could not read existing store file, using defaults:', err.message);
  }
};

loadMemory();

class MemoryCollection {
  constructor(name) {
    this.name = name;
  }

  get items() {
    return memoryStore[this.name] || [];
  }

  set items(val) {
    memoryStore[this.name] = val;
    persistMemory();
  }

  async find(query = {}) {
    let result = [...this.items];
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        if (v.$in) {
          result = result.filter(item => v.$in.includes(item[k]));
        } else if (v.$ne) {
          result = result.filter(item => item[k] !== v.$ne);
        } else if (v.$gte || v.$lte) {
          if (v.$gte) result = result.filter(item => item[k] >= v.$gte);
          if (v.$lte) result = result.filter(item => item[k] <= v.$lte);
        }
      } else {
        result = result.filter(item => item[k] === v);
      }
    }
    return result;
  }

  async findOne(query = {}) {
    const list = await this.find(query);
    return list[0] || null;
  }

  async findById(id) {
    return this.items.find(item => item._id === id || item._id === String(id)) || null;
  }

  async create(data) {
    const newItem = {
      _id: data._id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    this.items = [...this.items, newItem];
    return newItem;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const index = this.items.findIndex(item => item._id === id || item._id === String(id));
    if (index === -1) return null;

    let updatedFields = { ...update };
    if (update.$push) {
      for (const [arrKey, arrVal] of Object.entries(update.$push)) {
        const curArr = this.items[index][arrKey] || [];
        updatedFields[arrKey] = [...curArr, arrVal];
      }
      delete updatedFields.$push;
    }
    if (update.$pull) {
      for (const [arrKey, arrVal] of Object.entries(update.$pull)) {
        const curArr = this.items[index][arrKey] || [];
        updatedFields[arrKey] = curArr.filter(x => x !== arrVal);
      }
      delete updatedFields.$pull;
    }

    const updated = {
      ...this.items[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    const newItems = [...this.items];
    newItems[index] = updated;
    this.items = newItems;
    return updated;
  }

  async findByIdAndDelete(id) {
    const item = await this.findById(id);
    if (!item) return null;
    this.items = this.items.filter(i => i._id !== id && i._id !== String(id));
    return item;
  }

  async countDocuments(query = {}) {
    const list = await this.find(query);
    return list.length;
  }
}

const collections = {
  User: new MemoryCollection('users'),
  Attendance: new MemoryCollection('attendance'),
  Leave: new MemoryCollection('leaves'),
  Announcement: new MemoryCollection('announcements'),
  Training: new MemoryCollection('trainings'),
  Notification: new MemoryCollection('notifications')
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staffsync';
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log('MongoDB connected successfully via Mongoose.');
  } catch (err) {
    isMongoConnected = false;
    console.warn(`Local MongoDB not active (${err.message}). Seamlessly activated high-performance built-in JSON / In-Memory storage engine.`);
    console.log('All HRM data, users, and operations are fully persistent in backend/data/store.json.');
  }
};

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  getCollection: (name) => collections[name]
};
