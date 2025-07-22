import { useState } from 'react'
import { Button } from '@mui/material'

// Utils
import { apiClient } from '../utils/apiClient'

// Components
import RoundTableCard from './ui/RoundTableCard'
import AdminLoginModal from './admin/AdminLoginModal'
import TableNotesModal from './admin/TableNotesModal'
import AddTableModal from './admin/AddTableModal'
import GuestRegistrationModal from './guest/GuestRegistrationModal'
import PhoneVerificationModal from './guest/PhoneVerificationModal'

const SeatSelection = ({
    tables,
    setTables,
    adminMode,
    tableNotes,
    tableManagement,
    guestManagement,
    relationships,
    notification,
    onBackToInvitation,
    onOpenAdminDashboard,
    onRefreshData,
    onAddGuest,
    onEditTableNotes,
    onDeleteTable,
    onSeatClick,
    loadDataFromServer
}) => {
    // Drag and drop handlers (admin mode only)
    const [draggedSeat, setDraggedSeat] = useState(null)

    const handleDragStart = (seat) => {
        if (adminMode.isAdminMode && seat.occupied) {
            setDraggedSeat(seat)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
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

    const leftTables = tables
        .filter(table => table.side === 'left')
        .sort((a, b) => a.displayNumber - b.displayNumber)
    const rightTables = tables
        .filter(table => table.side === 'right')
        .sort((a, b) => a.displayNumber - b.displayNumber)

    return (
        <>
            <div className="min-h-screen bg-white">
                {/* Header Section - Fixed at top */}
                <div className="sticky top-3 z-10 bg-white">
                    <div className="mx-auto px-4">
                        {/* Title Icon */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={import.meta.env.VITE_DINNING_ICON_PATH}
                                alt="选座图标"
                                className="h-35 w-auto"
                            />
                        </div>
                        {adminMode.isAdminMode && (
                            <p className="text-xl text-center mb-3">
                                管理员模式
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center items-center gap-2 overflow-x-auto">
                            <Button
                                size="small"
                                onClick={onRefreshData}
                                sx={{
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    border: '1px dashed #9ca3af',
                                    borderRadius: '20px',
                                    minWidth: '48px',
                                    height: '32px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: '#f9fafb',
                                        borderColor: '#6b7280'
                                    }
                                }}
                            >
                                刷新
                            </Button>

                            <Button
                                size="small"
                                onClick={onBackToInvitation}
                                sx={{
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    border: '1px dashed #9ca3af',
                                    borderRadius: '20px',
                                    minWidth: '48px',
                                    height: '32px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: '#f9fafb',
                                        borderColor: '#6b7280'
                                    }
                                }}
                            >
                                返回
                            </Button>

                            {adminMode.isAdminMode && (
                                <Button
                                    size="small"
                                    onClick={tableManagement.handleAddTable}
                                    sx={{
                                        backgroundColor: 'white',
                                        color: '#374151',
                                        border: '1px dashed #9ca3af',
                                        borderRadius: '20px',
                                        minWidth: '48px',
                                        height: '32px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: '#f9fafb',
                                            borderColor: '#6b7280'
                                        }
                                    }}
                                >
                                    加桌
                                </Button>
                            )}

                            {adminMode.isAdminMode && (
                                <Button
                                    size="small"
                                    onClick={onOpenAdminDashboard}
                                    sx={{
                                        backgroundColor: 'white',
                                        color: '#374151',
                                        border: '1px dashed #9ca3af',
                                        borderRadius: '20px',
                                        minWidth: '48px',
                                        height: '32px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: '#f9fafb',
                                            borderColor: '#6b7280'
                                        }
                                    }}
                                >
                                    数据
                                </Button>
                            )}

                            {adminMode.isAdminMode ? (
                                <Button
                                    size="small"
                                    onClick={adminMode.handleAdminLogout}
                                    sx={{
                                        backgroundColor: 'white',
                                        color: '#374151',
                                        border: '1px dashed #9ca3af',
                                        borderRadius: '20px',
                                        minWidth: '48px',
                                        height: '32px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: '#f9fafb',
                                            borderColor: '#6b7280'
                                        }
                                    }}
                                >
                                    退出
                                </Button>
                            ) : (
                                <Button
                                    size="small"
                                    onClick={adminMode.openAdminLogin}
                                    sx={{
                                        backgroundColor: 'white',
                                        color: '#374151',
                                        border: '1px dashed #9ca3af',
                                        borderRadius: '20px',
                                        minWidth: '48px',
                                        height: '32px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: '#f9fafb',
                                            borderColor: '#6b7280'
                                        }
                                    }}
                                >
                                    管理
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-row justify-center  items-center mt-5 gap-30'>
                    <h2 className="text-lg font-semibold text-center mb-3 text-gray-700">左侧</h2>
                    <h2 className="text-lg font-semibold text-center mb-3 text-gray-700">右侧</h2>
                </div>
                {/* Scrollable Content Area */}
                <div className="overflow-y-auto" style={{ height: 'calc(100vh - 10px)' }}>
                    <div className="">
                        <div className="max-w-md mx-auto">
                            {/* Brick-style staggered layout - two columns with offset */}
                            <div className="flex gap-2">
                                {/* Left column */}
                                <div className="flex-1">
                                    <div className="space-y-6">
                                        {leftTables.map((table, index) => (
                                            <div
                                                key={table.id}
                                                style={{
                                                    marginTop: index % 2 === 1 ? '48px' : '0px'
                                                }}
                                            >
                                                <RoundTableCard
                                                    table={table}
                                                    isAdminMode={adminMode.isAdminMode}
                                                    draggedFromSeat={draggedSeat}
                                                    onAddGuest={onAddGuest}
                                                    onEditTableNotes={onEditTableNotes}
                                                    onDeleteTable={onDeleteTable}
                                                    onSeatClick={onSeatClick}
                                                    onDragStart={handleDragStart}
                                                    onDragOver={handleDragOver}
                                                    onDragEnter={handleDragEnter}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right column - offset by half table height */}
                                <div className="flex-1">
                                    <div className="space-y-6" style={{ marginTop: '96px' }}>
                                        {rightTables.map((table, index) => (
                                            <div
                                                key={table.id}
                                                style={{
                                                    marginTop: index % 2 === 1 ? '48px' : '0px'
                                                }}
                                            >
                                                <RoundTableCard
                                                    table={table}
                                                    isAdminMode={adminMode.isAdminMode}
                                                    draggedFromSeat={draggedSeat}
                                                    onAddGuest={onAddGuest}
                                                    onEditTableNotes={onEditTableNotes}
                                                    onDeleteTable={onDeleteTable}
                                                    onSeatClick={onSeatClick}
                                                    onDragStart={handleDragStart}
                                                    onDragOver={handleDragOver}
                                                    onDragEnter={handleDragEnter}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
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
                onDelete={async () => {
                    if (!guestManagement.seatToVerify || !guestManagement.seatToVerify.guest) return

                    const phoneNumber = guestManagement.seatToVerify.guest.phone
                    if (!phoneNumber || phoneNumber.length < 7) {
                        notification.showNotification('该宾客电话信息不完整，无法进行验证', 'warning')
                        guestManagement.setIsPhoneVerificationOpen(false)
                        return
                    }

                    const middleFour = phoneNumber.slice(3, 7)

                    if (guestManagement.phoneVerificationInput === middleFour) {
                        try {
                            await guestManagement.handleDeleteGuest(guestManagement.seatToVerify)
                            notification.showNotification('宾客删除成功', 'success')
                            guestManagement.setIsPhoneVerificationOpen(false)
                            guestManagement.setPhoneVerificationInput('')
                        } catch (error) {
                            notification.showNotification('删除失败，请重试', 'error')
                        }
                    } else {
                        notification.showNotification('验证失败，请重新输入正确的电话号码中间4位数字', 'warning')
                        guestManagement.setPhoneVerificationInput('')
                    }
                }}
            />

            {/* Notification Component */}
            <notification.NotificationComponent />
        </>
    )
}

export default SeatSelection