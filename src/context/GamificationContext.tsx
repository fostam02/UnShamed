import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { Trophy, Star, Award, Zap } from 'lucide-react';

// Define types for gamification
export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: 'trophy' | 'star' | 'award' | 'zap';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GamificationData {
  points: number;
  level: number;
  achievements: Achievement[];
  weeklyStreak: number;
  lastWeeklyLogin?: string;
  lastActivityDate?: string;
}

interface GamificationContextType {
  gamificationData: GamificationData;
  addPoints: (points: number, reason?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;
}

// Default achievements with weekly login streaks instead of daily
const defaultAchievements: Achievement[] = [
  {
    id: 'first-state',
    title: 'First Steps',
    description: 'Add your first state profile',
    points: 50,
    icon: 'trophy',
    unlocked: false
  },
  {
    id: 'complete-profile',
    title: 'Identity Established',
    description: 'Complete your personal profile',
    points: 30,
    icon: 'star',
    unlocked: false
  },
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Complete 5 compliance tasks',
    points: 100,
    icon: 'award',
    unlocked: false
  },
  {
    id: 'document-collector',
    title: 'Document Collector',
    description: 'Upload 3 documents',
    points: 75,
    icon: 'zap',
    unlocked: false
  },
  {
    id: 'weekly-streak-4',
    title: 'Monthly Commitment',
    description: 'Log in for 4 consecutive weeks',
    points: 150,
    icon: 'star',
    unlocked: false
  },
  {
    id: 'weekly-streak-8',
    title: 'Bi-Monthly Dedication',
    description: 'Log in for 8 consecutive weeks',
    points: 300,
    icon: 'star',
    unlocked: false
  },
  {
    id: 'weekly-streak-16',
    title: 'Quarterly Champion',
    description: 'Log in for 16 consecutive weeks',
    points: 500,
    icon: 'trophy',
    unlocked: false
  },
  {
    id: 'weekly-streak-32',
    title: 'Half-Year Devotion',
    description: 'Log in for 32 consecutive weeks',
    points: 1000,
    icon: 'trophy',
    unlocked: false
  },
  {
    id: 'weekly-streak-64',
    title: 'Annual Mastery',
    description: 'Log in for 64 consecutive weeks',
    points: 2000,
    icon: 'trophy',
    unlocked: false
  }
];

// Calculate level based on points
const calculateLevel = (points: number): number => {
  return Math.floor(points / 100) + 1;
};

const defaultGamificationData: GamificationData = {
  points: 0,
  level: 1,
  achievements: defaultAchievements,
  weeklyStreak: 0
};

