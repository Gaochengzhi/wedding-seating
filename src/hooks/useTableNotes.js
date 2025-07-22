import { useState } from 'react'
import { apiClient } from '../utils/apiClient'

export const useTableNotes = (tables, setTables, loadDataFromServer) => {
    const [isTableNotesOpen, setIsTableNotesOpen] = useState(false)
    const [selectedTable, setSelectedTable] = useState(null)
    const [tableNoteInput, setTableNoteInput] = useState('')

    const handleTableNotesEdit = (table) => {
        setSelectedTable(table)
        setTableNoteInput(table.notes || '')
        setIsTableNotesOpen(true)
    }

    const handleSaveTableNotes = async () => {
        if (!selectedTable) return
        
        try {
            // Save to backend
            await apiClient.updateTableNotes(selectedTable.id, tableNoteInput)
            
            // Reload data from server to get the updated table notes
            await loadDataFromServer()
            
            setIsTableNotesOpen(false)
            setSelectedTable(null)
            setTableNoteInput('')
            
            // Success notification will be handled by parent component
        } catch (error) {
            console.error('Failed to save table notes:', error)
            throw error // Let parent handle the error notification
        }
    }

    const closeTableNotesModal = () => {
        setIsTableNotesOpen(false)
        setSelectedTable(null)
        setTableNoteInput('')
    }

    return {
        isTableNotesOpen,
        selectedTable,
        tableNoteInput,
        setTableNoteInput,
        handleTableNotesEdit,
        handleSaveTableNotes,
        closeTableNotesModal
    }
}