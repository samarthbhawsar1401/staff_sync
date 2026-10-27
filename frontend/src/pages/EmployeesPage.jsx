import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import AddEmployeeModal from '../components/AddEmployeeModal';
import {
  Users,
  Search,
  Plus,
  Filter,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Trash2,
  Edit,
  ShieldCheck,
  CheckCircle,
  LayoutGrid,
  List
} from 'lucide-react';

const EmployeesPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      let url = '/employees?';
      if (department !== 'All') url += `department=${department}&`;
      if (roleFilter !== 'All') url += `role=${roleFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      // If manager, can see team
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [department, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from StaffSync?`)) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove employee.');
      }
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/employees/${editingEmployee._id}`, editingEmployee);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update employee.');
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">
            {role === 'hr' ? 'Employee Directory & Talent Roster' : role === 'manager' ? 'Team Members Directory' : 'Organization Staff Directory'}
          </h3>
          <p className="text-secondary small mb-0">
            Browse, manage, and connect with all registered personnel across departments.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* View toggle */}
          <div className="btn-group border rounded-pill bg-white p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`btn btn-sm rounded-pill px-3 border-0 ${viewMode === 'cards' ? 'bg-primary text-white' : 'text-secondary'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn btn-sm rounded-pill px-3 border-0 ${viewMode === 'table' ? 'bg-primary text-white' : 'text-secondary'}`}
            >
              <List size={16} />
            </button>
          </div>

          {role === 'hr' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary rounded-pill px-3 fw-bold d-flex align-items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                placeholder="Search staff by name, title, or email..."
                className="form-control border-start-0 bg-light"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3">
            <select
              className="form-select bg-light"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Product">Product</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select bg-light"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="employee">Staff Employees</option>
              <option value="manager">Managers / Leads</option>
              <option value="hr">HR Personnel</option>
            </select>
          </div>

          <div className="col-md-1">
            <button type="submit" className="btn btn-outline-primary w-100 rounded-3">
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted small mt-2">Loading staff roster...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <Users size={36} className="text-muted mb-2" />
          <h5 className="fw-bold text-dark">No employees found</h5>
          <p className="text-secondary small">Try adjusting your search keywords or filter criteria.</p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="row g-4">
          {employees.map(emp => (
            <div key={emp._id} className="col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 hover-shadow transition overflow-hidden">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`}
                        alt={emp.name}
                        className="rounded-circle border"
                        style={{ width: 56, height: 56, objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{emp.name}</h6>
                        <small className="text-primary fw-semibold d-block">{emp.designation}</small>
                        <span className="badge bg-light text-secondary border mt-1" style={{ fontSize: '10px' }}>
                          {emp.department}
                        </span>
                      </div>
                    </div>

                    <span className={`badge bg-${emp.role === 'hr' ? 'danger' : emp.role === 'manager' ? 'warning text-dark' : 'primary'}-subtle text-${emp.role === 'hr' ? 'danger' : emp.role === 'manager' ? 'warning' : 'primary'} rounded-pill text-uppercase`} style={{ fontSize: '10px' }}>
                      {emp.role}
                    </span>
                  </div>

                  <div className="small text-secondary mb-3 d-flex flex-column gap-1">
                    <div className="d-flex align-items-center gap-2">
                      <Mail size={14} className="text-muted" />
                      <span className="text-truncate">{emp.email}</span>
                    </div>
                    {emp.phone && (
                      <div className="d-flex align-items-center gap-2">
                        <Phone size={14} className="text-muted" />
                        <span>{emp.phone}</span>
                      </div>
                    )}
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={14} className="text-muted" />
                      <span>Joined {emp.joinedDate}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  {emp.skills && emp.skills.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {emp.skills.slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="badge bg-light text-muted border" style={{ fontSize: '11px' }}>
                          {sk}
                        </span>
                      ))}
                      {emp.skills.length > 3 && (
                        <span className="badge bg-light text-muted border" style={{ fontSize: '11px' }}>
                          +{emp.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action buttons for HR */}
                  {role === 'hr' && (
                    <div className="border-top pt-3 d-flex justify-content-end gap-2">
                      <button
                        onClick={() => setEditingEmployee(emp)}
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      {emp._id !== user?.id && (
                        <button
                          onClick={() => handleDeleteEmployee(emp._id, emp.name)}
                          className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Employee</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Contact Email</th>
                  <th>Joined</th>
                  {role === 'hr' && <th className="text-end">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`}
                          alt=""
                          className="rounded-circle"
                          style={{ width: 34, height: 34 }}
                        />
                        <span className="fw-bold small">{emp.name}</span>
                      </div>
                    </td>
                    <td className="small">{emp.designation}</td>
                    <td><span className="badge bg-light text-dark border">{emp.department}</span></td>
                    <td>
                      <span className={`badge bg-${emp.role === 'hr' ? 'danger' : emp.role === 'manager' ? 'warning text-dark' : 'primary'}-subtle text-${emp.role === 'hr' ? 'danger' : emp.role === 'manager' ? 'warning' : 'primary'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="small text-muted">{emp.email}</td>
                    <td className="small text-muted">{emp.joinedDate}</td>
                    {role === 'hr' && (
                      <td className="text-end">
                        <div className="btn-group">
                          <button
                            onClick={() => setEditingEmployee(emp)}
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          {emp._id !== user?.id && (
                            <button
                              onClick={() => handleDeleteEmployee(emp._id, emp.name)}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchEmployees}
      />

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light py-3">
                <h5 className="modal-title fw-bold fs-6 mb-0">Edit Profile: {editingEmployee.name}</h5>
                <button type="button" className="btn-close" onClick={() => setEditingEmployee(null)}></button>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Designation</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={editingEmployee.designation || ''}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, designation: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Department</label>
                    <select
                      className="form-select rounded-3"
                      value={editingEmployee.department || 'Engineering'}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Product">Product</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Phone</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={editingEmployee.phone || ''}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Annual Salary (USD)</label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      value={editingEmployee.salary || 0}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light py-2 px-4">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setEditingEmployee(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
