import { useState } from 'react'
import { apiClient } from '../utils/apiClient'

export const useDragAndDrop = (tables, setTables, isAdminMode) => {
    const [draggedGuest, setDraggedGuest] = useState(null)
    const [draggedFromSeat, setDraggedFromSeat] = useState(null)

    const handleDragStart = (seat) => {
        if (!isAdminMode || !seat.occupied) return
        
        setDraggedGuest(seat.guest)
        setDraggedFromSeat(seat)
    }
    
    const handleDragOver = (e) => {
        if (isAdminMode && draggedGuest) {
            e.preventDefault()
        }
    }
    
    const handleDrop = async (targetSeat) => {
        if (!isAdminMode || !draggedGuest || !draggedFromSeat) return
        
        if (targetSeat.occupied) {
            console.warn('目标座位已被占用，无法移动')
            setDraggedGuest(null)
            setDraggedFromSeat(null)
            return
        }
        
        try {
            // First delete from original seat
            await apiClient.deleteGuest(draggedFromSeat.id, draggedFromSeat.tableId)
            
            // Then save to new seat
            await apiClient.saveGuest(draggedGuest, {
                id: targetSeat.id,
                tableId: targetSeat.tableId,
                seatNumber: targetSeat.seatNumber
            })
            
            // Update local state
            const updatedTables = tables.map(table => {
                const updatedSeats = table.seats.map(seat => {
                    // Clear original seat
                    if (seat.id === draggedFromSeat.id && seat.tableId === draggedFromSeat.tableId) {
                        return {
                            ...seat,
                            occupied: false,
                            guest: null
                        }
                    }
                    // Set new seat
                    if (seat.id === targetSeat.id && seat.tableId === targetSeat.tableId) {
                        return {
                            ...seat,
                            occupied: true,
                            guest: draggedGuest
                        }
                    }
                    return seat
                })
                
                const currentCount = updatedSeats.filter(s => s.occupied).length
                
                return {
                    ...table,
                    seats: updatedSeats,
                    currentCount
                }
            })
            
            setTables(updatedTables)
            console.log(`已将宾客 "${draggedGuest.name}" 移动到新座位`)
            
        } catch (error) {
            console.error('Failed to move guest:', error)
            console.error('移动失败，请重试')
        } finally {
            setDraggedGuest(null)
            setDraggedFromSeat(null)
        }
    }

    return {
        draggedGuest,
        draggedFromSeat,
        handleDragStart,
        handleDragOver,
        handleDrop
    }
}