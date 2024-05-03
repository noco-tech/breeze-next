'use client'
import { create } from 'zustand'

const useMediaStore = create(set => ({
    category: '',
    setCategory: category => set({ category }),
}))

export default useMediaStore
