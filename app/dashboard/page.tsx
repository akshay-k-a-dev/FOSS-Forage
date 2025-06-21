"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Settings, Activity, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'admin' | 'super_admin'
  isActive: boolean
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      const data = await response.json()
      setUser(data.user)

      // Load users if admin or super admin
      if (['admin', 'super_admin'].includes(data.user.role)) {
        await loadUsers()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const handleUserAction = async (userId: string, action: string, role?: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, action, role })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        await loadUsers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('User action failed:', error)
      toast.error('Action failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-500 text-white'
      case 'admin':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Admin'
      default:
        return 'User'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName || user.username}!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getRoleBadgeColor(user.role)}>
            {getRoleDisplayName(user.role)}
          </Badge>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Role:</strong> {getRoleDisplayName(user.role)}</p>
              <p><strong>Status:</strong> 
                <Badge variant={user.isActive ? "default" : "destructive"} className="ml-2">
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.role === 'super_admin' && (
                <>
                  <p className="text-green-600">✓ Full System Access</p>
                  <p className="text-green-600">✓ User Management</p>
                  <p className="text-green-600">✓ Role Assignment</p>
                  <p className="text-green-600">✓ Ban/Unban Users</p>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <p className="text-blue-600">✓ Admin Dashboard</p>
                  <p className="text-blue-600">✓ Content Management</p>
                  <p className="text-blue-600">✓ User Support</p>
                  <p className="text-gray-500">✗ User Role Management</p>
                </>
              )}
              {user.role === 'user' && (
                <>
                  <p className="text-gray-600">✓ Basic Access</p>
                  <p className="text-gray-600">✓ Forum Participation</p>
                  <p className="text-gray-500">✗ Admin Features</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={() => router.push('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push('/forum')}>
                <Users className="h-4 w-4 mr-2" />
                Visit Forum
              </Button>
              {['admin', 'super_admin'].includes(user.role) && (
                <Button variant="outline" className="w-full" onClick={() => router.push('/admin')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management (Super Admin Only) */}
      {user.role === 'super_admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{u.username}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge className={getRoleBadgeColor(u.role)}>
                      {getRoleDisplayName(u.role)}
                    </Badge>
                    <Badge variant={u.isActive ? "default" : "destructive"}>
                      {u.isActive ? 'Active' : 'Banned'}
                    </Badge>
                  </div>
                  
                  {u.id !== user.id && (
                    <div className="flex items-center gap-2">
                      <select
                        className="px-3 py-1 border rounded"
                        value={u.role}
                        onChange={(e) => handleUserAction(u.id, 'changeRole', e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      
                      {u.isActive ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUserAction(u.id, 'ban')}
                        >
                          <UserX className="h-4 w-4" />
                          Ban
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUserAction(u.id, 'unban')}
                        >
                          <UserCheck className="h-4 w-4" />
                          Unban
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Features (Admin and Super Admin) */}
      {['admin', 'super_admin'].includes(user.role) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage forum posts, resources, and blog content
              </p>
              <Button className="w-full">
                Manage Content
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View site statistics and user engagement
              </p>
              <Button className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure system settings and preferences
              </p>
              <Button className="w-full">
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}