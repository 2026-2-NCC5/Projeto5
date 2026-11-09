// Dados SINTÉTICOS apenas para o teste de carga (nenhum dado real). Uso: DATABASE_URL=... node --import tsx scripts/synthetic-seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const N_STUDENTS = Number(process.env.N_STUDENTS || 300), N_TICKETS = Number(process.env.N_TICKETS || 3000)
const cats = ['matricula', 'financeiro', 'academico', 'documentos', 'outros']
const sts = ['aberto', 'em_atendimento', 'resolvido', 'fechado']
const pri = ['baixa', 'media', 'alta', 'critica']
const students = []
for (let i = 0; i < N_STUDENTS; i++) students.push({ id: `syn-s-${i}`, name: `Aluno Sintetico ${i}`, ra: `SYN${String(i).padStart(6, '0')}`, email: `syn${i}@example.invalid`, course: 'Ciência da Computação', semester: 1 + (i % 8), period: 'noite' })
await prisma.student.createMany({ data: students })
const tickets = []
for (let i = 0; i < N_TICKETS; i++) {
  const created = new Date(Date.now() - Math.random() * 60 * 86400000)
  tickets.push({ number: 100000 + i, title: `Chamado sintético #${i}`, description: 'Texto sintético de teste de carga. '.repeat(5), status: sts[i % 4], priority: pri[i % 4], category: cats[i % 5], studentId: `syn-s-${i % N_STUDENTS}`, createdAt: created, slaDeadline: new Date(+created + 48 * 3600000) })
}
await prisma.ticket.createMany({ data: tickets })
console.log(`ok: ${N_STUDENTS} alunos e ${N_TICKETS} chamados sintéticos`)
await prisma.$disconnect()
