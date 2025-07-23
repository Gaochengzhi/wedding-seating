import { useState } from 'react'
import { apiClient } from '../utils/apiClient'
import { validateGuestData } from '../utils/helpers'

export const useGuestManagement = (tables, setTables) => {
    // Guest registration modal state
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
    const [selectedSeat, setSelectedSeat] = useState(null)
    const [guestData, setGuestData] = useState({
        name: '',
        gender: '',
        phone: '',
        notes: '',
        accommodation: false,
        relationship: ''
    })

    // Phone verification state
    const [isPhoneVerificationOpen, setIsPhoneVerificationOpen] = useState(false)
    const [phoneVerificationInput, setPhoneVerificationInput] = useState('')
    const [seatToVerify, setSeatToVerify] = useState(null)
    const [verificationAction, setVerificationAction] = useState('') // 'edit' or 'delete'

    const resetGuestData = () => {
        setGuestData({
            name: '',
            gender: '',
            phone: '',
            notes: '',
            accommodation: false,
            relationship: ''
        })
    }

    const handleRegistrationSubmit = async () => {
        // Validate required fields
        const errors = validateGuestData(guestData)
        if (errors.length > 0) {
            console.warn('请填写所有必填项：' + errors.join('、'))
            // Use a more gentle notification instead of alert
            return
        }

        try {
            // Save to backend
            await apiClient.saveGuest(guestData, {
                id: selectedSeat.id,
                tableId: selectedSeat.tableId,
                seatNumber: selectedSeat.seatNumber
            })

            // Update local tables state
            const updatedTables = tables.map(table => {
                if (table.id === selectedSeat.tableId) {
                    const updatedSeats = table.seats.map(seat => {
                        if (seat.id === selectedSeat.id) {
                            return {
                                ...seat,
                                occupied: true,
                                guest: guestData
                            }
                        }
                        return seat
                    })

                    const newCurrentCount = updatedSeats.filter(seat => seat.occupied).length

                    return {
                        ...table,
                        seats: updatedSeats,
                        currentCount: newCurrentCount
                    }
                }
                return table
            })

            setTables(updatedTables)

            // Close modal and reset state
            setIsRegistrationModalOpen(false)
            setSelectedSeat(null)
            resetGuestData()

        } catch (error) {
            console.error('Failed to save guest:', error)
            // Use a more gentle notification instead of alert
            // alert('保存失败，请重试')
            console.error('保存失败，请重试')
        }
    }

    const handleEditGuestDirect = (seat) => {
        // Direct edit for admin mode
        setSelectedSeat(seat)
        setGuestData({
            name: seat.guest?.name || '',
            gender: seat.guest?.gender || '',
            phone: seat.guest?.phone || '',
            notes: seat.guest?.notes || '',
            accommodation: seat.guest?.accommodation || false,
            relationship: seat.guest?.relationship || ''
        })
        setIsRegistrationModalOpen(true)
    }

    const handlePhoneVerification = () => {
        if (!seatToVerify || !seatToVerify.guest) return

        const phoneNumber = seatToVerify.guest.phone
        if (!phoneNumber || phoneNumber.length < 7) {
            console.warn('该宾客电话信息不完整，无法进行验证')
            setIsPhoneVerificationOpen(false)
            return
        }

        const middleFour = phoneNumber.slice(3, 7) // Get middle 4 digits

        if (phoneVerificationInput === middleFour) {
            // Verification successful
            if (verificationAction === 'edit') {
                handleEditGuestDirect(seatToVerify)
            } else if (verificationAction === 'delete') {
                handleDeleteGuest(seatToVerify)
            }
            setIsPhoneVerificationOpen(false)
        } else {
            console.warn('验证失败，请重新输入正确的电话号码中间4位数字')
            setPhoneVerificationInput('')
        }
    }

    const handleDeleteGuest = async (seat) => {
        try {
            await apiClient.deleteGuest(seat.id, seat.tableId)

            // Update local state
            const updatedTables = tables.map(table => {
                if (table.id === seat.tableId) {
                    const updatedSeats = table.seats.map(s => {
                        if (s.id === seat.id) {
                            return {
                                ...s,
                                occupied: false,
                                guest: null
                            }
                        }
                        return s
                    })

                    const newCurrentCount = updatedSeats.filter(s => s.occupied).length

                    return {
                        ...table,
                        seats: updatedSeats,
                        currentCount: newCurrentCount
                    }
                }
                return table
            })

            setTables(updatedTables)

        } catch (error) {
            console.error('Failed to delete guest:', error)
            console.error('删除失败，请重试')
        }
    }

    return {
        // Guest registration modal
        isRegistrationModalOpen,
        setIsRegistrationModalOpen,
        selectedSeat,
        setSelectedSeat,
        guestData,
        setGuestData,
        resetGuestData,
        handleRegistrationSubmit,

        // Phone verification
        isPhoneVerificationOpen,
        setIsPhoneVerificationOpen,
        phoneVerificationInput,
        setPhoneVerificationInput,
        seatToVerify,
        setSeatToVerify,
        verificationAction,
        setVerificationAction,
        handlePhoneVerification,

        // Guest operations
        handleEditGuestDirect,
        handleDeleteGuest
    }
}