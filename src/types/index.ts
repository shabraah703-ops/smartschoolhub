export type EducationLevel = 'Primary' | 'O-Level' | 'A-Level';

export type SchoolOwnershipType = 'Government' | 'Private' | 'Faith-based' | 'Community' | 'International';

export type PositionTitle =
  | 'School Owner'
  | 'Headmaster'
  | 'Headmistress'
  | 'Second Master'
  | 'Second Mistress'
  | 'Academic Master'
  | 'Academic Mistress'
  | 'Accountant'
  | 'Discipline Master'
  | 'Discipline Mistress'
  | 'Head of Department'
  | 'Teacher'
  | 'Class Teacher'
  | 'Quality Assurance'
  | 'Parent'
  | 'Student';

export type AppPermission =
  | 'students.view'
  | 'students.create'
  | 'students.edit'
  | 'students.delete'
  | 'students.move'
  | 'teachers.view'
  | 'teachers.manage'
  | 'attendance.view'
  | 'attendance.mark'
  | 'attendance.edit'
  | 'marks.enter'
  | 'marks.submit'
  | 'marks.verify'
  | 'marks.approve'
  | 'results.view'
  | 'results.release'
  | 'results.lock'
  | 'departments.manage'
  | 'streams.manage'
  | 'combinations.manage'
  | 'subjects.manage'
  | 'finance.view'
  | 'finance.manage'
  | 'discipline.view'
  | 'discipline.manage'
  | 'qa.view'
  | 'qa.manage'
  | 'reports.view'
  | 'reports.export'
  | 'school.configure'
  | 'audit.view';

export interface School {
  id: string;
  name: string;
  code: string; // e.g. TZS-MWZ-891
  registrationNumber: string;
  ownershipType: SchoolOwnershipType;
  educationLevels: EducationLevel[];
  region: string;
  district: string;
  ward: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  motto?: string;
  logoUrl?: string;
  ownerId: string;
  ownerName: string;
  academicYear: string; // e.g. 2026
  currentTerm: string; // e.g. Term 1, Term 2
  status: 'active' | 'suspended' | 'archived';
  createdAt: string;
  updatedAt?: string;
  gradingScale?: GradingGradeRule[];
}

export interface GradingGradeRule {
  grade: string; // 'A', 'B', 'C', 'D', 'F'
  minScore: number;
  maxScore: number;
  point: number;
  description: string; // 'Bora Sana' (Excellent), 'Vizuri Sana', etc.
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  photoUrl?: string;
  activeSchoolId?: string;
  isSuperAdmin?: boolean;
  createdAt: string;
}

export interface SchoolMembership {
  id: string;
  schoolId: string;
  schoolName: string;
  userId: string;
  userEmail: string;
  userName: string;
  positions: PositionTitle[];
  permissions: AppPermission[];
  status: 'active' | 'pending' | 'rejected' | 'inactive';
  joinedAt: string;
  departmentId?: string;
  assignedStreamIds?: string[];
  assignedSubjectIds?: string[];
}

export type StudentStatus = 'Active' | 'Transferred' | 'Graduated' | 'Suspended' | 'Withdrawn';

export interface Student {
  id: string;
  schoolId: string;
  studentId: string; // e.g. STU-2026-001
  admissionNumber: string; // e.g. MWS/2026/045
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  level: EducationLevel;
  formStandard: string; // e.g. 'Standard 4', 'Form I', 'Form V'
  streamId: string;
  streamName?: string;
  combinationId?: string; // For A-Level e.g. PCM, PCB
  combinationCode?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  previousSchool?: string;
  status: StudentStatus;
  admissionDate: string;
  academicYear: string;
  photoUrl?: string;
  movementHistory?: StudentMovementRecord[];
}

export interface StudentMovementRecord {
  id: string;
  type: 'Stream Change' | 'Combination Change' | 'Class Promotion' | 'Transfer' | 'Graduation' | 'Status Change';
  fromValue: string;
  toValue: string;
  reason: string;
  approvedBy: string;
  timestamp: string;
}

export interface Stream {
  id: string;
  schoolId: string;
  name: string; // e.g. 'Form I A', 'Form V PCM'
  code: string;
  level: EducationLevel;
  formStandard: string;
  academicYear: string;
  classTeacherId?: string;
  classTeacherName?: string;
  maxCapacity: number;
  status: 'active' | 'archived';
  description?: string;
}

