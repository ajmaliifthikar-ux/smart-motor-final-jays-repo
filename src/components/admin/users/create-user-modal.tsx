'use client'

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema, CreateUserInput } from "@/lib/validations/user"
import { createUser } from "@/actions/create-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, UserPlus } from "lucide-react"

export function CreateUserModal() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema) as any,
        defaultValues: {
            role: "CUSTOMER",
        },
    })

    // Start Phase B-1 (User Actions) implementation for UI
    const onSubmit = (data: CreateUserInput) => {
        startTransition(async () => {
            const result = await createUser(data)

            if (result.success) {
                toast.success(result.message)
                setOpen(false)
                reset()
            } else {
                toast.error(result.message)
                if (result.errors) {
                    console.error(result.errors)
                }
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#E62329] hover:bg-[#E62329]/90 text-white rounded-full font-bold shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        Create New User
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" {...register("name")} />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121212]"
                            {...register("role")}
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="EDITOR">Editor</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SUPPORT">Support</option>
                        </select>
                        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="ghost" className="mr-2" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isPending} className="bg-[#121212] text-white">
                            Create Account
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
