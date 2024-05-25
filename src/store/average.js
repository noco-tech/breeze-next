'use client'

import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

const defaultValue = 0

const StoreContext = createContext(null)

const AverageProvider = ({ children }) => {
    const storeRef = useRef()
    if (!storeRef.current) {
        storeRef.current = createStore(set => ({
            average: defaultValue,
            setAvegage: average => set({ average }),
        }))
    }
    return (
        <StoreContext.Provider value={storeRef.current}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStoreInContext = selector => {
    const store = useContext(StoreContext)
    if (!store) {
        throw new Error('Missing StoreProvider')
    }
    return useStore(store, selector)
}

export default AverageProvider
