import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, User, MapPin, Video, CheckCircle2,
  AlertCircle, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'

export default function AlunoAgendamento() {
  const { show } = useToast()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [modalType, setModalType] = useState<'presencial' | 'online'>('presencial')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedDate, setSelectedDate] = useState('2026-09-02')
  const [selectedTime, setSelectedTime] = useState('14:30')
  const [notes, setNotes] = useState('')
  const [confirmedModal, setConfirmedModal] = useState(false)

  const subjects = [
    { id: 'matr', label: 'Orientação de Matrícula e Grade Horária', icon: '📚' },
    { id: 'fin', label: 'Acordo e Negociação Financeira / Bolsas', icon: '💰' },
    { id: 'disp', label: 'Aproveitamento de Estudos / Dispensa de Disciplinas', icon: '📄' },
    { id: 'estg', label: 'Validação de Contrato de Estágio', icon: '💼' },
    { id: 'geral', label: 'Outros Assuntos / Suporte Geral', icon: '💬' },
  ]

  const availableDates = [
    { date: '2026-09-01', day: 'Terça-feira', slots: 4 },
    { date: '2026-09-02', day: 'Quarta-feira', slots: 6 },
    { date: '2026-09-03', day: 'Quinta-feira', slots: 2 },
    { date: '2026-09-04', day: 'Sexta-feira', slots: 5 },
  ]

  const availableTimes = ['09:00', '10:30', '14:00', '14:30', '16:00', '17:30', '19:00']

  const handleConfirm = () => {
    setConfirmedModal(true)
    show('Agendamento confirmado com sucesso!', 'success')
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Agendamento de Atendimento ASA
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Reserve um horário exclusivo com a equipe da Área de Sucesso Alvarista (Presencial ou Online).
        </p>
      </div>

      {/* Mode selection cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={() => setModalType('presencial')}
          className={`p-6 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
            modalType === 'presencial'
              ? 'border-brand-600 bg-brand-50/40 dark:bg-brand-900/20 shadow-md'
              : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
            <MapPin size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Atendimento Presencial</h3>
              {modalType === 'presencial' && <Badge variant="success">Selecionado</Badge>}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Campus Liberdade · Bloco B · Térreo (Sala de Atendimento do ASA).
            </p>
          </div>
        </button>

        <button
          onClick={() => setModalType('online')}
          className={`p-6 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
            modalType === 'online'
              ? 'border-brand-600 bg-brand-50/40 dark:bg-brand-900/20 shadow-md'
              : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-asa-purple-500 text-white flex items-center justify-center flex-shrink-0">
            <Video size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Atendimento Online (Vídeo)</h3>
              {modalType === 'online' && <Badge variant="purple">Selecionado</Badge>}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Reunião virtual individual via Google Meet com link enviado por e-mail.
            </p>
          </div>
        </button>
      </div>

      {/* Booking Form Grid */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-card space-y-8">
        {/* Step 1: Subject */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            Selecione o Assunto do Atendimento
          </label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.label)}
                className={`p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-3 ${
                  selectedSubject === sub.label
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/30 text-brand-900 dark:text-brand-300 font-semibold'
                    : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{sub.icon}</span>
                <span className="flex-1 leading-snug">{sub.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Date and Time */}
        <div className="space-y-4 border-t border-gray-100 dark:border-slate-700 pt-6">
          <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            Escolha o Dia e Horário
          </label>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Dates */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Dias disponíveis na próxima semana:</span>
              <div className="space-y-2">
                {availableDates.map((item) => (
                  <button
                    key={item.date}
                    onClick={() => setSelectedDate(item.date)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedDate === item.date
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/30 text-brand-900 dark:text-brand-300 font-semibold'
                        : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-brand-600" />
                      <div>
                        <p className="text-sm font-semibold">{item.day}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{item.date}</p>
                      </div>
                    </div>
                    <span className="text-2xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      {item.slots} horários
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Times */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Horários disponíveis para {selectedDate}:</span>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-2 rounded-xl border text-center text-sm font-semibold transition-all ${
                      selectedTime === time
                        ? 'border-brand-600 bg-brand-600 text-white shadow-md'
                        : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Notes & Submit */}
        <div className="space-y-4 border-t border-gray-100 dark:border-slate-700 pt-6">
          <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">3</span>
            Observações ou Documentos a Apresentar (Opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Descreva brevemente o que deseja resolver ou dúvidas específicas para adiantar seu atendimento..."
            rows={3}
            className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-600 outline-none"
          />

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              disabled={!selectedSubject}
              icon={<CheckCircle2 size={18} />}
            >
              Confirmar Agendamento
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal / Voucher */}
      <Modal
        open={confirmedModal}
        onClose={() => setConfirmedModal(false)}
        title="Agendamento Confirmado!"
        description="Seu protocolo de agendamento foi gerado"
        size="md"
        footer={
          <Button variant="primary" onClick={() => setConfirmedModal(false)} className="w-full">
            Concluir
          </Button>
        }
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Protocolo #AG-2026-8819</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Enviamos a confirmação e lembretes para o seu e-mail institucional.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Modalidade:</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">{modalType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Assunto:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedSubject || 'Geral'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data e Hora:</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">{selectedDate} às {selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Local / Acesso:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {modalType === 'presencial' ? 'Campus Liberdade · Bloco B' : 'Google Meet (link enviado)'}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
