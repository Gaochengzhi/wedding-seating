import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Container,
    IconButton,
} from '@mui/material'
import {
    ArrowBack as ArrowBackIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import { apiClient } from '../../utils/apiClient'
import GuestDataTable from './GuestDataTable'
import RelationshipManager from './RelationshipManager'

const AdminDashboard = ({ onBack, refreshTableData }) => {
    const [activeTab, setActiveTab] = useState(0)
    const [guests, setGuests] = useState([])
    const [relationships, setRelationships] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = async () => {
        setLoading(true)
        setError(null)

        try {
            const [guestsResponse, relationshipsResponse] = await Promise.all([
                apiClient.getAllGuests(),
                apiClient.getAllRelationships()
            ])

            setGuests(guestsResponse.data || [])
            setRelationships(relationshipsResponse.data || [])
        } catch (error) {
            console.error('Failed to load admin data:', error)
            setError('加载数据失败: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    // Guest management functions
    const handleUpdateGuest = async (originalGuest, updatedData) => {
        try {
            // For updating, we need to delete the old and add the new
            await apiClient.deleteGuest(originalGuest.seatid, originalGuest.tableid)

            // Add updated guest data
            const guestData = {
                name: updatedData.name,
                gender: updatedData.gender,
                phone: updatedData.phone,
                relationship: updatedData.relationship,
                notes: updatedData.notes,
                accommodation: updatedData.accommodation
            }

            const seatData = {
                id: originalGuest.seatid,
                tableId: originalGuest.tableid,
                seatNumber: originalGuest.seatnumber
            }

            await apiClient.saveGuest(guestData, seatData)

            // Refresh data
            await loadAllData()
            if (refreshTableData) {
                await refreshTableData()
            }

        } catch (error) {
            console.error('Failed to update guest:', error)
            alert('更新失败: ' + error.message)
        }
    }

    const handleDeleteGuest = async (guest) => {
        try {
            await apiClient.deleteGuest(guest.seatid, guest.tableid)

            // Refresh data
            await loadAllData()
            if (refreshTableData) {
                await refreshTableData()
            }

        } catch (error) {
            console.error('Failed to delete guest:', error)
            alert('删除失败: ' + error.message)
        }
    }

    // Relationship management functions
    const handleAddRelationship = async (value, label, category) => {
        try {
            await apiClient.addRelationship(value, label, category)
            await loadAllData()
        } catch (error) {
            console.error('Failed to add relationship:', error)
            throw error
        }
    }

    const handleUpdateRelationship = async (value, label, category, order) => {
        try {
            await apiClient.updateRelationship(value, label, category, order)
            await loadAllData()
        } catch (error) {
            console.error('Failed to update relationship:', error)
            throw error
        }
    }

    const handleDeleteRelationship = async (value) => {
        try {
            await apiClient.deleteRelationship(value)
            await loadAllData()
        } catch (error) {
            console.error('Failed to delete relationship:', error)
            throw error
        }
    }

    const handleReorderRelationships = async (reorderedRelationships) => {
        try {
            await apiClient.reorderRelationships(reorderedRelationships)
            await loadAllData()
        } catch (error) {
            console.error('Failed to reorder relationships:', error)
            throw error
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>加载管理面板...</Typography>
            </Box>
        )
    }

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-3 sm:p-4 bg-white border-b-2 border-dashed border-gray-200">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-row sm:items-center gap-3">
                        <IconButton
                            onClick={onBack}
                            sx={{
                                backgroundColor: 'white',
                                borderColor: '#9CA3AF',
                                border: '2px solid',
                                borderRadius: '50%',
                                color: '#374151',
                                width: 32,
                                height: 32,
                                '&:hover': {
                                    backgroundColor: '#F9FAFB',
                                    borderColor: '#6B7280',
                                }
                            }}
                        >
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                        <Typography
                            variant="h5"
                            component="h1"
                            className="text-gray-800 font-medium text-lg sm:text-xl"
                        >
                            管理员面板
                        </Typography>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-2 border-dashed border-red-300 rounded-lg">
                        <Typography className="text-red-700 text-sm">
                            {error}
                        </Typography>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="mb-4">
                    <div className="flex flex-row gap-2">
                        <div
                            onClick={() => setActiveTab(0)}
                            className={`px-3 flex justify-center items-center py-1.5 rounded-full text-xs font-medium border-2 transition-all duration-200 ${activeTab === 0
                                ? 'bg-gray-200 border-gray-800 text-gray-800'
                                : 'bg-white border-gray-800 text-gray-800 hover:bg-gray-50'
                                }`}
                            style={{ borderStyle: 'solid' }}
                        >
                            宾客数据 ({guests.length})
                        </div>
                        <div
                            onClick={() => setActiveTab(1)}
                            className={`px-3 flex justify-center items-center py-1.5 rounded-full text-xs font-medium border-2 transition-all duration-200 ${activeTab === 1
                                ? 'bg-gray-200 border-gray-800 text-gray-800'
                                : 'bg-white border-gray-800 text-gray-800 hover:bg-gray-50'
                                }`}
                            style={{ borderStyle: 'solid' }}
                        >
                            关系标签 ({relationships.length})
                        </div>
                        <IconButton
                            onClick={loadAllData}
                            sx={{
                                backgroundColor: 'white',
                                borderColor: '#9CA3AF',
                                border: '2px solid',
                                borderRadius: '50%',
                                color: '#374151',
                                width: 32,
                                height: 32,
                                '&:hover': {
                                    backgroundColor: '#F9FAFB',
                                    borderColor: '#6B7280',
                                }
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </div>
                </div>
            </div>

            {/* Main Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-4 py-4"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain',
                    minHeight: 0
                }}
            >

                <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg">
                    {activeTab === 0 && (
                        <GuestDataTable
                            guests={guests}
                            relationships={relationships}
                            onUpdateGuest={handleUpdateGuest}
                            onDeleteGuest={handleDeleteGuest}
                        />
                    )}

                    {activeTab === 1 && (
                        <RelationshipManager
                            relationships={relationships}
                            onAddRelationship={handleAddRelationship}
                            onUpdateRelationship={handleUpdateRelationship}
                            onDeleteRelationship={handleDeleteRelationship}
                            onReorderRelationships={handleReorderRelationships}
                        />
                    )}
                </div>

                {/* Stats at bottom */}
                <div className="mt-4 p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                    <Typography variant="body2" className="text-gray-600 text-sm">
                        数据统计: {guests.length} 位宾客，{relationships.length} 个关系标签
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard