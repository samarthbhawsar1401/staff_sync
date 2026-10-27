const bcrypt = require('bcryptjs');

const getHashedPassword = (pw) => bcrypt.hashSync(pw, 10);

const defaultUsers = [
  {
    _id: 'usr_hr_01',
    name: 'Sarah Jenkins',
    email: 'hr@staffsync.com',
    password: getHashedPassword('admin123'),
    role: 'hr',
    department: 'Human Resources',
    designation: 'Head of Human Resources',
    phone: '+1 (555) 234-5678',
    address: '100 Innovation Blvd, Suite 400, San Francisco, CA',
    joinedDate: '2023-01-15',
    salary: 115000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    emergencyContact: { name: 'Mark Jenkins', relation: 'Spouse', phone: '+1 (555) 234-9999' },
    skills: ['Talent Acquisition', 'Labor Laws', 'Strategic HR', 'Conflict Resolution']
  },
  {
    _id: 'usr_mgr_01',
    name: 'Marcus Vance',
    email: 'manager@staffsync.com',
    password: getHashedPassword('manager123'),
    role: 'manager',
    department: 'Engineering',
    designation: 'Engineering Team Lead',
    phone: '+1 (555) 345-6789',
    address: '456 Tech Park Way, Austin, TX',
    joinedDate: '2023-03-10',
    salary: 125000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    emergencyContact: { name: 'Claire Vance', relation: 'Spouse', phone: '+1 (555) 345-8888' },
    skills: ['Agile Leadership', 'System Architecture', 'Node.js', 'Team Mentorship']
  },
  {
    _id: 'usr_emp_01',
    name: 'Alex Rivera',
    email: 'employee@staffsync.com',
    password: getHashedPassword('employee123'),
    role: 'employee',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    phone: '+1 (555) 456-7890',
    address: '789 Silicon Loop, Seattle, WA',
    joinedDate: '2023-06-01',
    salary: 98000,
    status: 'active',
    managerId: 'usr_mgr_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    emergencyContact: { name: 'Elena Rivera', relation: 'Sister', phone: '+1 (555) 456-1111' },
    skills: ['React.js', 'TypeScript', 'Redux', 'UI/UX Design', 'Tailwind CSS']
  },
  {
    _id: 'usr_emp_02',
    name: 'Emily Watson',
    email: 'emily.watson@staffsync.com',
    password: getHashedPassword('password123'),
    role: 'employee',
    department: 'Engineering',
    designation: 'Product Designer (UI/UX)',
    phone: '+1 (555) 567-8901',
    address: '321 Design Alley, New York, NY',
    joinedDate: '2023-08-15',
    salary: 92000,
    status: 'active',
    managerId: 'usr_mgr_01',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    emergencyContact: { name: 'John Watson', relation: 'Father', phone: '+1 (555) 567-2222' },
    skills: ['Figma', 'Wireframing', 'User Research', 'Design Systems']
  },
  {
    _id: 'usr_emp_03',
    name: 'Michael Chang',
    email: 'michael.chang@staffsync.com',
    password: getHashedPassword('password123'),
    role: 'employee',
    department: 'Engineering',
    designation: 'Backend Developer',
    phone: '+1 (555) 678-9012',
    address: '654 Cloud Peak Blvd, Denver, CO',
    joinedDate: '2024-01-10',
    salary: 94000,
    status: 'active',
    managerId: 'usr_mgr_01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    emergencyContact: { name: 'Lily Chang', relation: 'Mother', phone: '+1 (555) 678-3333' },
    skills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'GraphQL']
  },
  {
    _id: 'usr_emp_04',
    name: 'Priya Sharma',
    email: 'priya.sharma@staffsync.com',
    password: getHashedPassword('password123'),
    role: 'employee',
    department: 'Engineering',
    designation: 'QA Automation Engineer',
    phone: '+1 (555) 789-0123',
    address: '890 Quality Way, Boston, MA',
    joinedDate: '2024-02-01',
    salary: 86000,
    status: 'active',
    managerId: 'usr_mgr_01',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    emergencyContact: { name: 'Raj Sharma', relation: 'Brother', phone: '+1 (555) 789-4444' },
    skills: ['Cypress', 'Jest', 'Selenium', 'CI/CD Pipelines']
  },
  {
    _id: 'usr_emp_05',
    name: 'David Miller',
    email: 'david.miller@staffsync.com',
    password: getHashedPassword('password123'),
    role: 'employee',
    department: 'Marketing',
    designation: 'Senior Marketing Strategist',
    phone: '+1 (555) 890-1234',
    address: '432 Brand Street, Chicago, IL',
    joinedDate: '2023-09-01',
    salary: 89000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    emergencyContact: { name: 'Susan Miller', relation: 'Spouse', phone: '+1 (555) 890-5555' },
    skills: ['SEO', 'Content Strategy', 'Brand Management', 'Google Analytics']
  }
];

