'use client'

import { useState } from 'react'
import { toggleUserRole, deleteUser } from '@/actions/user-actions'
import { Button } from '@/components/ui/button'
import { EditUserModal } from './edit-user-modal'
import { formatDate } from '@/lib/utils'
import { Shield, ShieldAlert, Trash2, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    name: string | null
    email: string | null
    role: string // Changed from Role to string
    createdAt: Date
}

export function UserTable({ users }: { users: User[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const router = useRouter()

    const handleRoleToggle = async (user: User) => {
        try {
            setLoadingId(user.id)
            await toggleUserRole(user.id, user.role)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to update role')
        } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

        try {
            setLoadingId(userId)
            await deleteUser(userId)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Failed to delete user')
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-xl shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-gray-500">User</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-gray-500">Role</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-gray-500">Joined</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-gray-500 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="group hover:bg-white/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#121212]">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#121212]">{user.name || 'Unnamed User'}</div>
                                        <div className="text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${user.role === 'ADMIN'
                                    ? 'bg-[#121212] text-white'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {user.role === 'ADMIN' ? (
                                        <ShieldAlert className="h-3 w-3" />
                                    ) : (
                                        <Shield className="h-3 w-3" />
                                    )}
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-medium">
                                {formatDate(user.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <EditUserModal user={user} />

                                    <Button
                                        onClick={() => handleRoleToggle(user)}
                                        disabled={loadingId === user.id}
                                        variant="outline"
                                        className="h-8 rounded-full text-xs hover:bg-[#121212] hover:text-white border-gray-200"
                                    >
                                        {user.role === 'ADMIN' ? 'Demote' : 'Promote'}
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(user.id)}
                                        disabled={loadingId === user.id}
                                        className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-0 flex items-center justify-center transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No users found.
                </div>
            )}
        </div>
    )
}
