
import React from 'react';
import { Achievements } from '@/components/gamification/Achievements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGamification } from '@/context/GamificationContext';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Award, Zap, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AchievementsPage = () => {
  const { gamificationData } = useGamification();
  
  // Calculate percentage to next level
  const currentLevelPoints = (gamificationData.level - 1) * 100;
  const nextLevelPoints = gamificationData.level * 100;
  const pointsInCurrentLevel = gamificationData.points - currentLevelPoints;
  const percentToNextLevel = Math.min(Math.round((pointsInCurrentLevel / 100) * 100), 100);
  
  // Find the next weekly streak milestone
  const getNextStreakMilestone = () => {
    const milestones = [4, 8, 16, 32, 64];
    const currentStreak = gamificationData.weeklyStreak;
    
    for (const milestone of milestones) {
      if (currentStreak < milestone) {
        return {
          current: currentStreak,
          next: milestone,
          percent: Math.round((currentStreak / milestone) * 100)
        };
      }
    }
    
    // If all milestones achieved, show the last one as completed
    return {
      current: currentStreak,
      next: milestones[milestones.length - 1],
      percent: 100
    };
  };
  
  const streakInfo = getNextStreakMilestone();
  
  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Achievements</h1>
        <p className="text-muted-foreground">Track your progress and unlock rewards</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-amber-500" />
              Level Progress
            </CardTitle>
            <CardDescription>
              Keep earning points to level up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xl shadow-md">
                  {gamificationData.level}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Level {gamificationData.level}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pointsInCurrentLevel}/100 XP to next level
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-600">
                  {gamificationData.points}
                </div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to Level {gamificationData.level + 1}</span>
                <span>{pointsInCurrentLevel}/100 XP</span>
              </div>
              <Progress value={percentToNextLevel} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-amber-500" />
              Weekly Login Streak
            </CardTitle>
            <CardDescription>
              Log in once every week to maintain your streak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xl shadow-md">
                  {gamificationData.weeklyStreak}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{gamificationData.weeklyStreak} {gamificationData.weeklyStreak === 1 ? 'week' : 'weeks'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Next milestone: {streakInfo.next} weeks
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Button variant="outline" className="flex items-center gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50">
                  <Calendar className="h-4 w-4" />
                  <span>Current Streak</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to {streakInfo.next}-week milestone</span>
                <span>{streakInfo.current}/{streakInfo.next} weeks</span>
              </div>
              <Progress value={streakInfo.percent} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                Log in at least once per week to maintain your streak. If you miss a week, your streak will reset!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Your Statistics
            </CardTitle>
            <CardDescription>
              Track your progress and achievement stats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="flex items-center mb-1.5">
                  <Trophy className="h-4 w-4 mr-1.5 text-amber-500" />
                  <span className="text-sm font-medium">Achievements</span>
                </div>
                <div className="text-2xl font-bold">
                  {gamificationData.achievements.filter(a => a.unlocked).length}/
                  {gamificationData.achievements.length}
                </div>
                <Progress 
                  value={Math.round((gamificationData.achievements.filter(a => a.unlocked).length / gamificationData.achievements.length) * 100)} 
                  className="h-1 mt-1.5" 
                />
              </div>
              
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="flex items-center mb-1.5">
                  <Zap className="h-4 w-4 mr-1.5 text-amber-500" />
                  <span className="text-sm font-medium">Total XP</span>
                </div>
                <div className="text-2xl font-bold">
                  {gamificationData.points}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">
                  Points earned so far
                </div>
              </div>
              
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="flex items-center mb-1.5">
                  <Star className="h-4 w-4 mr-1.5 text-amber-500" />
                  <span className="text-sm font-medium">Current Level</span>
                </div>
                <div className="text-2xl font-bold">
                  {gamificationData.level}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">
                  Level {gamificationData.level + 1} at {nextLevelPoints} XP
                </div>
              </div>
              
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="flex items-center mb-1.5">
                  <Calendar className="h-4 w-4 mr-1.5 text-amber-500" />
                  <span className="text-sm font-medium">Weekly Streak</span>
                </div>
                <div className="text-2xl font-bold">
                  {gamificationData.weeklyStreak} {gamificationData.weeklyStreak === 1 ? 'week' : 'weeks'}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">
                  Keep logging in weekly!
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-amber-500" />
              Streak Milestones
            </CardTitle>
            <CardDescription>
              Rewards for consistent weekly logins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[4, 8, 16, 32, 64].map(milestone => {
                const achieved = gamificationData.weeklyStreak >= milestone;
                const achievement = gamificationData.achievements.find(a => a.id === `weekly-streak-${milestone}`);
                const points = achievement ? achievement.points : 0;
                
                return (
                  <div 
                    key={milestone}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      achieved ? 'bg-amber-50 border-amber-200' : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 ${
                        achieved ? 'bg-amber-100' : 'bg-muted-foreground/20'
                      }`}>
                        <Calendar className={`h-4 w-4 ${achieved ? 'text-amber-600' : 'text-muted-foreground/70'}`} />
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${!achieved ? 'text-muted-foreground' : ''}`}>
                          {milestone} Week{milestone !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {achieved ? 'Milestone achieved!' : `${gamificationData.weeklyStreak}/${milestone} weeks completed`}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${achieved ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      +{points} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Achievements />
    </div>
  );
};

export default AchievementsPage;