const todayStr = new Date().toISOString().split('T')[0];

const defaultAttendance = [
  {
    _id: 'att_01',
    userId: 'usr_emp_01',
    date: todayStr,
    clockIn: `${todayStr}T09:02:15.000Z`,
    clockOut: null,
    totalHours: 0,
    status: 'Present',
    notes: 'On-site engineering sprint'
  },
  {
    _id: 'att_02',
    userId: 'usr_emp_02',
    date: todayStr,
    clockIn: `${todayStr}T08:55:00.000Z`,
    clockOut: null,
    totalHours: 0,
    status: 'Present',
    notes: 'Working on Q4 design system audit'
  },
  {
    _id: 'att_03',
    userId: 'usr_emp_03',
    date: todayStr,
    clockIn: `${todayStr}T09:30:00.000Z`,
    clockOut: null,
    totalHours: 0,
    status: 'Late',
    notes: 'Transit delay'
  },
  {
    _id: 'att_04',
    userId: 'usr_mgr_01',
    date: todayStr,
    clockIn: `${todayStr}T08:45:00.000Z`,
    clockOut: null,
    totalHours: 0,
    status: 'Present',
    notes: 'Leading morning standup'
  },
  {
    _id: 'att_05',
    userId: 'usr_hr_01',
    date: todayStr,
    clockIn: `${todayStr}T08:50:00.000Z`,
    clockOut: null,
    totalHours: 0,
    status: 'Present',
    notes: 'Employee review sessions'
  }
];

const defaultLeaves = [
  {
    _id: 'lev_01',
    userId: 'usr_emp_01',
    leaveType: 'Annual',
    startDate: '2026-11-10',
    endDate: '2026-11-14',
    totalDays: 5,
    reason: 'Family vacation and personal downtime',
    status: 'Pending',
    appliedAt: '2026-10-25T10:30:00.000Z',
    reviewedBy: null,
    reviewComments: ''
  },
  {
    _id: 'lev_02',
    userId: 'usr_emp_02',
    leaveType: 'Sick',
    startDate: '2026-10-20',
    endDate: '2026-10-21',
    totalDays: 2,
    reason: 'Severe migraine, advised rest by doctor',
    status: 'Approved',
    appliedAt: '2026-10-19T08:15:00.000Z',
    reviewedBy: 'usr_mgr_01',
    reviewComments: 'Approved. Get well soon!'
  },
  {
    _id: 'lev_03',
    userId: 'usr_emp_03',
    leaveType: 'Casual',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    totalDays: 1,
    reason: 'Attending personal bank appointment',
    status: 'Approved',
    appliedAt: '2026-10-12T14:20:00.000Z',
    reviewedBy: 'usr_mgr_01',
    reviewComments: 'Approved.'
  },
  {
    _id: 'lev_04',
    userId: 'usr_emp_04',
    leaveType: 'Annual',
    startDate: '2026-11-02',
    endDate: '2026-11-04',
    totalDays: 3,
    reason: 'Attending sibling wedding ceremony',
    status: 'Pending',
    appliedAt: '2026-10-26T16:45:00.000Z',
    reviewedBy: null,
    reviewComments: ''
  }
];

