
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Gamepad2, Plus, Play, Star, BarChart, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useFirebaseAuth';
import { useToast } from '@/hooks/use-toast';

export const GamesPage: React.FC = () => {
  const { user, updateUserPoints } = useAuth();
  const { toast } = useToast();
  const [games, setGames] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [playingGame, setPlayingGame] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameRating, setGameRating] = useState(0);
  const [gameComment, setGameComment] = useState('');
  const [newGame, setNewGame] = useState({
    name: '',
    duration: 7,
    pointsPerAnswer: 5,
    participationPoints: 10,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  });

  const canManage = user?.role === 'supervisor' || user?.role === 'administrador';

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = () => {
    const storedGames = localStorage.getItem('orakle_games');
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    }
  };

  const handleCreateGame = () => {
    if (newGame.name && newGame.questions.length > 0) {
      const game = {
        id: Date.now().toString(),
        ...newGame,
        expirationDate: new Date(Date.now() + newGame.duration * 24 * 60 * 60 * 1000).toISOString(),
        type: 'Quiz',
        ratings: [],
        comments: []
      };
      
      const updatedGames = [...games, game];
      setGames(updatedGames);
      localStorage.setItem('orakle_games', JSON.stringify(updatedGames));
      
      setIsCreateModalOpen(false);
      setNewGame({
        name: '',
        duration: 7,
        pointsPerAnswer: 5,
        participationPoints: 10,
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
      });
      
      toast({
        title: "Quiz Criado!",
        description: `${game.name} foi criado com sucesso.`,
      });
    }
  };

  const handlePlayGame = (game: any) => {
    setPlayingGame(game);
    setCurrentQuestion(0);
    setScore(0);
    setGameFinished(false);
    setSelectedAnswer('');
    setGameRating(0);
    setGameComment('');
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (playingGame && selectedAnswer !== '') {
      const isCorrect = parseInt(selectedAnswer) === playingGame.questions[currentQuestion].correctAnswer;
      if (isCorrect) {
        setScore(score + playingGame.pointsPerAnswer);
      }
      
      if (currentQuestion + 1 < playingGame.questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
      } else {
        // Game finished
        const totalPoints = score + (parseInt(selectedAnswer) === playingGame.questions[currentQuestion].correctAnswer ? playingGame.pointsPerAnswer : 0) + playingGame.participationPoints;
        setScore(totalPoints);
        setGameFinished(true);
        
        // Update user points
        if (user) {
          updateUserPoints(user.points + totalPoints);
          
          // Add to points history
          const history = JSON.parse(localStorage.getItem('orakle_points_history') || '[]');
          history.push({
            id: Date.now().toString(),
            userId: user.id,
            points: totalPoints,
            type: 'gain',
            description: `Participação no ${playingGame.name}`,
            date: new Date().toISOString()
          });
          localStorage.setItem('orakle_points_history', JSON.stringify(history));
        }
      }
    }
  };

  const handleGameRating = () => {
    if (playingGame && gameRating > 0) {
      const updatedGames = games.map(g => {
        if (g.id === playingGame.id) {
          return {
            ...g,
            ratings: [...(g.ratings || []), gameRating],
            comments: gameComment ? [...(g.comments || []), gameComment] : g.comments || []
          };
        }
        return g;
      });
      
      setGames(updatedGames);
      localStorage.setItem('orakle_games', JSON.stringify(updatedGames));
      
      setPlayingGame(null);
      toast({
        title: "Obrigado pela avaliação!",
        description: "Sua avaliação foi registrada.",
      });
    }
  };

  const addQuestion = () => {
    setNewGame({
      ...newGame,
      questions: [...newGame.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = newGame.questions.map((q, i) => {
      if (i === index) {
        if (field === 'options') {
          return { ...q, options: value };
        }
        return { ...q, [field]: value };
      }
      return q;
    });
    setNewGame({ ...newGame, questions: updatedQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = newGame.questions.map((q, i) => {
      if (i === questionIndex) {
        const updatedOptions = [...q.options];
        updatedOptions[optionIndex] = value;
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setNewGame({ ...newGame, questions: updatedQuestions });
  };

  const isGameExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date();
  };

  const getAverageRating = (ratings: number[]) => {
    if (!ratings || ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Jogos</h1>
          <p className="text-slate-600 mt-1">Participe de quizzes e ganhe pontos</p>
        </div>
        
        {canManage && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4 mr-2" />
            Criar Quiz
          </Button>
        )}
      </div>

      {/* Lista de Jogos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-blue-600">
                  {game.type}
                </Badge>
                {isGameExpired(game.expirationDate) && (
                  <Badge variant="destructive">Expirado</Badge>
                )}
              </div>
              <CardTitle className="text-lg">{game.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Expira em: {new Date(game.expirationDate).toLocaleDateString()}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Pontos por acerto: {game.pointsPerAnswer}</span>
                  <span>Participação: +{game.participationPoints}</span>
                </div>
                
                {canManage && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Star className="h-4 w-4 mr-1" />
                    Média: {getAverageRating(game.ratings).toFixed(1)}
                    <BarChart className="h-4 w-4 ml-3 mr-1" />
                    {game.ratings?.length || 0} avaliações
                  </div>
                )}
                
                <Button
                  onClick={() => handlePlayGame(game)}
                  disabled={isGameExpired(game.expirationDate)}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Jogar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Gamepad2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Nenhum jogo disponível
            </h3>
            <p className="text-slate-500">
              {canManage ? 'Crie o primeiro quiz!' : 'Aguarde novos jogos serem criados.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Criar Quiz */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Quiz</Label>
                <Input
                  id="name"
                  value={newGame.name}
                  onChange={(e) => setNewGame({...newGame, name: e.target.value})}
                  placeholder="Ex: Quiz de Segurança"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duração (dias)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newGame.duration}
                  onChange={(e) => setNewGame({...newGame, duration: parseInt(e.target.value) || 7})}
                />
              </div>
              
              <div>
                <Label htmlFor="pointsPerAnswer">Pontos por Acerto</Label>
                <Input
                  id="pointsPerAnswer"
                  type="number"
                  value={newGame.pointsPerAnswer}
                  onChange={(e) => setNewGame({...newGame, pointsPerAnswer: parseInt(e.target.value) || 5})}
                />
              </div>
              
              <div>
                <Label htmlFor="participationPoints">Pontos de Participação</Label>
                <Input
                  id="participationPoints"
                  type="number"
                  value={newGame.participationPoints}
                  onChange={(e) => setNewGame({...newGame, participationPoints: parseInt(e.target.value) || 10})}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Perguntas</Label>
                <Button onClick={addQuestion} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              </div>
              
              {newGame.questions.map((question, qIndex) => (
                <Card key={qIndex} className="p-4 mb-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Pergunta {qIndex + 1}</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        placeholder="Digite a pergunta..."
                      />
                    </div>
                    
                    <div>
                      <Label>Opções de Resposta</Label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Opção ${oIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateGame}>
                Criar Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Jogar */}
      <Dialog open={!!playingGame} onOpenChange={() => setPlayingGame(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{playingGame?.name}</DialogTitle>
          </DialogHeader>
          
          {!gameFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  Pergunta {currentQuestion + 1} de {playingGame?.questions.length}
                </Badge>
                <Badge variant="outline" className="text-blue-600">
                  Pontos: {score}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {playingGame?.questions[currentQuestion]?.question}
                </h3>
                
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  {playingGame?.questions[currentQuestion]?.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === ''}
                className="w-full"
              >
                {currentQuestion + 1 < (playingGame?.questions.length || 0) ? 'Próxima Pergunta' : 'Finalizar Quiz'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Parabéns!</h3>
                <p className="text-lg">Você ganhou {score} pontos!</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Avalie este quiz (1-5 estrelas)</Label>
                  <div className="flex justify-center space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer ${
                          star <= gameRating ? 'text-yellow-500 fill-current' : 'text-slate-300'
                        }`}
                        onClick={() => setGameRating(star)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Comentário (opcional)</Label>
                  <Textarea
                    value={gameComment}
                    onChange={(e) => setGameComment(e.target.value)}
                    placeholder="Deixe um comentário sobre o quiz..."
                  />
                </div>
              </div>
              
              <Button
                onClick={handleGameRating}
                disabled={gameRating === 0}
                className="w-full"
              >
                Enviar Avaliação
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