const GamificationContext = createContext<GamificationContextType>({
  gamificationData: defaultGamificationData,
  addPoints: () => {},
  unlockAchievement: () => {},
  checkAchievements: () => {}
});

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const [gamificationData, setGamificationData] = useState<GamificationData>(defaultGamificationData);

  // Initialize gamification data from user profile or use defaults
  useEffect(() => {
    if (userProfile?.gamificationData) {
      setGamificationData(userProfile.gamificationData);
    } else if (userProfile) {
      // If user exists but has no gamification data, create default
      const newGamificationData = {...defaultGamificationData};
      updateUserProfile({ gamificationData: newGamificationData });
      setGamificationData(newGamificationData);
    }
  }, [userProfile, updateUserProfile]);

  // Update weekly streak on login
  useEffect(() => {
    if (!userProfile) return;

    const today = new Date();
    const currentWeek = getWeekNumber(today);
    const currentYear = today.getFullYear();
    const currentWeekKey = `${currentYear}-W${currentWeek}`;
    
    const lastWeeklyLogin = gamificationData.lastWeeklyLogin;
    
    if (!lastWeeklyLogin) {
      // First login ever
      const updatedData = {
        ...gamificationData,
        weeklyStreak: 1,
        lastWeeklyLogin: currentWeekKey,
        lastActivityDate: new Date().toISOString()
      };
      setGamificationData(updatedData);
      updateUserProfile({ gamificationData: updatedData });
    } else if (lastWeeklyLogin !== currentWeekKey) {
      // Get previous week
      const lastWeekDate = new Date(today);
      lastWeekDate.setDate(today.getDate() - 7);
      const lastWeek = getWeekNumber(lastWeekDate);
      const lastYear = lastWeekDate.getFullYear();
      const lastWeekKey = `${lastYear}-W${lastWeek}`;
      
      // If last login was last week, continue streak
      // Otherwise reset streak
      let newStreak = lastWeeklyLogin === lastWeekKey 
        ? gamificationData.weeklyStreak + 1 
        : 1; // Reset streak if not consecutive

      const updatedData = {
        ...gamificationData,
        weeklyStreak: newStreak,
        lastWeeklyLogin: currentWeekKey,
        lastActivityDate: new Date().toISOString()
      };
      
      setGamificationData(updatedData);
      updateUserProfile({ gamificationData: updatedData });
      
      // Check for weekly streak achievements
      checkStreakAchievements(newStreak);
    } else {
      // Already logged in this week, just update activity date
      const updatedData = {
        ...gamificationData,
        lastActivityDate: new Date().toISOString()
      };
      setGamificationData(updatedData);
      updateUserProfile({ gamificationData: updatedData });
    }
  }, [userProfile]);

  // Helper function to get week number
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Check streak-based achievements
  const checkStreakAchievements = (streak: number) => {
    const streakThresholds = [4, 8, 16, 32, 64];
    
    for (const threshold of streakThresholds) {
      if (streak >= threshold) {
        unlockAchievement(`weekly-streak-${threshold}`);
      }
    }
  };

  // Add points and update level
  const addPoints = (points: number, reason?: string) => {
    const newPoints = gamificationData.points + points;
    const newLevel = calculateLevel(newPoints);
    const levelUp = newLevel > gamificationData.level;
    
    const updatedData = {
      ...gamificationData,
      points: newPoints,
      level: newLevel,
      lastActivityDate: new Date().toISOString()
    };
    
    setGamificationData(updatedData);
    updateUserProfile({ gamificationData: updatedData });
    
    // Show toast notification
    if (points > 0) {
      toast(reason || 'Points earned!', {
        description: `+${points} points${levelUp ? ' • Level Up! 🎉' : ''}`,
        icon: <Zap className="h-4 w-4 text-yellow-500" />
      });
    }
    
    if (levelUp) {
      toast('Level Up!', {
        description: `You've reached level ${newLevel}! Keep up the good work!`,
        icon: <Star className="h-5 w-5 text-yellow-500" />
      });
    }
  };

  // Unlock an achievement
  const unlockAchievement = (achievementId: string) => {
    const achievement = gamificationData.achievements.find(a => a.id === achievementId);
    
    if (!achievement || achievement.unlocked) return;
    
    const updatedAchievements = gamificationData.achievements.map(a => 
      a.id === achievementId 
        ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } 
        : a
    );
    
    const updatedData = {
      ...gamificationData,
      achievements: updatedAchievements
    };
    
    setGamificationData(updatedData);
    updateUserProfile({ gamificationData: updatedData });
    addPoints(achievement.points, `Achievement unlocked: ${achievement.title}`);
    
    // Show achievement notification
    toast('Achievement Unlocked!', {
      description: achievement.title,
      icon: renderAchievementIcon(achievement.icon, "h-5 w-5 text-yellow-500")
    });
  };

  // Check for achievements based on app state
  const checkAchievements = () => {
    // Will be implemented as needed for various triggers
    // This is a placeholder for custom achievement logic
  };

  const renderAchievementIcon = (iconType: 'trophy' | 'star' | 'award' | 'zap', className?: string) => {
    switch (iconType) {
      case 'trophy':
        return <Trophy className={className} />;
      case 'star':
        return <Star className={className} />;
      case 'award':
        return <Award className={className} />;
      case 'zap':
        return <Zap className={className} />;
      default:
        return <Trophy className={className} />;
    }
  };

  return (
    <GamificationContext.Provider value={{ 
      gamificationData, 
      addPoints, 
      unlockAchievement,
      checkAchievements
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export default GamificationContext;
