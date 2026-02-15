import { prisma } from '@/lib/prisma'
import { UserTable } from '@/components/admin/users/user-table'
import { CreateUserModal } from '@/components/admin/users/create-user-modal'
import { SearchInput } from '@/components/ui/search-input'

export default async function UsersPage({
    searchParams,
}: {
    searchParams?: { query?: string }
}) {
    const query = searchParams?.query || ''

    let users: any[] = []
    try {
        users = await prisma.user.findMany({
            where: {
                deletedAt: null,
                OR: query ? [
                    { name: { contains: query } }, // Removed mode: 'insensitive' for SQLite compatibility
                    { email: { contains: query } }
                ] : undefined
            },
            orderBy: { createdAt: 'desc' },
        })
    } catch (error) {
        console.error('Failed to fetch users:', error)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#121212]">User Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage platform users, roles, and permissions.</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <SearchInput placeholder="Search users..." />
                    <CreateUserModal />
                </div>
            </div>

            <UserTable users={users} />
        </div>
    )
}
