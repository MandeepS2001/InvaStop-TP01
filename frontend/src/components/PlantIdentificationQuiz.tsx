import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, XCircle, Trophy, Star, Target, Leaf } from 'lucide-react';

interface QuizQuestion {
  id: number;
  image: string;
  imageAlternates?: string[];
  speciesName: string;
  scientificName: string;
  isInvasive: boolean;
  description: string;
  impact: string;
  reference?: string;
  correctText: string;
  wrongText: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface BackendQuizRecord {
  id: number;
  speciesName: string;
  nature: 'Invasive' | 'Native';
  wrongExplain: string;
  correctExplain: string;
  briefExplanation: string;
  reference: string;
  createdAt: string;
}


const PlantIdentificationQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  // Remote quiz questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const imageCandidates: Record<string, string[]> = {
    // Invasive (existing lowercase directory)
    'Lantana': ['/top10/Lantana.png'],
    'Bitou Bush': ['/top10/BitouBush.png'],
    'Gamba Grass': ['/top10/GambaGrass.png'],
    'Gorse': ['/top10/Gorse.png'],
    'Buffel Grass': ['/top10/BuffelGrass.png'],
    // Native (new capitalized Top10 images provided by user)
    'Eucalyptus': ['/Top10/Eucalyptus.jpg', '/Top10/Eucalyptus.png', '/top10/Tree.png'],
    'Acacia/Wattle': [
      '/Top10/Acacia/Wattle.jpg',
      '/Top10/Acacia-Wattle.jpg',
      '/Top10/Acacia_Wattle.jpg',
      '/Top10/Acacia%2FWattle.jpg',
      '/Top10/AcaciaWattle.jpg'
    ],
    'Banksia': ['/Top10/Banksia.jpg'],
    'Melaleuca': ['/Top10/Melaleuca.jpg'],
    'Grevillea': ['/Top10/Grevillea.png']
  };

  const toQuizQuestion = (r: BackendQuizRecord): QuizQuestion => {
    const candidates = imageCandidates[r.speciesName] || ['/top10/Lantana.png'];
    const img = candidates[0];
    return {
      id: r.id,
      image: img,
      imageAlternates: candidates.slice(1),
      speciesName: r.speciesName,
      scientificName: r.speciesName,
      isInvasive: r.nature === 'Invasive',
      description: r.briefExplanation,
      impact: r.correctExplain,
      reference: r.reference,
      correctText: r.correctExplain,
      wrongText: r.wrongExplain,
      difficulty: 'easy'
    };
  };

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    api.get<BackendQuizRecord[]>('/quiz/records')
      .then(res => {
        const mapped = res.data.map(toQuizQuestion);
        setQuestions(mapped);
      })
      .catch(err => {
        setLoadError('Failed to load quiz data');
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const reloadQuestions = () => {
    setLoading(true);
    setLoadError(null);
    api.get<BackendQuizRecord[]>('/quiz/records')
      .then(res => {
        const mapped = res.data.map(toQuizQuestion);
        setQuestions(mapped);
      })
      .catch(() => setLoadError('Failed to load quiz data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (quizStarted && startTime && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [quizStarted, startTime, quizCompleted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    setCurrentQuestion(0);
    setScore(0);
    setTimeSpent(0);
    setQuizCompleted(false);
    setAchievements([]);
    const source = questions.length > 0 ? questions : [];
    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, 6);
    setShuffledQuestions(shuffled);
  };

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const nextQuestion = () => {
    const q = shuffledQuestions[currentQuestion];
    const isCorrect = selectedAnswer === q.isInvasive;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Check for achievements with context
    checkAchievements(isCorrect, q);

    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      setStartTime(null);

      // End-of-quiz achievements
      const total = shuffledQuestions.length;
      const finalScore = isCorrect ? score + 1 : score;
      const endAchievements: string[] = [];
      if (finalScore === total) endAchievements.push('Perfect Score');
      if (timeSpent <= 20 && finalScore >= Math.ceil(total * 0.6)) endAchievements.push('Quick Thinker');
      endAchievements.forEach((a) => {
        if (!achievements.includes(a)) setAchievements(prev => [...prev, a]);
      });
    }
  };

  const checkAchievements = (wasCorrect?: boolean, questionParam?: QuizQuestion) => {
    const newAchievements: string[] = [];
    
    if (score === 0 && currentQuestion === 0) {
      newAchievements.push('First Steps');
    }
    if (score >= 3 && currentQuestion === 2) {
      newAchievements.push('Getting the Hang of It');
    }
    if (score >= 5 && currentQuestion === 4) {
      newAchievements.push('Plant Expert');
    }
    if (timeSpent < 30 && currentQuestion === 2) {
      newAchievements.push('Speed Demon');
    }

    // Contextual badges
    if (typeof wasCorrect === 'boolean' && questionParam) {
      if (wasCorrect && questionParam.isInvasive) {
        newAchievements.push('Invasive Hunter');
      }
      if (wasCorrect && !questionParam.isInvasive) {
        newAchievements.push('Native Guardian');
      }
    }

    newAchievements.forEach(achievement => {
      if (!achievements.includes(achievement)) {
        setAchievements(prev => [...prev, achievement]);
        setShowAchievement(achievement);
        setTimeout(() => setShowAchievement(null), 3000);
      }
    });
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeSpent(0);
    setStartTime(null);
    setAchievements([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    if (percentage >= 90) return { message: "Outstanding! You're a true plant expert!", color: "text-green-600" };
    if (percentage >= 70) return { message: "Great job! You have good plant identification skills!", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Good effort! Keep learning to improve your skills!", color: "text-yellow-600" };
    return { message: "Keep practicing! Every expert was once a beginner!", color: "text-red-600" };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Plant Identification Challenge</h2>
            <p className="text-lg text-gray-600 mb-6">
              Test your ability to identify invasive plants! Can you tell which plants should be removed to protect our environment?
            </p>
          </div>

          {loading && (
            <div className="text-center text-gray-600 mb-6">Loading quiz data…</div>
          )}
          {loadError && (
            <div className="text-center text-red-600 mb-6">{loadError}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-bold text-green-800">6 Questions</h3>
              </div>
              <p className="text-green-700 text-sm">Identify invasive vs native plants</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-3">
                <Trophy className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-bold text-blue-800">Earn Achievements</h3>
              </div>
              <p className="text-blue-700 text-sm">Unlock badges as you progress</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center mb-3">
                <Star className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="font-bold text-purple-800">Build Confidence</h3>
              </div>
              <p className="text-purple-700 text-sm">Learn to protect your land</p>
            </div>
          </div>

          <div className="text-center space-x-3">
            <button
              onClick={startQuiz}
              disabled={loading || questions.length === 0}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 shadow-lg ${loading || questions.length === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white transform hover:scale-105'}`}
            >
              Start Challenge →
            </button>
            <button
              onClick={reloadQuestions}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-500 shadow-lg hover:shadow-xl"
            >
              Reload Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const scoreMessage = getScoreMessage();
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
            <p className={`text-xl font-semibold ${scoreMessage.color} mb-6`}>
              {scoreMessage.message}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{score}/{shuffledQuestions.length}</div>
              <div className="text-green-800 font-semibold">Correct Answers</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{formatTime(timeSpent)}</div>
              <div className="text-blue-800 font-semibold">Time Taken</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{achievements.length}</div>
              <div className="text-purple-800 font-semibold">Achievements</div>
            </div>
          </div>

          {achievements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🏆 Achievements Unlocked</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-md">
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center space-x-4">
            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/insights'}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Did You Know?
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-100 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No quiz questions available</h2>
          <p className="text-gray-700 mb-6">Please reload quiz data and try again.</p>
          <button
            onClick={() => { setQuizStarted(false); reloadQuestions(); }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const question = shuffledQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.isInvasive;
  const explanationText = (() => {
    // For invasive species: Yes=correct -> correctText; No=wrong -> wrongText
    // For native species: No=correct -> correctText; Yes=wrong -> wrongText
    if (question.isInvasive) {
      return selectedAnswer ? question.correctText : question.wrongText;
    }
    return selectedAnswer ? question.wrongText : question.correctText;
  })();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            <span className="font-bold">Achievement Unlocked: {showAchievement}!</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">Question {currentQuestion + 1} of {shuffledQuestions.length}</span>
            <span className="text-sm font-semibold text-gray-600">Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Is this plant invasive and should be removed?
          </h2>
        </div>

        {/* Plant Image and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <img 
              src={question.image} 
              alt={question.speciesName}
              className="w-full h-64 object-cover rounded-lg mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const alts = (question.imageAlternates || []);
                if (alts.length > 0) {
                  const next = alts[0];
                  target.src = next;
                  const newAlts = alts.slice(1);
                  setShuffledQuestions(prev => {
                    const list = [...prev];
                    list[currentQuestion] = { ...question, imageAlternates: newAlts };
                    return list;
                  });
                } else {
                  target.src = '/top10/Lantana.png'; // neutral final fallback
                }
              }}
            />
              <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{question.speciesName}</h3>
              <p className="text-gray-600 italic mb-3">{question.scientificName}</p>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-gray-700 text-sm mb-2">{question.description}</p>
                {question.reference && (
                  <p className="text-gray-600 text-xs">Source: {question.reference}</p>
                )}
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {!showResult ? (
              <>
                <button
                  onClick={() => handleAnswer(true)}
                  className="w-full bg-red-100 hover:bg-red-200 border-2 border-red-300 hover:border-red-400 text-red-800 p-6 rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <XCircle className="h-6 w-6 mr-3" />
                    <span>Yes, Remove It</span>
                  </div>
                  <p className="text-sm mt-2 opacity-80">This plant is invasive and harmful</p>
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="w-full bg-green-100 hover:bg-green-200 border-2 border-green-300 hover:border-green-400 text-green-800 p-6 rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 mr-3" />
                    <span>No, Keep It</span>
                  </div>
                  <p className="text-sm mt-2 opacity-80">This plant is native and beneficial</p>
                </button>
              </>
            ) : (
              <div className={`p-6 rounded-xl border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center mb-4">
                  {isCorrect ? (
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600 mr-3" />
                  )}
                  <span className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Explanation</p>
                  <p className="text-gray-700 text-sm mb-2">{explanationText}</p>
                  <p className="text-gray-600 text-xs">{question.description}</p>
                </div>
                <button
                  onClick={nextQuestion}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-xl font-bold transition-all duration-500 transform hover:scale-105"
                >
                  {currentQuestion < shuffledQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="inline-flex items-center bg-gray-100 px-4 py-2 rounded-full">
            <Leaf className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Time: {formatTime(timeSpent)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantIdentificationQuiz;
