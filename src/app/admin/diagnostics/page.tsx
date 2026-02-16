import { getAdminSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { runSystemDiagnostics } from "@/lib/diagnostics"
import { Card } from "@/components/ui/card"
import { Activity, ShieldCheck, Database, Zap, Clock, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function DiagnosticsPage() {
    const session = await getAdminSession()
    if (!session) {
        redirect('/auth')
    }

    const [realtimeHealth, recentTraces] = await Promise.all([
        runSystemDiagnostics(),
        prisma.integrationTrace.findMany({
            orderBy: { timestamp: 'desc' },
            take: 50
        })
    ])

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-[#121212] uppercase italic">
                    Integration <span className="silver-shine">Traces</span>
                </h1>
                <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-widest">Observability Hub & System Telemetry</p>
            </div>

            {/* Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {realtimeHealth.map((health: any) => (
                    <Card key={health.service} className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className={cn(
                            "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 transition-all duration-500 group-hover:opacity-10",
                            health.status === 'WORKING' ? "bg-green-500" : "bg-[#E62329]"
                        )} />
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                {health.service === 'Prisma' && <Database size={20} />}
                                {health.service === 'Redis' && <Clock size={20} />}
                                {health.service === 'Gemini' && <Zap size={20} />}
                                <h3 className="font-black text-sm uppercase tracking-widest">{health.service}</h3>
                            </div>
                            {health.status === 'WORKING' ? (
                                <CheckCircle2 className="text-green-500" size={20} />
                            ) : (
                                <AlertTriangle className="text-[#E62329]" size={20} />
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="text-2xl font-black text-[#121212]">{health.status}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {health.duration ? `Latency: ${health.duration}ms` : 'Error: See Logs'}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Trace List */}
            <div className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Live Telemetry Feed</h2>
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Service</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Operation</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Latency</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentTraces.map((trace) => (
                                <tr key={trace.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6 text-[11px] font-bold text-gray-400 tabular-nums">
                                        {new Date(trace.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-[#121212]">
                                            {trace.service}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-medium text-gray-600">
                                            {trace.operation}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "text-[11px] font-bold tabular-nums",
                                            trace.duration > 1000 ? "text-[#E62329]" : "text-gray-500"
                                        )}>
                                            {trace.duration}ms
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                trace.status === 'SUCCESS' ? "bg-green-500" : "bg-[#E62329]"
                                            )} />
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                trace.status === 'SUCCESS' ? "text-green-600" : "text-[#E62329]"
                                            )}>
                                                {trace.status}
                                            </span>
                                        </div>
                                        {trace.error && (
                                            <p className="mt-1 text-[9px] text-gray-400 font-medium line-clamp-1 group-hover:line-clamp-none max-w-xs transition-all">
                                                {trace.error}
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {recentTraces.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Activity size={40} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-300">Awaiting telemetry data...</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
