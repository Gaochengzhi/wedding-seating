import { useState, useEffect } from 'react'
import { Button } from '@mui/material'

// Utils
import { apiClient } from './utils/apiClient'
import { initializeTables, processGuestDataFromServer, createTablesFromServer } from './utils/helpers'
import useNotification from './components/ui/Notification'

// Components
import WelcomePage from './components/WelcomePage'
import SeatSelection from './components/SeatSelection'
import AdminDashboard from './components/admin/AdminDashboard'

// Custom hooks
import { useAdminMode } from './hooks/useAdminMode'
import { useTableNotes } from './hooks/useTableNotes'
import { useTableManagement } from './hooks/useTableManagement'
import { useGuestManagement } from './hooks/useGuestManagement'
import { useRelationships } from './hooks/useRelationships'

function App() {
    // Initialize currentView from sessionStorage to maintain state across refreshes
    const [currentView, setCurrentView] = useState(() => {
        // In development, default to seatSelection for better UX
        if (window.location.hostname === 'localhost') {
            return sessionStorage.getItem('currentView') || 'seatSelection'
        }
        return sessionStorage.getItem('currentView') || 'invitation'
    })

    const [invitationCode, setInvitationCode] = useState('')
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false)
    const [tables, setTables] = useState(initializeTables())

    // Save currentView to sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('currentView', currentView)
    }, [currentView])

    // Define loadDataFromServer function first
    const loadDataFromServer = async () => {
        try {
            // Load both guests and tables data
            const [guestsResponse, tablesResponse] = await Promise.all([
                apiClient.getAllGuests(),
                apiClient.getAllTables()
            ])

            const guests = guestsResponse.data
            const serverTables = tablesResponse.data

            // Create tables structure from server data
            const tablesFromServer = createTablesFromServer(serverTables)

            if (guests.length > 0) {
                // Process guest data and merge with table structure
                const updatedTables = processGuestDataFromServer(guests, tablesFromServer)
                setTables(updatedTables)
            } else {
                setTables(tablesFromServer)
            }
        } catch (error) {
            console.error('Failed to load data from server:', error)
            // Fall back to empty state
            setTables(initializeTables())
        }
    }

    // Custom hooks (after loadDataFromServer is defined)
    const adminMode = useAdminMode()
    const tableNotes = useTableNotes(tables, setTables, loadDataFromServer)
    const tableManagement = useTableManagement(tables, setTables, loadDataFromServer)
    const guestManagement = useGuestManagement(tables, setTables)
    const relationships = useRelationships()
    const notification = useNotification()

    // Load data from backend on component mount
    useEffect(() => {
        loadDataFromServer()
    }, [])

    // Direct view change
    const changeView = (newView) => {
        setCurrentView(newView)
    }

    const handleOpenSeatSelection = () => {
        if (window.location.hostname === 'localhost') {
            setInvitationCode('5201314')
            changeView('seatSelection')
        } else {
            setIsInvitationModalOpen(true)
        }
    }

    const handleInvitationSubmit = () => {
        if (invitationCode === import.meta.env.VITE_INVITATION_CODE) {
            setIsInvitationModalOpen(false)
            changeView('seatSelection')
        } else {
            notification.showNotification('邀请码错误', 'error')
        }
    }

    const handleRefreshData = async () => {
        try {
            await loadDataFromServer()
            notification.showNotification('数据已刷新', 'success')
        } catch (error) {
            notification.showNotification('刷新失败，请重试', 'error')
        }
    }

    // Handle seat click with proper guest management
    const handleSeatClick = (seat) => {
        if (adminMode.isAdminMode) {
            // Admin mode: direct edit without verification
            if (seat.occupied) {
                guestManagement.handleEditGuestDirect(seat)
            } else {
                // Open registration for empty seat
                guestManagement.setSelectedSeat(seat)
                guestManagement.resetGuestData()
                guestManagement.setIsRegistrationModalOpen(true)
            }
        } else {
            // Regular user mode: need phone verification for occupied seats
            if (seat.occupied) {
                guestManagement.setSeatToVerify(seat)
                guestManagement.setVerificationAction('edit')
                guestManagement.setPhoneVerificationInput('')
                guestManagement.setIsPhoneVerificationOpen(true)
            } else {
                // Open registration for empty seat
                guestManagement.setSelectedSeat(seat)
                guestManagement.resetGuestData()
                guestManagement.setIsRegistrationModalOpen(true)
            }
        }
    }

    const handleAddGuest = (tableId) => {
        const table = tables.find(t => t.id === tableId)
        if (!table) return

        // Find first empty seat
        let emptySeat = table.seats.find(seat => !seat.occupied)
        
        if (!emptySeat) {
            // Check if we've reached the maximum reasonable capacity
            const maxSeatsPerTable = parseInt(import.meta.env.VITE_MAX_SEATS_PER_TABLE) || 16
            if (table.seats.length >= maxSeatsPerTable) {
                notification.showNotification(`这张桌子座位已达上限 (${maxSeatsPerTable}人)`, 'warning')
                return
            }

            // Create a new seat dynamically
            const nextSeatNumber = table.seats.length + 1
            const newSeat = {
                id: `${table.id}_seat_${table.seats.length}`,
                tableId: table.id,
                seatNumber: nextSeatNumber,
                occupied: false,
                guest: null
            }
            
            // Update table state with new seat
            const updatedTables = tables.map(t => {
                if (t.id === tableId) {
                    return {
                        ...t,
                        seats: [...t.seats, newSeat],
                        extendedCapacity: t.seats.length + 1
                    }
                }
                return t
            })
            
            setTables(updatedTables)
            emptySeat = newSeat
            
            notification.showNotification(`为${table.displayNumber}桌添加了第${nextSeatNumber}个座位`, 'success')
        }

        guestManagement.setSelectedSeat(emptySeat)
        guestManagement.resetGuestData()
        guestManagement.setIsRegistrationModalOpen(true)
    }

    const handleEditTableNotes = (table) => {
        tableNotes.handleTableNotesEdit(table)
    }

    const handleDeleteTable = (tableId) => {
        tableManagement.handleDeleteTable(tableId)
    }

    const handleOpenAdminDashboard = () => {
        changeView('adminDashboard')
    }

    const handleBackFromAdmin = () => {
        changeView('seatSelection')
    }

    const handleBackToInvitation = () => {
        changeView('invitation')
    }


    // Render current view with transition effects
    const renderView = () => {
        if (currentView === 'seatSelection') {
            return (
                <SeatSelection
                    tables={tables}
                    setTables={setTables}
                    adminMode={adminMode}
                    tableNotes={tableNotes}
                    tableManagement={tableManagement}
                    guestManagement={guestManagement}
                    relationships={relationships}
                    notification={notification}
                    onBackToInvitation={handleBackToInvitation}
                    onOpenAdminDashboard={handleOpenAdminDashboard}
                    onRefreshData={handleRefreshData}
                    onAddGuest={handleAddGuest}
                    onEditTableNotes={handleEditTableNotes}
                    onDeleteTable={handleDeleteTable}
                    onSeatClick={handleSeatClick}
                    loadDataFromServer={loadDataFromServer}
                />
            )
        }

        if (currentView === 'adminDashboard') {
            return (
                <AdminDashboard
                    onBack={handleBackFromAdmin}
                    refreshTableData={loadDataFromServer}
                />
            )
        }

        // Invitation view
        return (
            <div>
                <WelcomePage onOpenSeatSelection={handleOpenSeatSelection} />

                {/* Invitation code modal */}
                {isInvitationModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" 
                             style={{
                                 borderRadius: '16px',
                                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                 border: 'none'
                             }}>
                            <h2 className="text-xl font-medium mb-6 text-center text-gray-700" 
                                style={{
                                    fontFamily: 'serif',
                                    color: '#374151'
                                }}>
                                请输入邀请码
                            </h2>
                            <input
                                type="password"
                                className="w-full border-0 border-b border-gray-200 px-0 py-3 mb-6 text-center text-lg tracking-widest focus:border-gray-400 focus:outline-none"
                                style={{
                                    borderBottom: '1px solid #E5E7EB',
                                    fontSize: '1.25rem',
                                    letterSpacing: '0.5rem',
                                    textAlign: 'center'
                                }}
                                value={invitationCode}
                                onChange={(e) => setInvitationCode(e.target.value)}
                                placeholder="请输入邀请码"
                            />
                            <div className="flex gap-3">
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsInvitationModalOpen(false)}
                                    fullWidth
                                    sx={{
                                        borderStyle: 'dashed',
                                        borderWidth: '1px',
                                        borderColor: '#9CA3AF',
                                        color: '#6B7280',
                                        borderRadius: '20px',
                                        padding: '10px 24px',
                                        '&:hover': {
                                            borderColor: '#6B7280',
                                            backgroundColor: '#F9FAFB'
                                        }
                                    }}
                                >
                                    取消
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleInvitationSubmit}
                                    fullWidth
                                    sx={{
                                        borderStyle: 'dashed',
                                        borderWidth: '1px',
                                        borderColor: '#6B7280',
                                        color: '#374151',
                                        borderRadius: '20px',
                                        padding: '10px 24px',
                                        fontWeight: 'medium',
                                        '&:hover': {
                                            borderColor: '#374151',
                                            backgroundColor: '#F9FAFB'
                                        }
                                    }}
                                >
                                    确认
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {renderView()}
            {/* Notification Component */}
            <div className="fixed bottom-0 right-0 z-50">
                <notification.NotificationComponent />
            </div>
        </div>
    )
}

export default App