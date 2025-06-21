import { prisma } from './prisma'
import { ActivityType } from '@prisma/client'

const POINT_VALUES = {
  DISCUSSION_CREATED: 10,
  REPLY_POSTED: 5,
  BLOG_POST_CREATED: 15,
  COMMENT_POSTED: 3,
  LIKE_GIVEN: 1,
  LOGIN: 1,
  PROFILE_UPDATED: 2
}

export async function awardPoints(userId: string, activityType: ActivityType, description: string, metadata?: any) {
  const points = POINT_VALUES[activityType] || 0
  
  // Create activity record
  await prisma.activity.create({
    data: {
      userId,
      type: activityType,
      description,
      points,
      metadata: metadata ? JSON.stringify(metadata) : null
    }
  })

  // Update user points and level
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true, level: true }
  })

  if (user) {
    const newPoints = user.points + points
    const newLevel = Math.floor(newPoints / 100) + 1 // Level up every 100 points

    await prisma.user.update({
      where: { id: userId },
      data: {
        points: newPoints,
        level: newLevel,
        lastActivity: new Date()
      }
    })

    // Check for achievements
    await checkAchievements(userId, newPoints, newLevel)
  }
}

async function checkAchievements(userId: string, points: number, level: number) {
  const achievements = await prisma.achievement.findMany()
  
  for (const achievement of achievements) {
    const condition = JSON.parse(achievement.condition)
    let earned = false

    switch (condition.type) {
      case 'points':
        earned = points >= condition.value
        break
      case 'level':
        earned = level >= condition.value
        break
      case 'posts':
        const postCount = await prisma.discussion.count({ where: { authorId: userId } })
        earned = postCount >= condition.value
        break
    }

    if (earned) {
      // Check if user already has this achievement
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id
          }
        }
      })

      if (!existing) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        })

        // Award achievement points
        await awardPoints(userId, 'ACHIEVEMENT_EARNED', `Earned achievement: ${achievement.name}`)
      }
    }
  }
}