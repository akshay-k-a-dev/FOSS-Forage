"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Settings, Activity, BarChart3, FileText } from 'lucide-react'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage the Linux Community Hub platform
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">789</div>
              <p className="text-xs text-muted-foreground">
                +8.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.3K</div>
              <p className="text-xs text-muted-foreground">
                +15.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <Badge>1,180</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Banned Users</span>
                  <Badge variant="destructive">54</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Admins</span>
                  <Badge variant="secondary">12</Badge>
                </div>
              </div>
              <Button className="w-full">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Content Moderation
              </CardTitle>
              <CardDescription>
                Review and moderate forum content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Pending Reviews</span>
                  <Badge variant="outline">23</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Reported Posts</span>
                  <Badge variant="destructive">8</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Flagged Resources</span>
                  <Badge variant="outline">5</Badge>
                </div>
              </div>
              <Button className="w-full">
                Review Content
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resource Management
              </CardTitle>
              <CardDescription>
                Approve and manage community resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Pending Approval</span>
                  <Badge variant="outline">15</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Published</span>
                  <Badge>774</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Rejected</span>
                  <Badge variant="secondary">45</Badge>
                </div>
              </div>
              <Button className="w-full">
                Manage Resources
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                View detailed platform analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Daily Active Users</span>
                  <Badge>342</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Page Views</span>
                  <Badge>12.3K</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Engagement Rate</span>
                  <Badge variant="secondary">68%</Badge>
                </div>
              </div>
              <Button className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure platform settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Email Notifications</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto Moderation</span>
                  <Badge>Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Backup Status</span>
                  <Badge variant="secondary">Daily</Badge>
                </div>
              </div>
              <Button className="w-full">
                System Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Monitor security and access logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Failed Logins</span>
                  <Badge variant="destructive">12</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Sessions</span>
                  <Badge>234</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Security Alerts</span>
                  <Badge variant="outline">3</Badge>
                </div>
              </div>
              <Button className="w-full">
                Security Logs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activity and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New user registration</p>
                    <p className="text-sm text-muted-foreground">john_doe joined the community</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">2 minutes ago</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New discussion posted</p>
                    <p className="text-sm text-muted-foreground">"Best Linux distro for beginners" in General Discussion</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">5 minutes ago</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Resource submitted</p>
                    <p className="text-sm text-muted-foreground">New tool "htop alternative" pending approval</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">10 minutes ago</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Content reported</p>
                    <p className="text-sm text-muted-foreground">Post flagged for inappropriate content</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">15 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}