const defaultAnnouncements = [
  {
    _id: 'ann_01',
    title: 'StaffSync v2.0 HR Platform Launch',
    content: 'We are thrilled to roll out the brand-new StaffSync HR portal. Employees can now seamlessly submit leaves, track daily attendance, and explore modern learning opportunities in one unified hub.',
    priority: 'Urgent',
    department: 'All',
    authorId: 'usr_hr_01',
    authorName: 'Sarah Jenkins (HR Lead)',
    createdAt: '2026-10-24T09:00:00.000Z'
  },
  {
    _id: 'ann_02',
    title: 'Upcoming Annual Company Retreat 2026',
    content: 'Save the date! Our company-wide annual offsite retreat is scheduled for December 15th-18th in Lake Tahoe. Team sessions, team building, and year-end celebrations await.',
    priority: 'Normal',
    department: 'All',
    authorId: 'usr_hr_01',
    authorName: 'Sarah Jenkins (HR Lead)',
    createdAt: '2026-10-22T11:30:00.000Z'
  },
  {
    _id: 'ann_03',
    title: 'Health & Wellness Benefit Enrollment Window',
    content: 'Annual open enrollment for medical, dental, and wellness stipends is open until November 15. Please review your insurance package in your profile.',
    priority: 'High',
    department: 'All',
    authorId: 'usr_hr_01',
    authorName: 'Sarah Jenkins (HR Lead)',
    createdAt: '2026-10-18T14:00:00.000Z'
  }
];

const defaultTrainings = [
  {
    _id: 'trn_01',
    title: 'Modern Full-Stack Architecture with MERN & Microservices',
    description: 'Master enterprise-scale Node.js, Mongoose optimization, and modern React 19 performance patterns.',
    instructor: 'Dr. Evelyn Reed (Tech Fellow)',
    department: 'Engineering',
    durationHours: 16,
    startDate: '2026-11-05',
    endDate: '2026-11-12',
    maxCapacity: 25,
    enrolledEmployees: ['usr_emp_01', 'usr_emp_03'],
    status: 'Upcoming'
  },
  {
    _id: 'trn_02',
    title: 'Agile Leadership & Cross-Functional Team Coaching',
    description: 'Techniques for managers and team leads to conduct high-impact sprint reviews, 1-on-1s, and career coaching.',
    instructor: 'Robert Kim (Agile Coach)',
    department: 'Management',
    durationHours: 8,
    startDate: '2026-11-08',
    endDate: '2026-11-09',
    maxCapacity: 15,
    enrolledEmployees: ['usr_mgr_01'],
    status: 'Upcoming'
  },
  {
    _id: 'trn_03',
    title: 'Corporate Cybersecurity & Data Privacy Standards',
    description: 'Mandatory annual training covering zero-trust security, credential hygiene, and SOC2 / GDPR compliance.',
    instructor: 'CyberOps Security Team',
    department: 'All',
    durationHours: 4,
    startDate: '2026-10-15',
    endDate: '2026-10-30',
    maxCapacity: 200,
    enrolledEmployees: ['usr_emp_01', 'usr_emp_02', 'usr_emp_04', 'usr_hr_01'],
    status: 'Ongoing'
  }
];

const defaultNotifications = [
  {
    _id: 'notif_01',
    userId: 'usr_emp_01',
    title: 'Leave Request Received',
    message: 'Your leave application for Nov 10 - Nov 14 has been forwarded to Marcus Vance.',
    type: 'leave',
    read: false,
    createdAt: '2026-10-25T10:31:00.000Z'
  },
  {
    _id: 'notif_02',
    userId: 'usr_mgr_01',
    title: 'New Leave Approval Needed',
    message: 'Alex Rivera submitted an Annual leave request (5 days).',
    type: 'leave',
    read: false,
    createdAt: '2026-10-25T10:31:00.000Z'
  },
  {
    _id: 'notif_03',
    userId: 'usr_emp_01',
    title: 'Welcome to StaffSync',
    message: 'Explore your dashboard, clock in daily, and verify your personal details.',
    type: 'system',
    read: true,
    createdAt: '2026-10-20T08:00:00.000Z'
  }
];

module.exports = {
  defaultUsers,
  defaultAttendance,
  defaultLeaves,
  defaultAnnouncements,
  defaultTrainings,
  defaultNotifications
};
