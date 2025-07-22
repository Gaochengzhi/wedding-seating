import { useState, useEffect } from 'react'
import { apiClient } from '../utils/apiClient'

export const useRelationships = () => {
    const [relationships, setRelationships] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadRelationships = async () => {
        try {
            setLoading(true)
            const response = await apiClient.getAllRelationships()
            setRelationships(response.data || [])
            setError(null)
        } catch (err) {
            console.error('Failed to load relationships:', err)
            setError(err.message)
            // Fallback to default relationships if API fails
            setRelationships([
                { value: 'groom_classmate', label: '男方同学/同事', category: 'groom', order: 1 },
                { value: 'bride_classmate', label: '女方同学/同事', category: 'bride', order: 2 },
                { value: 'groom_father_friends', label: '男方爸爸亲友', category: 'groom_family', order: 3 },
                { value: 'groom_mother_friends', label: '男方妈妈亲友', category: 'groom_family', order: 4 },
                { value: 'bride_father_friends', label: '女方爸爸亲友', category: 'bride_family', order: 5 },
                { value: 'bride_mother_friends', label: '女方妈妈亲友', category: 'bride_family', order: 6 },
                { value: 'groom_father_colleagues', label: '男方爸爸同事', category: 'groom_family', order: 7 },
                { value: 'bride_father_colleagues', label: '女方爸爸同事', category: 'bride_family', order: 8 },
                { value: 'other', label: '其他', category: 'other', order: 9 }
            ])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRelationships()
    }, [])

    return {
        relationships,
        loading,
        error,
        refetchRelationships: loadRelationships
    }
}