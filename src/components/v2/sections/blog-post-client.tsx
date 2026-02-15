'use client'

import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import dynamic from 'next/dynamic'
import { BlogPost } from '@/types/v2'

const BookingForm = dynamic(() => import('@/components/sections/booking-form').then((mod) => mod.BookingForm), { ssr: false })

interface BlogPostClientProps {
    post: BlogPost
    relatedPosts: BlogPost[]
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Post Hero */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden bg-[#121212]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/50 to-transparent z-10" />
                    <img
                        src={post.image || '/bg-placeholder.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>

                <div className="relative z-20 max-w-4xl mx-auto px-6 md:px-12 w-full pt-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="bg-[#E62329] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                {post.category}
                            </span>
                            <span className="text-gray-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={14} className="text-[#E62329]" /> 5 Min Read
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-8">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-8 text-sm font-medium text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[#E62329] border border-gray-700">
                                    <User size={14} />
                                </div>
                                <span className="font-bold text-white tracking-wide uppercase text-xs">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#E62329]" />
                                <span className="font-bold text-white tracking-wide uppercase text-xs">{post.date}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">

                    {/* Back Link */}
                    <Link href="/new-home/smart-tips" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E62329] mb-12 transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Smart Tips
                    </Link>

                    {/* Article Body */}
                    <article className="prose prose-lg prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#E62329] prose-img:rounded-3xl max-w-none">
                        <p className="text-2xl font-medium text-[#121212] leading-relaxed mb-10 border-l-4 border-[#E62329] pl-6 italic">
                            {post.excerpt}
                        </p>

                        <div className="text-gray-600 leading-8 text-lg font-normal space-y-6">
                            {post.content.split('\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                    </article>

                    {/* Share Section */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
                        <span className="font-black text-xs uppercase tracking-widest text-[#121212]">Share Article</span>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#121212] hover:bg-[#1877F2] hover:text-white transition-all">
                                <Facebook size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#121212] hover:bg-[#1DA1F2] hover:text-white transition-all">
                                <Twitter size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#121212] hover:bg-[#0A66C2] hover:text-white transition-all">
                                <Linkedin size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#121212] hover:bg-gray-800 hover:text-white transition-all">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {/* Related Posts */}
            <section className="py-24 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-end justify-between mb-12">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Related <span className="text-[#E62329]">Articles</span></h2>
                        <Link href="/new-home/smart-tips" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#E62329] transition-colors">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPosts.map((rPost, index) => (
                            <motion.div
                                key={rPost.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover:border-[#E62329]/30 transition-all duration-500 group flex flex-col h-full"
                            >
                                <Link href={`/new-home/smart-tips/${rPost.slug}`} className="block relative h-56 overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                    <img
                                        src={rPost.image || '/bg-placeholder.jpg'}
                                        alt={rPost.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-[#E62329] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                            {rPost.category}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-8 flex flex-col flex-grow">
                                    <Link href={`/new-home/smart-tips/${rPost.slug}`} className="group-hover:text-[#E62329] transition-colors">
                                        <h3 className="text-lg font-black uppercase tracking-tight leading-tight mb-4 min-h-[3.5rem]">
                                            {rPost.title}
                                        </h3>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <BookingForm />
            <Footer />
        </main>
    )
}
