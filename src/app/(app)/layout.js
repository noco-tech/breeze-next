'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'
import { useEffect } from 'react'
import axios from 'axios'

const AppLayout = ({ children, header }) => {

    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-blue-100">
            <Navigation user={user} />

            <main>{children}</main>
        </div>
    )
}

export default AppLayout
