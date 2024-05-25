'use client'
import { create } from 'zustand'

const useStore = create(set => ({
    average: 0,
    setAverage: average => set({ average }),
}))

export default useStore
