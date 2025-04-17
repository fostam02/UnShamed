
import React from 'react';
import { useGamification } from '@/context/GamificationContext';
import { Progress } from '@/components/ui/progress';
import { Trophy, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const GamificationBar = () => {
  const { gamificationData } = useGamification();
  
  // Calculate percentage to next level
  const currentLevelPoints = (gamificationData.level - 1) * 100;
  const nextLevelPoints = gamificationData.level * 100;
  const pointsInCurrentLevel = gamificationData.points - currentLevelPoints;
  const percentToNextLevel = Math.min(Math.round((pointsInCurrentLevel / 100) * 100), 100);
  
  // Calculate unlocked achievements percentage
  const totalAchievements = gamificationData.achievements.length;
  const unlockedAchievements = gamificationData.achievements.filter(a => a.unlocked).length;
  const achievementPercentage = totalAchievements > 0 
    ? Math.round((unlockedAchievements / totalAchievements) * 100) 
    : 0;

  return (
    <div className="p-2 bg-accent/30 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {gamificationData.level}
          </div>
          <div>
            <p className="text-sm font-medium">Level {gamificationData.level}</p>
            <p className="text-xs text-muted-foreground">{pointsInCurrentLevel}/100 XP to next level</p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 rounded-full">
                <Zap className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">{gamificationData.points} XP</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Total experience points</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Level Progress</span>
            <span>{percentToNextLevel}%</span>
          </div>
          <Progress value={percentToNextLevel} className="h-2" />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center">
              <Trophy className="h-3 w-3 mr-1 text-amber-600" />
              <span>Achievements</span>
            </span>
            <span>{unlockedAchievements}/{totalAchievements}</span>
          </div>
          <Progress value={achievementPercentage} className="h-2" />
        </div>

        {gamificationData.weeklyStreak > 0 && (
          <div className="mt-1">
            <span className="text-xs flex items-center">
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-100 text-amber-800 font-medium text-[10px] mr-1.5">{gamificationData.weeklyStreak}</span>
              Day streak! Keep it up!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationBar;
