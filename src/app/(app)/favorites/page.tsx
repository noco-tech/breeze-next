import React from 'react'
import Header from '../Header'

import Favorite from '@/components/Favorites/Favorite'


export const metadata = {
    title: 'Laravel - Favorite',
}


const favorites = async () => {


  return (
      <div>
      <Header title="お気に入り" />
      <Favorite />

      </div>
  )
}

export default favorites

