
import React from 'react';
import { useGamification } from '@/context/GamificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Zap, Lock } from 'lucide-react';

export const Achievements = () => {
  const { gamificationData } = useGamification();
  
  // Ensure we have achievements data before rendering
  if (!gamificationData || !gamificationData.achievements || gamificationData.achievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-amber-500" />
            Achievements
          </CardTitle>
          <CardDescription>
            Track your progress and unlock rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No achievements available yet
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-amber-500" />
          Achievements
        </CardTitle>
        <CardDescription>
          Track your progress and unlock rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {gamificationData.achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`flex items-start p-3 rounded-lg border ${
                achievement.unlocked 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-muted/30 border-muted'
              }`}
            >
              <div className={`flex items-center justify-center h-10 w-10 rounded-full mr-3 ${
                achievement.unlocked 
                  ? 'bg-amber-100' 
                  : 'bg-muted-foreground/20'
              }`}>
                {achievement.unlocked 
                  ? renderAchievementIcon(achievement.icon, "h-5 w-5 text-amber-600") 
                  : <Lock className="h-4 w-4 text-muted-foreground/70" />
                }
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className={`text-sm font-medium ${
                    !achievement.unlocked ? 'text-muted-foreground' : ''
                  }`}>
                    {achievement.title}
                  </h4>
                  
                  <Badge 
                    variant={achievement.unlocked ? "default" : "outline"}
                    className={achievement.unlocked ? "bg-amber-500" : ""}
                  >
                    {achievement.points} XP
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {achievement.description}
                </p>
                
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-amber-700 mt-1">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