export interface Department {
  id: string;
  schoolId: string;
  name: string; // 'Science', 'Arts', 'Commercial', 'ICT', 'Languages'
  code: string;
  description: string;
  hodId?: string;
  hodName?: string;
  memberIds: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Combination {
  id: string;
  schoolId: string;
  code: string; // 'PCM', 'PCB', 'HGL', 'EGM', 'CBG'
  name: string; // 'Physics, Chemistry, Mathematics'
  subjectIds: string[];
  status: 'active' | 'inactive';
  description?: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string; // 'Basic Mathematics', 'Physics', 'Kiswahili', 'English Language'
  code: string; // 'MATH', 'PHY', 'KISW', 'ENG'
  level: EducationLevel | 'All';
  departmentId?: string;
  periodsPerWeek: number;
  status: 'active' | 'inactive';
}

export type ExamStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'APPROVED' | 'RELEASED' | 'LOCKED';

export type ExamType =
  | 'Weekly Test'
  | 'Monthly Test'
  | 'Series'
  | 'Mid-Term'
  | 'Terminal'
  | 'Annual'
  | 'Mock'
  | 'Other';

export interface Examination {
  id: string;
  schoolId: string;
  name: string; // 'Form IV Mid-Term Examination 2026'
  type: ExamType;
  academicYear: string;
  term: string;
  level: EducationLevel | 'All';
  formStandard: string;
  streamId?: string;
  combinationId?: string;
  subjectIds: string[];
  startDate: string;
  endDate: string;
  maxScore: number;
  status: ExamStatus;
  releasedAt?: string;
  releasedBy?: string;
  approvedBy?: string;
}

export interface ExamMark {
  id: string;
  schoolId: string;
  examId: string;
  studentId: string;
  subjectId: string;
  score: number;
  maxScore: number;
  isAbsent: boolean;
  isExcused: boolean;
  teacherId: string;
  teacherName?: string;
  status: ExamStatus;
  submittedAt?: string;
  updatedAt?: string;
}

export interface CalculatedSubjectResult {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  point: number;
  remark: string;
  isAbsent: boolean;
  isExcused: boolean;
}

export interface CalculatedStudentResult {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  examId: string;
  examName: string;
  academicYear: string;
  term: string;
  formStandard: string;
  streamName: string;
  combinationCode?: string;
  subjects: CalculatedSubjectResult[];
  totalScore: number;
  maxTotalScore: number;
  averageScore: number;
  overallGrade: string;
  pointsTotal: number;
  division: string; // 'Division I', 'Division II', 'Division III', 'Division IV', 'Division 0'
  position?: number;
  totalStudentsInClass?: number;
  academicRemark?: string;
  headmasterRemark?: string;
  status: ExamStatus;
  isComplete: boolean;
}

export interface ResultCorrectionRequest {
  id: string;
  schoolId: string;
  examId: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  oldScore: number;
  newScore: number;
  reason: string;
  requestedBy: string;
  requestedByName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName?: string;
  streamId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remark?: string;
  markedBy: string;
  markedByName: string;
  updatedAt?: string;
}

export interface FeePayment {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  amount: number; // in Tanzanian Shillings (TZS)
  paymentMethod: 'Bank' | 'M-Pesa' | 'TigoPesa' | 'AirtelMoney' | 'Cash';
  referenceNumber: string;
  term: string;
  academicYear: string;
  feeType: 'Tuition Fee' | 'Boarding Fee' | 'Uniform & Books' | 'Examination Fee' | 'Transport' | 'Other';
  date: string;
  recordedBy: string;
  recordedByName: string;
  receiptNumber: string;
  status: 'Completed' | 'Pending' | 'Reversed';
}

export interface DisciplineCase {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  streamName: string;
  title: string;
  description: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  actionTaken: string; // 'Verbal Warning', 'Written Warning', 'Community Work', 'Suspension (14 Days)', 'Parent Summoned'
  reportedBy: string;
  reportedByName: string;
  parentNotified: boolean;
  date: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
}

export interface AuditLog {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  recordId?: string;
  oldValue?: string;
  newValue?: string;
  details: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  targetAudience: 'All' | 'Teachers' | 'Parents' | 'Students' | 'Specific Form';
  targetForm?: string;
  createdAt: string;
  priority: 'Normal' | 'Important' | 'Urgent';
}

export interface Message {
  id: string;
  schoolId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
  channel: 'Direct' | 'Parent-Teacher' | 'Department';
}
