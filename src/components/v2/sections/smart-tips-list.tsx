'use client'

import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BlogPost } from '@/types/v2'

export function SmartTipsList({ posts }: { posts: BlogPost[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#E62329]/30 transition-all duration-500 group flex flex-col h-full"
                >
                    <Link href={`/new-home/smart-tips/${post.slug || post.id}`} className="block relative h-64 overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                        <img
                            src={post.image || '/bg-placeholder.jpg'}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 z-20">
                            <span className="bg-[#E62329] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                {post.category || 'Automotive'}
                            </span>
                        </div>
                    </Link>

                    <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-[#E62329]" />
                                {post.date}
                            </div>
                        </div>

                        <Link href={`/new-home/smart-tips/${post.slug || post.id}`} className="group-hover:text-[#E62329] transition-colors">
                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-4 min-h-[3.75rem]">
                                {post.title}
                            </h3>
                        </Link>

                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                            {post.excerpt}
                        </p>

                        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#E62329]">
                                    <User size={14} />
                                </div>
                                {post.author || 'Smart Motor'}
                            </div>

                            <Link href={`/new-home/smart-tips/${post.slug || post.id}`} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#121212] group-hover:bg-[#E62329] group-hover:text-white transition-all">
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
