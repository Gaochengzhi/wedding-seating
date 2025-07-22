import { useState } from 'react'
import { apiClient } from '../utils/apiClient'

export const useTableManagement = (tables, setTables, loadDataFromServer) => {
    const [isAddTableOpen, setIsAddTableOpen] = useState(false)
    const [newTableData, setNewTableData] = useState({
        displayNumber: '',
        side: 'left',
        notes: ''
    })

    const handleAddTable = () => {
        // Find next available display number for the selected side
        const tablesOnSide = tables.filter(t => t.side === newTableData.side)
        const maxDisplayNumber = Math.max(0, ...tablesOnSide.map(t => t.displayNumber))
        
        setNewTableData({
            ...newTableData,
            displayNumber: maxDisplayNumber + 1
        })
        setIsAddTableOpen(true)
    }

    const handleSaveNewTable = async () => {
        if (!newTableData.displayNumber || !newTableData.side) {
            console.warn('请填写桌号和位置')
            return
        }

        try {
            // Save to backend
            await apiClient.addTable(
                parseInt(newTableData.displayNumber), 
                newTableData.side, 
                newTableData.notes
            )
            
            // Reload data from server
            await loadDataFromServer()
            
            setIsAddTableOpen(false)
            setNewTableData({
                displayNumber: '',
                side: 'left',
                notes: ''
            })
            
            // Success notification will be handled by parent component
        } catch (error) {
            console.error('Failed to add table:', error)
            throw error // Let parent handle the error notification
        }
    }

    const handleDeleteTable = async (tableId) => {
        const table = tables.find(t => t.id === tableId)
        if (!table) return

        const hasGuests = table.seats.some(seat => seat.occupied)
        
        if (hasGuests) {
            if (!confirm(`${table.displayNumber}桌还有宾客，确定要删除吗？这将删除该桌的所有宾客信息。`)) {
                return
            }
        } else {
            if (!confirm(`确认删除${table.displayNumber}桌吗？`)) {
                return
            }
        }

        try {
            // Delete from backend
            await apiClient.deleteTable(tableId)
            
            // Reload data from server
            await loadDataFromServer()
            
            console.log('桌子删除成功')
        } catch (error) {
            console.error('Failed to delete table:', error)
            console.error('删除桌子失败，请重试')
        }
    }

    const closeAddTableModal = () => {
        setIsAddTableOpen(false)
        setNewTableData({
            displayNumber: '',
            side: 'left',
            notes: ''
        })
    }

    return {
        isAddTableOpen,
        newTableData,
        setNewTableData,
        handleAddTable,
        handleSaveNewTable,
        handleDeleteTable,
        closeAddTableModal
    }
}