
import { useEffect } from 'react';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useInitializeData = () => {
  useEffect(() => {
    initializeFirebaseData();
  }, []);

  const initializeFirebaseData = async () => {
    try {
      // Check if users collection exists
      const usersSnapshot = await getDocs(collection(db, 'users'));
      if (usersSnapshot.empty) {
        await initializeUsers();
      }

      // Check if announcements collection exists
      const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
      if (announcementsSnapshot.empty) {
        await initializeAnnouncements();
      }

      // Check if rewards collection exists
      const rewardsSnapshot = await getDocs(collection(db, 'rewards'));
      if (rewardsSnapshot.empty) {
        await initializeRewards();
      }

      // Check if games collection exists
      const gamesSnapshot = await getDocs(collection(db, 'games'));
      if (gamesSnapshot.empty) {
        await initializeGames();
      }

      // Check if knowledge collection exists
      const knowledgeSnapshot = await getDocs(collection(db, 'knowledge'));
      if (knowledgeSnapshot.empty) {
        await initializeKnowledge();
      }

      // Check if alignments collection exists
      const alignmentsSnapshot = await getDocs(collection(db, 'alignments'));
      if (alignmentsSnapshot.empty) {
        await initializeAlignments();
      }
    } catch (error) {
      console.error('Error initializing Firebase data:', error);
    }
  };

  const initializeUsers = async () => {
    const users = [
      {
        name: 'Ana Silva',
        email: 'ana@orakle.com',
        role: 'colaborador',
        team: 'Vendas',
        ficticiousName: 'Estrela Dourada',
        position: 'Vendedora',
        points: 1250
      },
      {
        name: 'Carlos Santos',
        email: 'carlos@orakle.com',
        role: 'supervisor',
        team: 'Vendas',
        ficticiousName: 'Líder Supremo',
        position: 'Supervisor de Vendas',
        points: 2100
      },
      {
        name: 'Maria Oliveira',
        email: 'maria@orakle.com',
        role: 'administrador',
        team: 'Administração',
        ficticiousName: 'Comando Central',
        position: 'Gerente Geral',
        points: 3500
      }
    ];

    for (const user of users) {
      await setDoc(doc(db, 'users', `user_${user.email.split('@')[0]}`), user);
    }
  };

  const initializeAnnouncements = async () => {
    const announcements = [
      {
        title: 'Bem-vindos ao Orakle!',
        content: 'Nossa nova plataforma de gestão está no ar. Explore todas as funcionalidades!',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
        date: new Date().toISOString()
      },
      {
        title: 'Meta do Trimestre',
        content: 'Estamos próximos de alcançar nossa meta! Continue o excelente trabalho.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        date: new Date().toISOString()
      }
    ];

    for (const announcement of announcements) {
      await setDoc(doc(db, 'announcements', `announcement_${Date.now()}_${Math.random()}`), announcement);
    }
  };

  const initializeRewards = async () => {
    const rewards = [
      {
        name: 'Mousepad Ergonômico',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop',
        points: 500,
        description: 'Mousepad ergonômico para maior conforto'
      },
      {
        name: 'Fone de Ouvido Bluetooth',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=200&fit=crop',
        points: 1200,
        description: 'Fone de ouvido sem fio de alta qualidade'
      },
      {
        name: 'Voucher Almoço',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop',
        points: 800,
        description: 'Voucher para almoço em restaurante local'
      }
    ];

    for (const reward of rewards) {
      await setDoc(doc(db, 'rewards', `reward_${Date.now()}_${Math.random()}`), reward);
    }
  };

  const initializeGames = async () => {
    const games = [
      {
        name: 'Quiz de Segurança no Trabalho',
        type: 'Quiz',
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        pointsPerAnswer: 5,
        participationPoints: 10,
        questions: [
          {
            question: 'Qual é a primeira coisa a fazer em caso de incêndio?',
            options: ['Ligar para bombeiros', 'Usar extintor', 'Evacuar área', 'Gritar por ajuda'],
            correctAnswer: 2
          },
          {
            question: 'Quantas horas de trabalho contínuo são recomendadas antes de uma pausa?',
            options: ['1 hora', '2 horas', '3 horas', '4 horas'],
            correctAnswer: 1
          }
        ],
        ratings: [],
        comments: []
      }
    ];

    for (const game of games) {
      await setDoc(doc(db, 'games', `game_${Date.now()}_${Math.random()}`), game);
    }
  };

  const initializeKnowledge = async () => {
    const knowledge = [
      {
        keywords: ['férias', 'pedir férias', 'solicitar férias'],
        answer: 'Para solicitar férias, acesse o menu "Solicitações", preencha o formulário com as datas desejadas e aguarde a aprovação do seu supervisor.'
      },
      {
        keywords: ['pontos', 'ganhar pontos', 'como ganhar'],
        answer: 'Você pode ganhar pontos participando de quizzes, tendo bom desempenho e através de reconhecimento manual do seu supervisor.'
      }
    ];

    for (const item of knowledge) {
      await setDoc(doc(db, 'knowledge', `knowledge_${Date.now()}_${Math.random()}`), item);
    }
  };

  const initializeAlignments = async () => {
    const alignments = [
      'Reunião de equipe toda segunda-feira às 9h',
      'Metas do mês: Foco em qualidade e produtividade',
      'Lembrete: Atualizar relatórios semanais até sexta-feira'
    ];

    for (const alignment of alignments) {
      await setDoc(doc(db, 'alignments', `alignment_${Date.now()}_${Math.random()}`), {
        text: alignment
      });
    }
  };
};
