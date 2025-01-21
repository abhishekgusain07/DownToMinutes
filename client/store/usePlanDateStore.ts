import { create } from 'zustand'

interface PlanDateState {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

export const usePlanDateStore = create<PlanDateState>((set) => ({
  selectedDate: new Date(), // Defaults to current date
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
}))
