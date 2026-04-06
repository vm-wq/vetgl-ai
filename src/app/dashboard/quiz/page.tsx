'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  quizQuestions,
  getQuestionsBySpecialty,
  getSpecialties,
  QuizQuestion,
  getQuestionsByDifficulty,
  calculatePoints,
} from '@/lib/data/quiz-questions';
import { QuizScore } from '@/types';
import {
  Play,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookOpen,
  Zap,
  Award,
  Star,
  Target,
  Flame,
} from 'lucide-react';

type QuizState = 'selection' | 'quiz' | 'results' | 'stats';
type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  badges: Badge[];
}

export default function QuizPage() {
  const supabase = createClient();
  const [state, setState] = useState<QuizState>('selection');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('mixed');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [userStats, setUserStats] = useState<UserStats>({
    totalXP: 0,
    level: 1,
    streak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    badges: [],
  });
  const [xpGained, setXpGained] = useState(0);

  // Initialize user
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchLeaderboard();
        initializeUserStats();
      }
    }
    getUser();
  }, []);

  function initializeUserStats() {
    // In production, this would be fetched from database
    const defaultBadges: Badge[] = [
      {
        id: 'first-quiz',
        name: 'Primeira Rodada',
        description: 'Complete seu primeiro quiz',
        icon: '🎯',
        unlocked: false,
      },
      {
        id: 'perfect-emergency',
        name: 'Expert em Emergência',
        description: 'Acerte 100% em Emergência',
        icon: '🚨',
        unlocked: false,
      },
      {
        id: 'pharma-master',
        name: 'Mestre Farmacologista',
        description: 'Acerte 100% em Farmacologia',
        icon: '💊',
        unlocked: false,
      },
      {
        id: 'week-streak',
        name: 'Streak de 7 Dias',
        description: 'Faça quiz por 7 dias seguidos',
        icon: '🔥',
        unlocked: false,
      },
      {
        id: 'month-streak',
        name: 'Streak de 30 Dias',
        description: 'Faça quiz por 30 dias seguidos',
        icon: '💥',
        unlocked: false,
      },
      {
        id: 'hundred-questions',
        name: '100 Perguntas',
        description: 'Responda 100 perguntas',
        icon: '⭐',
        unlocked: false,
      },
    ];
    setUserStats((prev) => ({ ...prev, badges: defaultBadges }));
  }

  // Timer
  useEffect(() => {
    if (state !== 'quiz' || isAnswered) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, isAnswered]);

  function handleTimeout() {
    setSelectedAnswers([...selectedAnswers, -1]);
    setIsAnswered(true);
  }

  async function fetchLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }

  function startQuiz(specialty: string, difficulty: Difficulty) {
    let qs: QuizQuestion[] = getQuestionsBySpecialty(specialty);

    if (difficulty !== 'mixed') {
      qs = qs.filter((q) => q.difficulty === difficulty);
    }

    // Shuffle questions
    qs = qs.sort(() => Math.random() - 0.5).slice(0, 10);

    setSelectedSpecialty(specialty);
    setSelectedDifficulty(difficulty);
    setQuestions(qs);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeRemaining(30);
    setIsAnswered(false);
    setState('quiz');
  }

  function handleAnswer(answerIndex: number) {
    if (isAnswered) return;

    setSelectedAnswers([...selectedAnswers, answerIndex]);
    setIsAnswered(true);
  }

  function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(30);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  }

  async function finishQuiz() {
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correct
    ).length;

    // Calculate XP
    let earnedXP = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        earnedXP += calculatePoints(questions[index].difficulty);
      }
    });

    // Streak bonus
    if (correctCount === questions.length) {
      earnedXP += 50; // Perfect score bonus
    }

    setXpGained(earnedXP);

    // Update stats
    const newStats: UserStats = {
      ...userStats,
      totalXP: userStats.totalXP + earnedXP,
      level: Math.floor((userStats.totalXP + earnedXP) / 500) + 1,
      questionsAnswered: userStats.questionsAnswered + questions.length,
      correctAnswers: userStats.correctAnswers + correctCount,
      streak: correctCount === questions.length ? userStats.streak + 1 : 0,
    };
    setUserStats(newStats);

    // Save score
    if (userId) {
      try {
        await supabase.from('quiz_scores').insert([
          {
            user_id: userId,
            specialty: selectedSpecialty,
            score: correctCount,
            total: questions.length,
            xp_earned: earnedXP,
            difficulty: selectedDifficulty,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }

    setState('results');
  }

  function resetQuiz() {
    setState('selection');
    setSelectedSpecialty('');
    setSelectedDifficulty('mixed');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeRemaining(30);
    setIsAnswered(false);
  }

  const specialties = getSpecialties();
  const currentQuestion =
    state === 'quiz' ? questions[currentQuestionIndex] : undefined;
  const correctCount = selectedAnswers.filter(
    (answer, index) => answer === questions[index]?.correct
  ).length;
  const scorePercent =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = scorePercent >= 70;

  function getLevelName(level: number): string {
    if (level <= 1) return 'Estudante';
    if (level <= 3) return 'Residente';
    if (level <= 5) return 'Veterinário';
    if (level <= 8) return 'Especialista';
    return 'Professor';
  }

  function getLevelColor(level: number): string {
    if (level <= 1) return 'text-blue-400';
    if (level <= 3) return 'text-green-400';
    if (level <= 5) return 'text-purple-400';
    if (level <= 8) return 'text-orange-400';
    return 'text-red-400';
  }

  const xpToNextLevel = (userStats.level * 500) - userStats.totalXP;
  const xpInCurrentLevel = userStats.totalXP % 500;

  if (state === 'selection') {
    return (
      <div className="h-full w-full flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Header */}
        <div className="border-b p-6" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Quiz Veterinário
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Teste seus conhecimentos em diferentes especialidades
              </p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getLevelColor(userStats.level)}`}>
                Lvl {userStats.level}
              </div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                {getLevelName(userStats.level)}
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs">Total XP</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {userStats.totalXP}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs">Streak</p>
              <p className="text-2xl font-bold flex items-center gap-1" style={{ color: '#ef4444' }}>
                {userStats.streak} <Flame size={20} />
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs">Respostas</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {userStats.questionsAnswered}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs">Taxa Acerto</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {userStats.questionsAnswered > 0
                  ? Math.round((userStats.correctAnswers / userStats.questionsAnswered) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>{xpInCurrentLevel} XP</span>
              <span>{xpToNextLevel} para próximo nível</span>
            </div>
            <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${(xpInCurrentLevel / 500) * 100}%`,
                  backgroundColor: 'var(--accent)',
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Specialties */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BookOpen size={24} /> Especialidades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              {specialties.map((specialty) => {
                const count = getQuestionsBySpecialty(specialty).length;
                return (
                  <div
                    key={specialty}
                    className="p-6 rounded-lg border transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-primary)',
                    }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {specialty}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4">
                      {count} questões disponíveis
                    </p>

                    {/* Difficulty selector */}
                    <div className="flex gap-2 mb-4">
                      {(['easy', 'medium', 'hard', 'mixed'] as const).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => startQuiz(specialty, diff)}
                          className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            diff === 'easy'
                              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                              : diff === 'medium'
                                ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                                : diff === 'hard'
                                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                  : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                          }`}>
                          {diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Médio' : diff === 'hard' ? 'Difícil' : 'Misto'}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => startQuiz(specialty, 'mixed')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--accent)' }}>
                      <Play className="w-5 h-5" />
                      Iniciar Quiz
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          <div className="mb-12 max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Award size={24} /> Conquistas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {userStats.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg text-center transition-all ${
                    badge.unlocked
                      ? 'border-2'
                      : 'opacity-50'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: badge.unlocked ? 'var(--accent)' : 'var(--border-primary)',
                    border: badge.unlocked ? '2px solid' : '1px solid',
                  }}>
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {badge.name}
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Ranking
              </h2>
            </div>

            {scores.length === 0 ? (
              <div className="p-6 rounded-lg text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Nenhum resultado ainda. Comece um quiz para aparecer no ranking!
                </p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <tr>
                        <th
                          className="px-4 py-3 text-left font-semibold text-sm"
                          style={{ color: 'var(--text-primary)' }}>
                          Pos.
                        </th>
                        <th
                          className="px-4 py-3 text-left font-semibold text-sm"
                          style={{ color: 'var(--text-primary)' }}>
                          Especialidade
                        </th>
                        <th
                          className="px-4 py-3 text-left font-semibold text-sm"
                          style={{ color: 'var(--text-primary)' }}>
                          Pontuação
                        </th>
                        <th
                          className="px-4 py-3 text-left font-semibold text-sm"
                          style={{ color: 'var(--text-primary)' }}>
                          XP
                        </th>
                        <th
                          className="px-4 py-3 text-left font-semibold text-sm"
                          style={{ color: 'var(--text-primary)' }}>
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.slice(0, 10).map((score, index) => (
                        <tr
                          key={score.id}
                          style={{ borderBottomColor: 'var(--border-primary)', borderBottom: '1px solid' }}
                          className="hover:opacity-80 transition-opacity">
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--accent)' }}>
                            #{index + 1}
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>
                            {score.specialty}
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                (score.score / score.total) * 100 >= 70
                                  ? 'bg-green-600/20 text-green-400'
                                  : 'bg-red-600/20 text-red-400'
                              }`}>
                              {score.score}/{score.total} ({Math.round((score.score / score.total) * 100)}%)
                            </span>
                          </td>
                          <td className="px-4 py-3 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                            <Zap size={16} /> {score.xp_earned || 0}
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(score.created_at).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'quiz' && currentQuestion) {
    const selectedAnswer = selectedAnswers[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;

    return (
      <div className="h-full w-full flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Progress bar */}
        <div className="border-b p-4" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {selectedSpecialty} - {selectedDifficulty === 'easy' ? 'Fácil' : selectedDifficulty === 'medium' ? 'Médio' : selectedDifficulty === 'hard' ? 'Difícil' : 'Misto'}
            </h2>
            <span style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                backgroundColor: 'var(--accent)',
              }}
            ></div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Timer */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                {currentQuestion.question}
              </h3>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${
                  timeRemaining <= 10 ? 'bg-red-600/20 text-red-400' : 'bg-blue-600/20 text-blue-400'
                }`}>
                <Clock className="w-5 h-5" />
                {timeRemaining}s
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => {
                const selected = selectedAnswer === index;
                const correct = index === currentQuestion.correct;
                let bgColor = 'var(--bg-secondary)';
                let borderColor = 'var(--border-primary)';
                let textColor = 'var(--text-primary)';

                if (isAnswered) {
                  if (correct) {
                    bgColor = '#15803d30';
                    borderColor = '#22c55e';
                    textColor = '#86efac';
                  } else if (selected && !correct) {
                    bgColor = '#7f1d1d30';
                    borderColor = '#ef4444';
                    textColor = '#fca5a5';
                  }
                } else if (selected) {
                  bgColor = 'var(--accent)20';
                  borderColor = 'var(--accent)';
                  textColor = 'var(--text-primary)';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={isAnswered}
                    className="w-full p-4 rounded-lg border transition-all text-left flex items-start gap-4"
                    style={{
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                      borderWidth: '1px',
                      color: textColor,
                    }}>
                    <div className="flex-1">
                      <p>{option}</p>
                    </div>
                    {isAnswered && (
                      <div className="flex-shrink-0 mt-1">
                        {correct ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : selected ? (
                          <XCircle className="w-6 h-6 text-red-400" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div className="p-4 rounded-lg mb-8" style={{ backgroundColor: '#3b82f620', borderLeft: '4px solid #3b82f6' }}>
                <p className="font-semibold mb-2" style={{ color: '#60a5fa' }}>
                  Explicação:
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>{currentQuestion.explanation}</p>
                <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                  Dificuldade: {currentQuestion.difficulty === 'easy' ? 'Fácil (+5 XP)' : currentQuestion.difficulty === 'medium' ? 'Média (+10 XP)' : 'Difícil (+20 XP)'}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={goToNextQuestion}
                className="w-full px-4 py-3 rounded-lg text-white transition-opacity hover:opacity-90 font-medium"
                style={{ backgroundColor: 'var(--accent)' }}>
                {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'results') {
    return (
      <div className="h-full w-full flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
          <div className="text-center max-w-md">
            {/* Score circle with animation */}
            <div
              className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl font-bold animate-bounce"
              style={{
                backgroundColor: passed ? '#15803d30' : '#7f1d1d30',
                color: passed ? '#86efac' : '#fca5a5',
              }}>
              {scorePercent}%
            </div>

            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {passed ? '🎉 Parabéns!' : '💪 Quase lá!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-8">
              {passed
                ? 'Você passou no quiz com sucesso!'
                : 'Estude mais e tente novamente. Você precisa de 70% para passar.'}
            </p>

            {/* XP Gained - Floating animation */}
            <div
              className="mb-8 p-4 rounded-lg text-center animate-bounce"
              style={{ backgroundColor: 'var(--accent)20', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ color: 'var(--accent)' }} className="text-lg font-bold">
                +{xpGained} XP Ganhos!
              </p>
            </div>

            {/* Results breakdown */}
            <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-1">
                    Corretas
                  </p>
                  <p className="text-2xl font-bold text-green-400">{correctCount}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-1">
                    Incorretas
                  </p>
                  <p className="text-2xl font-bold text-red-400">
                    {questions.length - correctCount}
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-1">
                    Taxa
                  </p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {scorePercent}%
                  </p>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                Especialidade: {selectedSpecialty}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={resetQuiz}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white transition-opacity hover:opacity-90 font-medium"
                style={{ backgroundColor: 'var(--accent)' }}>
                <RotateCcw className="w-5 h-5" />
                Fazer Outro Quiz
              </button>
              <button
                onClick={() => setState('selection')}
                className="w-full px-4 py-3 rounded-lg transition-opacity hover:opacity-90 font-medium"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}>
                Voltar à Seleção
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
