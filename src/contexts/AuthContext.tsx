import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Announcement,
  AppPermission,
  AttendanceRecord,
  AuditLog,
  Combination,
  Department,
  DisciplineCase,
  Examination,
  ExamMark,
  FeePayment,
  PositionTitle,
  School,
  SchoolMembership,
  Stream,
  Student,
  Subject,
  UserProfile,
} from '../types';
import {
  DEMO_ANNOUNCEMENTS,
  DEMO_ATTENDANCE,
  DEMO_AUDIT_LOGS,
  DEMO_COMBINATIONS,
  DEMO_DEPARTMENTS,
  DEMO_DISCIPLINE,
  DEMO_EXAMINATIONS,
  DEMO_FEES,
  DEMO_MARKS,
  DEMO_MEMBERSHIPS,
  DEMO_SCHOOL,
  DEMO_STREAMS,
  DEMO_STUDENTS,
  DEMO_SUBJECTS,
} from '../services/seedData';
import { DEFAULT_PERMISSIONS_BY_POSITION } from '../constants/tanzania';

interface AuthContextType {
  currentUser: UserProfile | null;
  currentSchool: School | null;
  userSchools: School[];
  membership: SchoolMembership | null;
  activePosition: PositionTitle;
  setActivePosition: (pos: PositionTitle) => void;
  hasPermission: (perm: AppPermission) => boolean;

  // School management
  registerSchool: (schoolData: Omit<School, 'id' | 'code' | 'ownerId' | 'ownerName' | 'status' | 'createdAt'>) => Promise<School>;
  joinSchoolByCode: (code: string) => Promise<{ success: boolean; message: string }>;
  switchSchool: (schoolId: string) => void;
  updateSchoolSettings: (updates: Partial<School>) => void;

