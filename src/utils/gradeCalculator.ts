import { CalculatedStudentResult, CalculatedSubjectResult, ExamMark, GradingGradeRule, Subject } from '../types';
import { DEFAULT_NECTA_GRADING_RULES } from '../constants/tanzania';

/**
 * Calculates grade and point for an individual score based on school rules
 */
export function calculateSubjectGrade(
  score: number,
  maxScore: number = 100,
  rules: GradingGradeRule[] = DEFAULT_NECTA_GRADING_RULES
): { grade: string; point: number; remark: string; percentage: number } {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const rounded = Math.round(percentage * 10) / 10;

  for (const rule of rules) {
    if (rounded >= rule.minScore && rounded <= rule.maxScore) {
      return {
        grade: rule.grade,
        point: rule.point,
        remark: rule.description,
        percentage: rounded,
      };
    }
  }

  // Fallback if rule bounds missed edge
  if (rounded >= 75) return { grade: 'A', point: 1, remark: 'Bora Sana (Distinction)', percentage: rounded };
  if (rounded >= 65) return { grade: 'B', point: 2, remark: 'Vizuri Sana (Merit)', percentage: rounded };
  if (rounded >= 45) return { grade: 'C', point: 3, remark: 'Vizuri (Credit)', percentage: rounded };
  if (rounded >= 30) return { grade: 'D', point: 4, remark: 'Wastani (Pass)', percentage: rounded };
  return { grade: 'F', point: 5, remark: 'Feli (Fail)', percentage: rounded };
}

/**
 * Calculates NECTA division based on best 7 subjects points for O-Level,
 * or best 3 principal subjects for A-Level
 */
export function calculateDivision(
  subjectResults: CalculatedSubjectResult[],
  level: string
): { division: string; pointsTotal: number } {
  // Filter only attended subjects with valid points
  const validSubjects = subjectResults.filter((s) => !s.isAbsent && !s.isExcused);
  if (validSubjects.length === 0) {
    return { division: 'Division 0', pointsTotal: 0 };
  }

  // Sort ascending by points (lower is better, e.g. 1 point for A)
  const sortedPoints = validSubjects.map((s) => s.point).sort((a, b) => a - b);

  if (level === 'A-Level') {
    // A-Level division based on best 3 subjects
    const count = Math.min(sortedPoints.length, 3);
    const sumPoints = sortedPoints.slice(0, count).reduce((acc, curr) => acc + curr, 0);

    if (sumPoints >= 3 && sumPoints <= 9) return { division: 'Division I', pointsTotal: sumPoints };
    if (sumPoints >= 10 && sumPoints <= 12) return { division: 'Division II', pointsTotal: sumPoints };
    if (sumPoints >= 13 && sumPoints <= 17) return { division: 'Division III', pointsTotal: sumPoints };
    if (sumPoints >= 18 && sumPoints <= 19) return { division: 'Division IV', pointsTotal: sumPoints };
    return { division: 'Division 0', pointsTotal: sumPoints };
  }

  // O-Level & Primary default: Best 7 subjects
  const count = Math.min(sortedPoints.length, 7);
  const sumPoints = sortedPoints.slice(0, count).reduce((acc, curr) => acc + curr, 0);

  if (sumPoints >= 7 && sumPoints <= 17) return { division: 'Division I', pointsTotal: sumPoints };
  if (sumPoints >= 18 && sumPoints <= 21) return { division: 'Division II', pointsTotal: sumPoints };
  if (sumPoints >= 22 && sumPoints <= 25) return { division: 'Division III', pointsTotal: sumPoints };
  if (sumPoints >= 26 && sumPoints <= 33) return { division: 'Division IV', pointsTotal: sumPoints };
  return { division: 'Division 0', pointsTotal: sumPoints };
}

/**
 * Computes full student exam summary
 */
