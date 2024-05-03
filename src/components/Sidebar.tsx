'use client'

import { List, ListItemButton, ListItemText, Typography } from '@mui/material'

// import useMediaStore from '@/store/useMediaStore'
import StoreProvider, { useStoreInContext } from '@/store/context'

const Sidebar = () => {
    // const [category, setCategory] = useState('')
    // const [, setCategory] = useGetCategory()
    // const setCategory = useMediaStore(state => state.setCategory)
    // const { category } = useMediaStore()

        const { category, setCategory } = useStoreInContext(state => ({
            category: state.category,
            setCategory: state.setCategory,
        }))


console.log(category)
    return (
        <div>
            <Typography
                sx={{
                    bgcolor: 'blue',
                    color: 'white',
                    padding: 1,
                }}>
                カテゴリ
            </Typography>
            <List component={'nav'}>
                <ListItemButton onClick={() => setCategory('all')}>
                    <ListItemText primary="全て" />
                </ListItemButton>
                <ListItemButton onClick={() => setCategory('movie')}>
                    <ListItemText primary="映画" />
                </ListItemButton>
                <ListItemButton onClick={() => setCategory('tv')}>
                    <ListItemText primary="TV" />
                </ListItemButton>
            </List>
        </div>
    )
}

export default Sidebar
