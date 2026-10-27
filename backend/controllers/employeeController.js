const bcrypt = require('bcryptjs');
const User = require('../models/User');

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

// GET /api/employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { department, role, search, status } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }
    if (role && role !== 'All') {
      query.role = role;
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    let employees = await User.find(query);

    if (search) {
      const q = search.toLowerCase();
      employees = employees.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    }

    res.json(employees.map(sanitizeUser));
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
};

// GET /api/employees/team
exports.getTeamMembers = async (req, res) => {
  try {
    const managerId = req.user.id;
    // Find users assigned to this manager or belonging to same department with role employee
    const allUsers = await User.find({});
    const team = allUsers.filter(u =>
      (u.managerId === managerId || (u.department === req.user.department && u.role === 'employee')) &&
      u._id !== managerId
    );

    res.json(team.map(sanitizeUser));
  } catch (err) {
    console.error('Error fetching team members:', err);
    res.status(500).json({ message: 'Failed to fetch team members.' });
  }
};

// GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    let managerName = null;
    if (employee.managerId) {
      const manager = await User.findById(employee.managerId);
      if (manager) managerName = manager.name;
    }

    const result = sanitizeUser(employee);
    result.managerName = managerName;
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employee details.' });
  }
};

// POST /api/employees (HR only)
exports.createEmployee = async (req, res) => {
  try {
    const {
      name, email, password, role, department, designation,
      phone, address, salary, joinedDate, managerId, skills
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An employee with this email already exists.' });
    }

    const defaultPassword = password || 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newEmp = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'employee',
      department: department || 'Engineering',
      designation: designation || 'Associate Engineer',
      phone: phone || '',
      address: address || '',
      salary: salary ? Number(salary) : 65000,
      joinedDate: joinedDate || new Date().toISOString().split('T')[0],
      managerId: managerId || null,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    });

    res.status(201).json({
      message: 'Employee created successfully.',
      employee: sanitizeUser(newEmp)
    });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Failed to create employee.' });
  }
};

// PUT /api/employees/:id (HR or Manager)
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, email, role, department, designation,
      phone, address, salary, status, managerId, skills
    } = req.body;

    const existing = await User.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    // Role restrictions: only HR can change role or salary
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (department) updateData.department = department;
    if (designation) updateData.designation = designation;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (status) updateData.status = status;
    if (managerId !== undefined) updateData.managerId = managerId;
    if (skills) {
      updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }

    if (req.user.role === 'hr') {
      if (role) updateData.role = role;
      if (salary !== undefined) updateData.salary = Number(salary);
    }

    const updated = await User.findByIdAndUpdate(id, updateData);
    res.json({
      message: 'Employee updated successfully.',
      employee: sanitizeUser(updated)
    });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ message: 'Failed to update employee.' });
  }
};

// DELETE /api/employees/:id (HR only)
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own HR account.' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.json({ message: 'Employee successfully removed from organization.' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Failed to delete employee.' });
  }
};
