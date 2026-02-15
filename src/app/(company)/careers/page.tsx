import type { Metadata } from 'next'
import { BriefcaseIcon, MapPinIcon, ClockIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Careers | Smart Motor',
    description: 'Join the team at Smart Motor. We are always looking for talented mechanics, advisors, and automotive experts.',
}

const openPositions = [
    {
        title: 'Senior German Car Technician',
        type: 'Full-time',
        location: 'Musaffah, Abu Dhabi',
        department: 'Mechanical',
    },
    {
        title: 'Service Advisor',
        type: 'Full-time',
        location: 'Musaffah, Abu Dhabi',
        department: 'Customer Service',
    },
    {
        title: 'Auto Electrician',
        type: 'Full-time',
        location: 'Musaffah, Abu Dhabi',
        department: 'Electrical',
    }
]

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-32 pb-24">
            <div className="container max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E62329]/10 text-[#E62329] text-[10px] font-black uppercase tracking-widest mb-6">
                        <BriefcaseIcon size={14} />
                        <span>Join Our Team</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#121212] mb-6">
                        Build Your Career with <span className="text-[#E62329]">Smart Motor</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        We are always looking for passionate automotive professionals who share our commitment to excellence and precision.
                    </p>
                </div>

                {/* Positions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {openPositions.map((job, index) => (
                        <div key={index} className="bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-[#E62329]/20 hover:shadow-lg transition-all group">
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-4">
                                        {job.department}
                                    </span>
                                    <h3 className="text-xl font-bold text-[#121212] mb-4 group-hover:text-[#E62329] transition-colors">{job.title}</h3>
                                    <div className="space-y-2 mb-8">
                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                            <ClockIcon size={14} />
                                            {job.type}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                            <MapPinIcon size={14} />
                                            {job.location}
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-[#121212] group-hover:text-[#E62329] transition-colors pt-6 border-t border-gray-50">
                                    Apply Now
                                    <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* General Application */}
                <div className="bg-[#121212] rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Don't see your role?</h3>
                        <p className="text-gray-400 mb-8">
                            We are constantly growing. Send us your CV and we'll keep it on file for future opportunities.
                        </p>
                        <a href="mailto:careers@smartmotor.ae" className="inline-block bg-white text-[#121212] px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#E62329] hover:text-white transition-all">
                            Email Your CV
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