  // Data Collections (isolated by currentSchool.id)
  students: Student[];
  streams: Stream[];
  departments: Department[];
  combinations: Combination[];
  subjects: Subject[];
  examinations: Examination[];
  marks: ExamMark[];
  attendance: AttendanceRecord[];
  feePayments: FeePayment[];
  disciplineCases: DisciplineCase[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  memberships: SchoolMembership[];

  // Mutations
  addStudent: (student: Omit<Student, 'id' | 'schoolId' | 'studentId' | 'status' | 'academicYear'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  moveStudent: (studentId: string, type: string, toValue: string, reason: string) => void;
  
  addStream: (stream: Omit<Stream, 'id' | 'schoolId' | 'status'>) => Stream;
  updateStream: (id: string, updates: Partial<Stream>) => void;

  addDepartment: (dept: Omit<Department, 'id' | 'schoolId' | 'createdAt' | 'status'>) => Department;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  changeHod: (deptId: string, newHodId: string, newHodName: string) => void;

  addCombination: (comb: Omit<Combination, 'id' | 'schoolId' | 'status'>) => Combination;
  updateCombination: (id: string, updates: Partial<Combination>) => void;

  addSubject: (subj: Omit<Subject, 'id' | 'schoolId' | 'status'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;

  addExamination: (exam: Omit<Examination, 'id' | 'schoolId' | 'status'>) => Examination;
  updateExaminationStatus: (examId: string, status: Examination['status']) => void;

  saveMarksBatch: (marksList: Omit<ExamMark, 'id' | 'schoolId' | 'status'>[]) => void;
  approveExaminationResults: (examId: string) => void;
  releaseExaminationResults: (examId: string) => void;
  lockExaminationResults: (examId: string) => void;

  recordAttendanceBatch: (records: Omit<AttendanceRecord, 'id' | 'schoolId'>[]) => void;
  recordFeePayment: (fee: Omit<FeePayment, 'id' | 'schoolId' | 'receiptNumber' | 'status'>) => FeePayment;
  addDisciplineCase: (c: Omit<DisciplineCase, 'id' | 'schoolId' | 'status'>) => DisciplineCase;
  addAnnouncement: (anc: Omit<Announcement, 'id' | 'schoolId' | 'createdAt'>) => Announcement;
  addAuditLog: (action: string, module: string, details: string, recordId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary current user
  const [currentUser] = useState<UserProfile>({
    uid: 'user-owner-001',
    email: 'shabraah703@gmail.com',
    fullName: 'Dr. Aloyce M. Mtei',
    phone: '+255 784 123 456',
    activeSchoolId: DEMO_SCHOOL.id,
    isSuperAdmin: true,
    createdAt: '2024-01-10T08:00:00Z',
  });

  const [allSchools, setAllSchools] = useState<School[]>([DEMO_SCHOOL]);
  const [currentSchoolId, setCurrentSchoolId] = useState<string>(DEMO_SCHOOL.id);
  const [activePosition, setActivePosition] = useState<PositionTitle>('School Owner');

  // Tenant Collections
  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [streams, setStreams] = useState<Stream[]>(DEMO_STREAMS);
  const [departments, setDepartments] = useState<Department[]>(DEMO_DEPARTMENTS);
  const [combinations, setCombinations] = useState<Combination[]>(DEMO_COMBINATIONS);
  const [subjects, setSubjects] = useState<Subject[]>(DEMO_SUBJECTS);
  const [examinations, setExaminations] = useState<Examination[]>(DEMO_EXAMINATIONS);
  const [marks, setMarks] = useState<ExamMark[]>(DEMO_MARKS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(DEMO_ATTENDANCE);
  const [feePayments, setFeePayments] = useState<FeePayment[]>(DEMO_FEES);
  const [disciplineCases, setDisciplineCases] = useState<DisciplineCase[]>(DEMO_DISCIPLINE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEMO_ANNOUNCEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(DEMO_AUDIT_LOGS);
  const [memberships, setMemberships] = useState<SchoolMembership[]>(DEMO_MEMBERSHIPS);

  // Active School
  const currentSchool = allSchools.find((s) => s.id === currentSchoolId) || allSchools[0] || null;

  // Active Membership
  const currentMembership = memberships.find(
    (m) => m.schoolId === currentSchoolId && (m.userId === currentUser.uid || m.userEmail === currentUser.email)
  ) || {
    id: 'default-membership',
    schoolId: currentSchool?.id || 'demo',
    schoolName: currentSchool?.name || 'School',
    userId: currentUser.uid,
    userEmail: currentUser.email,
    userName: currentUser.fullName,
    positions: [activePosition],
    permissions: DEFAULT_PERMISSIONS_BY_POSITION[activePosition] || [],
    status: 'active',
    joinedAt: new Date().toISOString(),
  };

  // Permission Checker
  const hasPermission = (perm: AppPermission): boolean => {
    if (activePosition === 'School Owner') return true;
    const allowed = DEFAULT_PERMISSIONS_BY_POSITION[activePosition] || [];
    return allowed.includes(perm);
  };

  // Audit Logger
  const addAuditLog = (action: string, module: string, details: string, recordId?: string) => {
    if (!currentSchool) return;
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      schoolId: currentSchool.id,
      userId: currentUser.uid,
      userName: `${currentUser.fullName} (${activePosition})`,
      action,
      module,
      recordId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // School Registration
  const registerSchool = async (
    data: Omit<School, 'id' | 'code' | 'ownerId' | 'ownerName' | 'status' | 'createdAt'>
  ): Promise<School> => {
    const codePrefix = data.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'SCH');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newCode = `TZS-${codePrefix}-${randomSuffix}`;
    const newSchoolId = `school-${Date.now()}`;

    const newSchool: School = {
      ...data,
      id: newSchoolId,
      code: newCode,
      ownerId: currentUser.uid,
      ownerName: currentUser.fullName,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setAllSchools((prev) => [...prev, newSchool]);
    setCurrentSchoolId(newSchoolId);

    // Create Owner membership
    const ownerMembership: SchoolMembership = {
      id: `mem-${Date.now()}`,
      schoolId: newSchoolId,
      schoolName: newSchool.name,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      positions: ['School Owner'],
      permissions: DEFAULT_PERMISSIONS_BY_POSITION['School Owner'],
      status: 'active',
      joinedAt: new Date().toISOString(),
    };

    setMemberships((prev) => [...prev, ownerMembership]);
    setActivePosition('School Owner');

    addAuditLog('REGISTERED_SCHOOL', 'School Profile', `Registered new school ${newSchool.name} with code ${newCode}`);
    return newSchool;
  };

  // Join School by Code
  const joinSchoolByCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const target = allSchools.find((s) => s.code.trim().toUpperCase() === code.trim().toUpperCase());
    if (!target) {
      return { success: false, message: `No school found with code "${code}". Please check with your School Owner.` };
    }

    const existingMem = memberships.find((m) => m.schoolId === target.id && m.userId === currentUser.uid);
    if (existingMem) {
      setCurrentSchoolId(target.id);
      return { success: true, message: `Switched to ${target.name}.` };
    }

    const newMem: SchoolMembership = {
      id: `mem-${Date.now()}`,
      schoolId: target.id,
      schoolName: target.name,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      positions: ['Teacher'],
      permissions: DEFAULT_PERMISSIONS_BY_POSITION['Teacher'],
      status: 'active',
      joinedAt: new Date().toISOString(),
    };

    setMemberships((prev) => [...prev, newMem]);
    setCurrentSchoolId(target.id);
    setActivePosition('Teacher');
    addAuditLog('JOINED_SCHOOL', 'Membership', `Joined ${target.name} via invitation code ${code}`);

    return { success: true, message: `Successfully joined ${target.name} as Teacher.` };
  };

  const switchSchool = (schoolId: string) => {
    const s = allSchools.find((x) => x.id === schoolId);
    if (s) {
      setCurrentSchoolId(schoolId);
      addAuditLog('SWITCHED_SCHOOL', 'Tenant', `Switched active school context to ${s.name}`);
    }
  };

  const updateSchoolSettings = (updates: Partial<School>) => {
    if (!currentSchool) return;
    setAllSchools((prev) =>
      prev.map((s) => (s.id === currentSchool.id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s))
    );
    addAuditLog('UPDATED_SETTINGS', 'School Profile', `Updated school configuration`);
  };

  // Student Mutations
  const addStudent = (studentData: Omit<Student, 'id' | 'schoolId' | 'studentId' | 'status' | 'academicYear'>): Student => {
    const count = students.filter((s) => s.schoolId === currentSchool?.id).length + 1;
    const year = currentSchool?.academicYear || '2026';
    const studentId = `STU-${year}-${String(count).padStart(3, '0')}`;
    const id = `stu-${Date.now()}`;

    const newStudent: Student = {
      ...studentData,
      id,
      schoolId: currentSchool?.id || 'demo',
      studentId,
      status: 'Active',
      academicYear: year,
      admissionDate: new Date().toISOString().split('T')[0],
      movementHistory: [
        {
          id: `mov-${Date.now()}`,
          type: 'Class Promotion',
          fromValue: 'New Admission',
          toValue: studentData.formStandard,
          reason: 'Initial Enrollment',
          approvedBy: currentUser.fullName,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setStudents((prev) => [newStudent, ...prev]);
    addAuditLog('ENROLLED_STUDENT', 'Students', `Enrolled student ${newStudent.fullName} (${newStudent.admissionNumber}) into ${newStudent.streamName || newStudent.formStandard}`, newStudent.id);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addAuditLog('UPDATED_STUDENT', 'Students', `Updated student profile information`, id);
  };

  const moveStudent = (studentId: string, type: string, toValue: string, reason: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        let fromVal = s.streamName || s.formStandard;
        if (type === 'Combination Change') fromVal = s.combinationCode || 'None';
        if (type === 'Status Change') fromVal = s.status;

        const record = {
          id: `mov-${Date.now()}`,
          type: type as any,
          fromValue: fromVal,
          toValue,
          reason,
          approvedBy: `${currentUser.fullName} (${activePosition})`,
          timestamp: new Date().toISOString(),
        };

        const updatedHistory = [...(s.movementHistory || []), record];
        let patch: Partial<Student> = { movementHistory: updatedHistory };

        if (type === 'Stream Change') {
          const st = streams.find((str) => str.id === toValue || str.name === toValue);
          patch.streamId = st ? st.id : toValue;
          patch.streamName = st ? st.name : toValue;
        } else if (type === 'Combination Change') {
          const c = combinations.find((cb) => cb.id === toValue || cb.code === toValue);
          patch.combinationId = c ? c.id : toValue;
          patch.combinationCode = c ? c.code : toValue;
        } else if (type === 'Status Change' || type === 'Graduation' || type === 'Transfer') {
          patch.status = toValue as any;
        }

        return { ...s, ...patch };
      })
    );
    addAuditLog('MOVED_STUDENT', 'Students', `Executed ${type} for student to ${toValue}. Reason: ${reason}`, studentId);
  };

  // Streams
  const addStream = (streamData: Omit<Stream, 'id' | 'schoolId' | 'status'>): Stream => {
    const newStream: Stream = {
      ...streamData,
      id: `stream-${Date.now()}`,
      schoolId: currentSchool?.id || 'demo',
      status: 'active',
    };
    setStreams((prev) => [...prev, newStream]);
    addAuditLog('CREATED_STREAM', 'Streams', `Created stream ${newStream.name} for ${newStream.formStandard}`, newStream.id);
    return newStream;
  };

  const updateStream = (id: string, updates: Partial<Stream>) => {
    setStreams((prev) => prev.map((st) => (st.id === id ? { ...st, ...updates } : st)));
    addAuditLog('UPDATED_STREAM', 'Streams', `Updated stream details`, id);
  };

  // Departments
  const addDepartment = (deptData: Omit<Department, 'id' | 'schoolId' | 'createdAt' | 'status'>): Department => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`,
      schoolId: currentSchool?.id || 'demo',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setDepartments((prev) => [...prev, newDept]);
    addAuditLog('CREATED_DEPARTMENT', 'Departments', `Created department ${newDept.name} (HOD: ${newDept.hodName || 'Unassigned'})`, newDept.id);
    return newDept;
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    addAuditLog('UPDATED_DEPARTMENT', 'Departments', `Updated department info`, id);
  };

  const changeHod = (deptId: string, newHodId: string, newHodName: string) => {
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id !== deptId) return d;
        const oldHod = d.hodName;
        addAuditLog('CHANGED_HOD', 'Departments', `Transferred Head of Department for ${d.name} from "${oldHod}" to "${newHodName}"`, deptId);
        return {
          ...d,
          hodId: newHodId,
          hodName: newHodName,
          memberIds: Array.from(new Set([...d.memberIds, newHodId])),
        };
      })
    );
  };

  // Combinations
  const addCombination = (combData: Omit<Combination, 'id' | 'schoolId' | 'status'>): Combination => {
    const newComb: Combination = {
      ...combData,
      id: `comb-${Date.now()}`,
      schoolId: currentSchool?.id || 'demo',
      status: 'active',
    };
    setCombinations((prev) => [...prev, newComb]);
    addAuditLog('CREATED_COMBINATION', 'Combinations', `Created A-Level combination ${newComb.code} (${newComb.name})`, newComb.id);
    return newComb;
  };

  const updateCombination = (id: string, updates: Partial<Combination>) => {
    setCombinations((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Subjects
  const addSubject = (subjData: Omit<Subject, 'id' | 'schoolId' | 'status'>): Subject => {
    const newSubj: Subject = {
      ...subjData,
      id: `sub-${Date.now()}`,
      schoolId: currentSchool?.id || 'demo',
      status: 'active',
    };
    setSubjects((prev) => [...prev, newSubj]);
    addAuditLog('CREATED_SUBJECT', 'Subjects', `Created subject ${newSubj.name} (${newSubj.code})`, newSubj.id);
    return newSubj;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Examinations
  const addExamination = (examData: Omit<Examination, 'id' | 'schoolId' | 'status'>): Examination => {
    const newExam: Examination = {
      ...examData,
      id: `exam-${Date.now()}`,
      schoolId: currentSchool?.id || 'demo',
      status: 'DRAFT',
    };
    setExaminations((prev) => [newExam, ...prev]);
    addAuditLog('CREATED_EXAMINATION', 'Examinations', `Created examination ${newExam.name} (${newExam.type})`, newExam.id);
    return newExam;
  };

  const updateExaminationStatus = (examId: string, status: Examination['status']) => {
    setExaminations((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, status } : e))
    );
    // Sync mark statuses
    setMarks((prev) =>
      prev.map((m) => (m.examId === examId ? { ...m, status } : m))
    );
    addAuditLog('UPDATED_EXAM_STATUS', 'Examinations', `Changed examination status to ${status}`, examId);
  };

  const saveMarksBatch = (marksList: Omit<ExamMark, 'id' | 'schoolId' | 'status'>[]) => {
    setMarks((prev) => {
      const updated = [...prev];
      marksList.forEach((incoming) => {
        const idx = updated.findIndex(
          (m) => m.examId === incoming.examId && m.studentId === incoming.studentId && m.subjectId === incoming.subjectId
        );
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            ...incoming,
            status: 'SUBMITTED',
            updatedAt: new Date().toISOString(),
          };
        } else {
          updated.push({
            ...incoming,
            id: `mk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            schoolId: currentSchool?.id || 'demo',
            status: 'SUBMITTED',
            submittedAt: new Date().toISOString(),
          });
        }
      });
      return updated;
    });
    addAuditLog('SUBMITTED_MARKS', 'Examinations', `Submitted batch of ${marksList.length} subject marks`);
  };

  const approveExaminationResults = (examId: string) => {
    setExaminations((prev) =>
      prev.map((e) =>
        e.id === examId
          ? {
              ...e,
              status: 'APPROVED',
              approvedBy: `${currentUser.fullName} (${activePosition})`,
            }
          : e
      )
    );
    setMarks((prev) => prev.map((m) => (m.examId === examId ? { ...m, status: 'APPROVED' } : m)));
    addAuditLog('APPROVED_RESULTS', 'Examinations', `Academic verification and executive approval granted`, examId);
  };

  const releaseExaminationResults = (examId: string) => {
    const exam = examinations.find((e) => e.id === examId);
    setExaminations((prev) =>
      prev.map((e) =>
        e.id === examId
          ? {
              ...e,
              status: 'RELEASED',
              releasedAt: new Date().toISOString(),
              releasedBy: `${currentUser.fullName} (${activePosition})`,
            }
          : e
      )
    );
    setMarks((prev) => prev.map((m) => (m.examId === examId ? { ...m, status: 'RELEASED' } : m)));

    // Automatically generate school announcement & notification
    if (exam && currentSchool) {
      const anc: Announcement = {
        id: `anc-${Date.now()}`,
        schoolId: currentSchool.id,
        title: `Official Release: ${exam.name}`,
        content: `Matokeo ya mtihani wa ${exam.name} yametolewa rasmi. Wanafunzi na wazazi mnakaribishwa kutazama kadi za matokeo kupitia mfumo.`,
        authorId: currentUser.uid,
        authorName: `${currentUser.fullName} (${activePosition})`,
        targetAudience: 'All',
        createdAt: new Date().toISOString(),
        priority: 'Urgent',
      };
      setAnnouncements((prev) => [anc, ...prev]);
    }

    addAuditLog('RELEASED_RESULTS', 'Examinations', `Officially released results to Student and Parent portals`, examId);
  };

  const lockExaminationResults = (examId: string) => {
    setExaminations((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, status: 'LOCKED' } : e))
    );
    setMarks((prev) => prev.map((m) => (m.examId === examId ? { ...m, status: 'LOCKED' } : m)));
    addAuditLog('LOCKED_RESULTS', 'Examinations', `Permanently locked final examination records against modifications`, examId);
  };

  // Attendance
  const recordAttendanceBatch = (records: Omit<AttendanceRecord, 'id' | 'schoolId'>[]) => {
    setAttendance((prev) => {
      const updated = [...prev];
      records.forEach((rec) => {
        const idx = updated.findIndex((a) => a.studentId === rec.studentId && a.date === rec.date);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...rec, updatedAt: new Date().toISOString() };
        } else {
          updated.push({
            ...rec,
            id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            schoolId: currentSchool?.id || 'demo',
          });
        }
      });
      return updated;
    });
    addAuditLog('RECORDED_ATTENDANCE', 'Attendance', `Marked attendance roll call for ${records.length} students on ${records[0]?.date}`);
  };

  // Fees
  const recordFeePayment = (feeData: Omit<FeePayment, 'id' | 'schoolId' | 'receiptNumber' | 'status'>): FeePayment => {
    const rcptNum = `RCPT-${new Date().getFullYear()}-${String(feePayments.length + 1).padStart(4, '0')}`;
    const newFee: FeePayment = {
      ...feeData,
      id: `fee-${Date.now()}`,
      schoolId: currentSchool?.id || 'demo',
      receiptNumber: rcptNum,
      status: 'Completed',
    };
    setFeePayments((prev) => [newFee, ...prev]);
    addAuditLog('RECORDED_FEE_PAYMENT', 'Finance', `Issued receipt ${rcptNum} of TZS ${feeData.amount.toLocaleString()} for student ${feeData.studentName}`, newFee.id);
    return newFee;
  };

  // Discipline
  const addDisciplineCase = (cData: Omit<DisciplineCase, 'id' | 'schoolId' | 'status'>): DisciplineCase => {
    const newCase: DisciplineCase = {
      ...cData,
      id: `disc-${Date.now()}`,
      schoolId: currentSchool?.id || 'demo',
      status: 'Open',
    };
    setDisciplineCases((prev) => [newCase, ...prev]);
    addAuditLog('LOGGED_DISCIPLINE_CASE', 'Discipline', `Filed disciplinary case "${newCase.title}" for ${newCase.studentName}`, newCase.id);
    return newCase;
  };

  // Announcements
  const addAnnouncement = (ancData: Omit<Announcement, 'id' | 'schoolId' | 'createdAt'>): Announcement => {
    const newAnc: Announcement = {
      ...ancData,
      id: `anc-${Date.now()}`,
      schoolId: currentSchool?.id || 'demo',
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    addAuditLog('POSTED_ANNOUNCEMENT', 'Communication', `Posted announcement "${newAnc.title}" to ${newAnc.targetAudience}`, newAnc.id);
    return newAnc;
  };

  // Filter tenant data by active school
  const activeStudents = students.filter((s) => s.schoolId === currentSchoolId);
  const activeStreams = streams.filter((s) => s.schoolId === currentSchoolId);
  const activeDepartments = departments.filter((d) => d.schoolId === currentSchoolId);
  const activeCombinations = combinations.filter((c) => c.schoolId === currentSchoolId);
  const activeSubjects = subjects.filter((s) => s.schoolId === currentSchoolId);
  const activeExaminations = examinations.filter((e) => e.schoolId === currentSchoolId);
  const activeMarks = marks.filter((m) => m.schoolId === currentSchoolId);
  const activeAttendance = attendance.filter((a) => a.schoolId === currentSchoolId);
  const activeFeePayments = feePayments.filter((f) => f.schoolId === currentSchoolId);
  const activeDiscipline = disciplineCases.filter((d) => d.schoolId === currentSchoolId);
  const activeAnnouncements = announcements.filter((a) => a.schoolId === currentSchoolId);
  const activeAuditLogs = auditLogs.filter((a) => a.schoolId === currentSchoolId);
  const activeMemberships = memberships.filter((m) => m.schoolId === currentSchoolId);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentSchool,
        userSchools: allSchools,
        membership: currentMembership,
        activePosition,
        setActivePosition,
        hasPermission,

        registerSchool,
        joinSchoolByCode,
        switchSchool,
        updateSchoolSettings,

        students: activeStudents,
        streams: activeStreams,
        departments: activeDepartments,
        combinations: activeCombinations,
        subjects: activeSubjects,
        examinations: activeExaminations,
        marks: activeMarks,
        attendance: activeAttendance,
        feePayments: activeFeePayments,
        disciplineCases: activeDiscipline,
        announcements: activeAnnouncements,
        auditLogs: activeAuditLogs,
        memberships: activeMemberships,

        addStudent,
        updateStudent,
        moveStudent,

        addStream,
        updateStream,

        addDepartment,
        updateDepartment,
        changeHod,

        addCombination,
        updateCombination,

        addSubject,
        updateSubject,

        addExamination,
        updateExaminationStatus,

        saveMarksBatch,
        approveExaminationResults,
        releaseExaminationResults,
        lockExaminationResults,

        recordAttendanceBatch,
        recordFeePayment,
        addDisciplineCase,
        addAnnouncement,
        addAuditLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
