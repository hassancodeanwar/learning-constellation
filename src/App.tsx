import React, { useState, useEffect } from 'react';
import { AppView, StudentRecord } from './types';
import { initializeStorage, getAllStudents, saveStudent, generateStudentCode } from './utils/storage';
import { computeStudentScores, determineArchetype } from './data/constellationData';
import { StarfieldBackground } from './components/StarfieldBackground';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { StudentFormView } from './components/StudentFormView';
import { QuizView } from './components/QuizView';
import { ResultsView } from './components/ResultsView';
import { LookupView } from './components/LookupView';
import { TeacherGateView } from './components/TeacherGateView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { TeacherStudentModal } from './components/TeacherStudentModal';
import { AboutScalesModal } from './components/AboutScalesModal';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [currentStudent, setCurrentStudent] = useState<StudentRecord | null>(null);
  const [quizStudentData, setQuizStudentData] = useState<{ name: string; grade: string; className: string }>({
    name: '',
    grade: '',
    className: ''
  });
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [selectedTeacherStudent, setSelectedTeacherStudent] = useState<StudentRecord | null>(null);

  // Initialize on mount
  useEffect(() => {
    initializeStorage();
    refreshStudents();
  }, []);

  const refreshStudents = async () => {
    const list = await getAllStudents();
    setStudents(list);
  };

  const handleStartQuiz = (data: { name: string; grade: string; className: string }) => {
    setQuizStudentData(data);
    setCurrentView('quiz');
  };

  const handleFinishQuiz = (answers: Record<number, number>, reflection: string) => {
    const scores = computeStudentScores(answers);
    const archetype = determineArchetype(scores);
    const newRecord: StudentRecord = {
      id: generateStudentCode(quizStudentData.name),
      name: quizStudentData.name,
      grade: quizStudentData.grade,
      className: quizStudentData.className,
      answers,
      reflection,
      scores,
      archetype,
      timestamp: Date.now()
    };

    saveStudent(newRecord).then(() => refreshStudents());
    setCurrentStudent(newRecord);
    setCurrentView('results');
  };

  const handleStudentFoundInLookup = (student: StudentRecord) => {
    setCurrentStudent(student);
    setCurrentView('results');
  };

  const handleSelectTeacherStudent = (student: StudentRecord) => {
    setSelectedTeacherStudent(student);
    setCurrentView('teacherStudent');
  };

  const handleUpdateStudentFromTeacher = (updated: StudentRecord) => {
    setSelectedTeacherStudent(updated);
    refreshStudents();
  };

  const handleRetakeQuiz = () => {
    setCurrentView('studentForm');
  };

  return (
    <div className="min-h-screen bg-[#0b0d1e] text-[#f5f3ee] relative flex flex-col font-sans selection:bg-amber-400/30 selection:text-amber-200">
      {/* Dynamic Starfield Background Canvas */}
      <StarfieldBackground />

      {/* Main Celestial Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'teacherDashboard' && !isTeacherAuthenticated) {
            setCurrentView('teacherGate');
          } else {
            setCurrentView(view);
          }
        }}
        isTeacherAuthenticated={isTeacherAuthenticated}
      />

      {/* Main View Container */}
      <main className="flex-1 relative z-10">
        {currentView === 'home' && (
          <HomeView
            onNavigate={(view) => {
              if (view === 'teacherDashboard' && !isTeacherAuthenticated) {
                setCurrentView('teacherGate');
              } else {
                setCurrentView(view);
              }
            }}
          />
        )}

        {currentView === 'studentForm' && (
          <StudentFormView
            onNavigate={setCurrentView}
            onStartQuiz={handleStartQuiz}
            initialData={quizStudentData}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView
            studentData={quizStudentData}
            onFinishQuiz={handleFinishQuiz}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'results' && currentStudent && (
          <ResultsView
            student={currentStudent}
            onNavigate={setCurrentView}
            onRetake={handleRetakeQuiz}
          />
        )}

        {currentView === 'lookup' && (
          <LookupView
            onNavigate={setCurrentView}
            onStudentFound={handleStudentFoundInLookup}
          />
        )}

        {currentView === 'teacherGate' && (
          <TeacherGateView
            onNavigate={setCurrentView}
            onAuthenticated={() => {
              setIsTeacherAuthenticated(true);
              setCurrentView('teacherDashboard');
            }}
          />
        )}

        {currentView === 'teacherDashboard' && (
          <TeacherDashboardView
            students={students}
            onSelectStudent={handleSelectTeacherStudent}
            onNavigate={setCurrentView}
            onRefreshData={refreshStudents}
            onLogout={() => {
              setIsTeacherAuthenticated(false);
              setCurrentView('home');
            }}
          />
        )}

        {currentView === 'teacherStudent' && selectedTeacherStudent && (
          <TeacherStudentModal
            student={selectedTeacherStudent}
            onBack={() => setCurrentView('teacherDashboard')}
            onUpdateStudent={handleUpdateStudentFromTeacher}
          />
        )}

        {currentView === 'aboutScales' && (
          <AboutScalesModal onNavigate={setCurrentView} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#080916]/80 backdrop-blur-md py-6 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Learning Constellation • Grades 10–12 Psychometrics</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setCurrentView('aboutScales')}
              className="hover:text-teal-300 transition-colors cursor-pointer"
            >
              The 6 Scales
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('lookup')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Result Lookup
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (!isTeacherAuthenticated) setCurrentView('teacherGate');
                else setCurrentView('teacherDashboard');
              }}
              className="hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Teacher Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
