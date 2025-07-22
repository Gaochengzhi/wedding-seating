import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { Refresh as RefreshIcon, AdminPanelSettings as AdminIcon, Logout as LogoutIcon, Add as AddIcon, Dashboard as DashboardIcon } from '@mui/icons-material'

// Utils
import { apiClient } from './utils/apiClient'
import { initializeTables, processGuestDataFromServer, createTablesFromServer, maskName } from './utils/helpers'
import useNotification from './components/ui/Notification'

// Components
import WelcomePage from './components/WelcomePage'
import TableCard from './components/ui/TableCard'
import AdminLoginModal from './components/admin/AdminLoginModal'
import TableNotesModal from './components/admin/TableNotesModal'
import AddTableModal from './components/admin/AddTableModal'
import AdminDashboard from './components/admin/AdminDashboard'
import GuestRegistrationModal from './components/guest/GuestRegistrationModal'
import PhoneVerificationModal from './components/guest/PhoneVerificationModal'

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

    const handleOpenSeatSelection = () => {
        if (window.location.hostname === 'localhost') {
            setInvitationCode('5201314')
            setCurrentView('seatSelection')
        } else {
            setIsInvitationModalOpen(true)
        }
    }

    const handleInvitationSubmit = () => {
        if (invitationCode === import.meta.env.VITE_INVITATION_CODE) {
            setIsInvitationModalOpen(false)
            setCurrentView('seatSelection')
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
        const emptySeat = table.seats.find(seat => !seat.occupied)
        if (!emptySeat) {
            notification.showNotification('这张桌子已经满了', 'warning')
            return
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
        setCurrentView('adminDashboard')
    }

    const handleBackFromAdmin = () => {
        setCurrentView('seatSelection')
    }

    // Drag and drop handlers (admin mode only)
    const [draggedSeat, setDraggedSeat] = useState(null)

    const handleDragStart = (seat) => {
        if (adminMode.isAdminMode && seat.occupied) {
            setDraggedSeat(seat)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDrop = async (targetSeat) => {
        if (!adminMode.isAdminMode || !draggedSeat || !targetSeat) return

        // Can't drop on occupied seat
        if (targetSeat.occupied) {
            notification.showNotification('目标座位已被占用', 'warning')
            setDraggedSeat(null)
            return
        }

        // Can't drop on same seat
        if (draggedSeat.id === targetSeat.id) {
            setDraggedSeat(null)
            return
        }

        try {
            // Move guest to new seat - SAFER APPROACH: Save first, then delete
            const guestData = draggedSeat.guest

            // STEP 1: First save guest to new seat
            const newGuestData = {
                name: guestData.name,
                gender: guestData.gender,
                phone: guestData.phone,
                relationship: guestData.relationship,
                notes: guestData.notes || '',
                accommodation: guestData.accommodation || false
            }

            const newSeatData = {
                id: targetSeat.id,
                tableId: targetSeat.tableId,
                seatNumber: targetSeat.seatNumber
            }

            // Save to new seat first (CRITICAL: do this before deleting from old seat)
            await apiClient.saveGuest(newGuestData, newSeatData)

            // STEP 2: Only delete from old seat AFTER successful save
            await apiClient.deleteGuest(draggedSeat.id, draggedSeat.tableId)

            // STEP 3: Reload data to reflect changes
            await loadDataFromServer()

            notification.showNotification('宾客移动成功', 'success')
            setDraggedSeat(null)
        } catch (error) {
            console.error('Failed to move guest:', error)
            notification.showNotification(`移动失败: ${error.message}`, 'error')
            setDraggedSeat(null)

            // If something went wrong, reload data to ensure consistency
            try {
                await loadDataFromServer()
            } catch (reloadError) {
                console.error('Failed to reload data after move error:', reloadError)
            }
        }
    }

    if (currentView === 'seatSelection') {
        const leftTables = tables
            .filter(table => table.side === 'left')
            .sort((a, b) => a.displayNumber - b.displayNumber)
        const rightTables = tables
            .filter(table => table.side === 'right')
            .sort((a, b) => a.displayNumber - b.displayNumber)

        return (
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">在线选座</h1>
                            {adminMode.isAdminMode && (
                                <p className="text-sm text-orange-600 mt-1">
                                    🛡️ 管理员模式
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={handleRefreshData}
                            >
                                刷新数据
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setCurrentView('invitation')}
                            >
                                返回邀请函
                            </Button>
                            {adminMode.isAdminMode && (
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={tableManagement.handleAddTable}
                                    color="success"
                                >
                                    添加桌子
                                </Button>
                            )}
                            {adminMode.isAdminMode && (
                                <Button
                                    variant="contained"
                                    startIcon={<DashboardIcon />}
                                    onClick={handleOpenAdminDashboard}
                                    color="primary"
                                >
                                    管理面板
                                </Button>
                            )}
                            {adminMode.isAdminMode ? (
                                <Button
                                    variant="contained"
                                    color="warning"
                                    startIcon={<LogoutIcon />}
                                    onClick={adminMode.handleAdminLogout}
                                >
                                    退出管理
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    startIcon={<AdminIcon />}
                                    onClick={adminMode.openAdminLogin}
                                >
                                    管理员
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-8 justify-center">
                        {/* Left side tables */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold text-center">左侧</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {leftTables.map(table => (
                                    <TableCard
                                        key={table.id}
                                        table={table}
                                        isAdminMode={adminMode.isAdminMode}
                                        draggedFromSeat={draggedSeat}
                                        onAddGuest={handleAddGuest}
                                        onEditTableNotes={handleEditTableNotes}
                                        onDeleteTable={handleDeleteTable}
                                        onSeatClick={handleSeatClick}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* T-stage in the middle */}
                        <div className="flex flex-col items-center justify-center px-8">
                            <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg p-8 text-center shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">主舞台</h2>
                                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center">
                                    <span className="text-2xl">♥</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-700">T台展示区</p>
                            </div>
                        </div>

                        {/* Right side tables */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold text-center">右侧</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {rightTables.map(table => (
                                    <TableCard
                                        key={table.id}
                                        table={table}
                                        isAdminMode={adminMode.isAdminMode}
                                        draggedFromSeat={draggedSeat}
                                        onAddGuest={handleAddGuest}
                                        onEditTableNotes={handleEditTableNotes}
                                        onDeleteTable={handleDeleteTable}
                                        onSeatClick={handleSeatClick}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <AdminLoginModal
                    open={adminMode.isAdminLoginOpen}
                    onClose={adminMode.closeAdminLogin}
                    credentials={adminMode.adminCredentials}
                    onCredentialsChange={adminMode.setAdminCredentials}
                    onLogin={adminMode.handleAdminLogin}
                />

                <TableNotesModal
                    open={tableNotes.isTableNotesOpen}
                    onClose={tableNotes.closeTableNotesModal}
                    table={tableNotes.selectedTable}
                    noteInput={tableNotes.tableNoteInput}
                    onNoteInputChange={tableNotes.setTableNoteInput}
                    onSave={tableNotes.handleSaveTableNotes}
                />

                <AddTableModal
                    open={tableManagement.isAddTableOpen}
                    onClose={tableManagement.closeAddTableModal}
                    tableData={tableManagement.newTableData}
                    onTableDataChange={tableManagement.setNewTableData}
                    onSave={tableManagement.handleSaveNewTable}
                />

                {/* Guest Registration Modal */}
                <GuestRegistrationModal
                    open={guestManagement.isRegistrationModalOpen}
                    onClose={() => guestManagement.setIsRegistrationModalOpen(false)}
                    isEditing={guestManagement.selectedSeat?.occupied}
                    guestData={guestManagement.guestData}
                    onGuestDataChange={guestManagement.setGuestData}
                    onSubmit={guestManagement.handleRegistrationSubmit}
                    relationships={relationships.relationships}
                />

                {/* Phone Verification Modal */}
                <PhoneVerificationModal
                    open={guestManagement.isPhoneVerificationOpen}
                    onClose={() => guestManagement.setIsPhoneVerificationOpen(false)}
                    verificationAction={guestManagement.verificationAction}
                    guestPhone={guestManagement.seatToVerify?.guest?.phone}
                    phoneInput={guestManagement.phoneVerificationInput}
                    onPhoneInputChange={guestManagement.setPhoneVerificationInput}
                    onVerify={guestManagement.handlePhoneVerification}
                />

                {/* Notification Component */}
                <notification.NotificationComponent />
            </div>
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
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h2 className="text-lg font-semibold mb-4">请输入邀请码</h2>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2 mb-4"
                            value={invitationCode}
                            onChange={(e) => setInvitationCode(e.target.value)}
                            placeholder="请输入邀请码"
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="outlined"
                                onClick={() => setIsInvitationModalOpen(false)}
                                fullWidth
                            >
                                取消
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleInvitationSubmit}
                                fullWidth
                            >
                                确认
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Component */}
            <notification.NotificationComponent />
        </div>
    )
}

export default App