export function computeStudentExamResult(
  student: { id: string; fullName: string; admissionNumber: string },
  exam: { id: string; name: string; academicYear: string; term: string; formStandard: string; level: string },
  streamName: string,
  marksForStudent: ExamMark[],
  allSubjects: Subject[],
  gradingRules: GradingGradeRule[] = DEFAULT_NECTA_GRADING_RULES,
  combinationCode?: string
): CalculatedStudentResult {
  const subjectResults: CalculatedSubjectResult[] = [];
  let totalScore = 0;
  let maxTotalScore = 0;
  let isComplete = true;

  for (const mark of marksForStudent) {
    const subject = allSubjects.find((s) => s.id === mark.subjectId);
    const subjectName = subject ? subject.name : 'Unknown Subject';
    const subjectCode = subject ? subject.code : 'SUB';

    if (mark.isAbsent) {
      subjectResults.push({
        subjectId: mark.subjectId,
        subjectName,
        subjectCode,
        score: 0,
        maxScore: mark.maxScore || 100,
        percentage: 0,
        grade: 'ABS',
        point: 5,
        remark: 'Absent (Hajahudhuria)',
        isAbsent: true,
        isExcused: false,
      });
      maxTotalScore += mark.maxScore || 100;
      continue;
    }

    if (mark.isExcused) {
      subjectResults.push({
        subjectId: mark.subjectId,
        subjectName,
        subjectCode,
        score: 0,
        maxScore: mark.maxScore || 100,
        percentage: 0,
        grade: 'EXC',
        point: 0,
        remark: 'Excused (Amesamehewa)',
        isAbsent: false,
        isExcused: true,
      });
      continue;
    }

    const calc = calculateSubjectGrade(mark.score, mark.maxScore || 100, gradingRules);
    totalScore += mark.score;
    maxTotalScore += mark.maxScore || 100;

    subjectResults.push({
      subjectId: mark.subjectId,
      subjectName,
      subjectCode,
      score: mark.score,
      maxScore: mark.maxScore || 100,
      percentage: calc.percentage,
      grade: calc.grade,
      point: calc.point,
      remark: calc.remark,
      isAbsent: false,
      isExcused: false,
    });
  }

  const validCount = subjectResults.filter((s) => !s.isExcused).length;
  const averageScore = validCount > 0 && maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
  const roundedAverage = Math.round(averageScore * 10) / 10;
  const overallGradeCalc = calculateSubjectGrade(roundedAverage, 100, gradingRules);
  const divCalc = calculateDivision(subjectResults, exam.level);

  let academicRemark = 'Good performance. Keep up the dedication.';
  if (roundedAverage >= 75) academicRemark = 'Outstanding academic excellence! Recommended for honors.';
  else if (roundedAverage >= 65) academicRemark = 'Commendable performance. Potential for distinction.';
  else if (roundedAverage < 45) academicRemark = 'Needs academic intervention and regular remedial support.';

  return {
    studentId: student.id,
    studentName: student.fullName,
    admissionNumber: student.admissionNumber,
    examId: exam.id,
    examName: exam.name,
    academicYear: exam.academicYear,
    term: exam.term,
    formStandard: exam.formStandard,
    streamName,
    combinationCode,
    subjects: subjectResults,
    totalScore,
    maxTotalScore,
    averageScore: roundedAverage,
    overallGrade: overallGradeCalc.grade,
    pointsTotal: divCalc.pointsTotal,
    division: divCalc.division,
    status: marksForStudent[0]?.status || 'DRAFT',
    isComplete,
    academicRemark,
  };
}

/**
 * Ranks all calculated student results in a class
 */
export function rankStudentResults(results: CalculatedStudentResult[]): CalculatedStudentResult[] {
  const sorted = [...results].sort((a, b) => b.averageScore - a.averageScore);
  const total = sorted.length;

  return sorted.map((res, index) => ({
    ...res,
    position: index + 1,
    totalStudentsInClass: total,
  }));
}
