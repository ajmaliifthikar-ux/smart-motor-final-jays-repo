'use client'

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { updateUser } from "@/actions/user-actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Pencil } from "lucide-react"

const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "EDITOR", "CUSTOMER", "SUPPORT"]),
})

type UserFormValues = z.infer<typeof userSchema>

interface User {
    id: string
    name: string | null
    email: string | null
    role: string // Changed from Role to string
}

export function EditUserModal({ user }: { user: User }) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            role: user.role as "ADMIN" | "EDITOR" | "CUSTOMER" | "SUPPORT",
        },
    })

    async function onSubmit(data: UserFormValues) {
        setIsLoading(true)
        try {
            const result = await updateUser(user.id, data)
            if (result.success) {
                toast.success(result.message)
                setOpen(false)
            }
        } catch (error) {
            toast.error("Failed to update user")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <Pencil className="h-4 w-4" />
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 shadow-2xl z-50">
                    <div className="flex items-center justify-between mb-6">
                        <Dialog.Title className="text-xl font-bold tracking-tight text-[#121212]">
                            Edit User
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            id="name"
                            {...register("name")}
                            error={errors.name?.message}
                        />
                        <Input
                            label="Email Address"
                            id="email"
                            type="email"
                            {...register("email")}
                            error={errors.email?.message}
                        />

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#121212]">
                                Role
                            </label>
                            <select
                                {...register("role")}
                                className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121212] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="EDITOR">Editor</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPPORT">Support</option>
                            </select>
                            {errors.role && (
                                <p className="text-[10px] text-red-500 font-bold">{errors.role.message}</p>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Dialog.Close asChild>
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button type="submit" isLoading={isLoading} className="bg-[#121212] text-white">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
