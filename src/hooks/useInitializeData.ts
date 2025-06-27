
import { useEffect } from 'react';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultUsers = [
  {
    id: 'ana-silva',
    name: 'Ana Silva',
    email: 'ana@orakle.com',
    password: '123456',
    role: 'colaborador' as const,
    team: 'Equipe Alpha',
    ficticiousName: 'Phoenix',
    position: 'Analista Junior',
    points: 450
  },
  {
    id: 'carlos-santos',
    name: 'Carlos Santos', 
    email: 'carlos@orakle.com',
    password: '123456',
    role: 'supervisor' as const,
    team: 'Equipe Alpha',
    ficticiousName: 'Thunder',
    position: 'Supervisor de Operações',
    points: 780
  },
  {
    id: 'maria-oliveira',
    name: 'Maria Oliveira',
    email: 'maria@orakle.com', 
    password: '123456',
    role: 'administrador' as const,
    team: 'Gestão',
    ficticiousName: 'Oracle',
    position: 'Gerente de Operações',
    points: 1200
  }
];

const defaultRewards = [
  {
    id: 'mousepad-1',
    name: 'Mousepad Ergonômico',
    points: 200,
    description: 'Mousepad de alta qualidade com apoio para punho',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop'
  },
  {
    id: 'caneca-1',
    name: 'Caneca Personalizada',
    points: 150,
    description: 'Caneca térmica com logo da empresa',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop'
  },
  {
    id: 'voucher-1',
    name: 'Vale Alimentação R$ 50',
    points: 500,
    description: 'Vale para usar em restaurantes conveniados',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop'
  }
];

export const useInitializeData = () => {
  useEffect(() => {
    const initializeFirebaseData = async () => {
      try {
        console.log('Initializing Firebase data...');

        // Check if users already exist
        const usersSnapshot = await getDocs(collection(db, 'users'));
        if (usersSnapshot.empty) {
          console.log('Creating default users...');
          for (const userData of defaultUsers) {
            await setDoc(doc(db, 'users', userData.id), userData);
          }
          console.log('Default users created successfully');
        } else {
          console.log('Users already exist in database');
        }

        // Check if rewards already exist  
        const rewardsSnapshot = await getDocs(collection(db, 'rewards'));
        if (rewardsSnapshot.empty) {
          console.log('Creating default rewards...');
          for (const rewardData of defaultRewards) {
            await setDoc(doc(db, 'rewards', rewardData.id), rewardData);
          }
          console.log('Default rewards created successfully');
        } else {
          console.log('Rewards already exist in database');
        }

        console.log('Firebase initialization completed');
      } catch (error) {
        console.error('Error initializing Firebase data:', error);
      }
    };

    initializeFirebaseData();
  }, []);
};
