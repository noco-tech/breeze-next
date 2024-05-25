'use client'

import { createContext, useContext, useState } from "react"

export const AverageContext = createContext()

export const AverageProvider = ({ children }) => {
  const [average, setAverage] = useState(0)
  return (
    <AverageContext.Provider value={[average, setAverage]}>
      {children}
    </AverageContext.Provider>
  )
}

export const useAverage = () => useContext(AverageContext)
