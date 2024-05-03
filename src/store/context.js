'use client'

import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'


const defaultValue = 'all'

const StoreContext = createContext(defaultValue)

const StoreProvider = ({ children }) => {
    const storeRef = useRef()
    if (!storeRef.current) {
        storeRef.current = createStore(set => ({
            category: defaultValue,
            setCategory: category => set({ category }),
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

export default StoreProvider

