import { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Tabs,
    Tab,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Container
} from '@mui/material'
import {
    People as PeopleIcon,
    Label as LabelIcon,
    ArrowBack as ArrowBackIcon,
    Refresh as RefreshIcon
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
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                    >
                        返回座位选择
                    </Button>
                    <Typography variant="h4" component="h1">
                        超级管理员面板
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={loadAllData}
                >
                    刷新数据
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab 
                            icon={<PeopleIcon />} 
                            label={`宾客数据管理 (${guests.length})`}
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<LabelIcon />} 
                            label={`关系标签管理 (${relationships.length})`}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                <Box sx={{ p: 3 }}>
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
                </Box>
            </Paper>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    📊 数据统计: {guests.length} 位宾客，{relationships.length} 个关系标签
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    💾 所有数据实时保存到服务器CSV文件中
                </Typography>
            </Box>
        </Container>
    )
}

export default AdminDashboard