export interface Quiz { q: string; options: string[]; answer: number; why: string }
export interface Step { title: string; marks?: number; brief: string; solution?: string }
export interface Module { id?: string; order: number; emoji: string; title: string; learn: string; code?: string; quiz: Quiz[]; lab?: { task: string; solution: string }; projects?: Step[]; imageUrl?: string }
export interface BankQ { id?: string; topic: number; type: "mc" | "short" | "project"; q?: string; options?: string[]; answer?: number; why?: string; model?: string; marks?: number; title?: string; brief?: string; solution?: string }
export interface Profile { xp: number; done: Record<string, boolean>; steps?: Record<string, boolean>; role: "student" | "admin"; email: string; streak?: number; last?: string }
