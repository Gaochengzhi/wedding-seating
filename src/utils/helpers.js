// Helper function to mask name (e.g. "高成志" -> "高*志")
export const maskName = (name) => {
    if (!name || name.length < 2) return name
    if (name.length === 2) {
        return name[0] + '*'
    }
    // For names with 3+ characters, show first and last, mask middle
    return name[0] + '*' + name[name.length - 1]
}

// Initialize tables data structure
export const initializeTables = () => {
    const tables = []

    // Create 22 tables (11 on each side)
    for (let i = 1; i <= 22; i++) {
        const side = i <= 11 ? 'left' : 'right'
        const tableNumber = side === 'left' ? i : i - 11

        tables.push({
            id: `table_${i}`,
            number: i,
            displayNumber: tableNumber,
            side: side,
            maxCapacity: 12,
            extendedCapacity: 12,
            currentCount: 0,
            seats: Array(12).fill(null).map((_, seatIndex) => ({
                id: `table_${i}_seat_${seatIndex}`,
                tableId: `table_${i}`,
                seatNumber: seatIndex + 1,
                occupied: false,
                guest: null
            })),
            notes: ''
        })
    }

    return tables
}

// Validate guest data
export const validateGuestData = (guestData) => {
    const errors = []

    if (!guestData.name.trim()) {
        errors.push('请填写姓名')
    }

    if (!guestData.gender) {
        errors.push('请选择性别')
    }

    if (!guestData.phone.trim()) {
        errors.push('请填写电话号码')
    } else if (!/^\d{11}$/.test(guestData.phone)) {
        errors.push('请输入正确的11位电话号码')
    }

    if (!guestData.relationship) {
        errors.push('请选择关系')
    }

    return errors
}

// Merge table notes from server with local table structure
export const mergeTableNotes = (localTables, serverTables) => {
    return localTables.map(localTable => {
        const serverTable = serverTables.find(st => st.tableid === localTable.id)
        return {
            ...localTable,
            notes: serverTable?.notes || ''
        }
    })
}

// Create tables structure from server data
export const createTablesFromServer = (serverTables) => {
    const tables = serverTables.map(serverTable => ({
        id: serverTable.tableid,
        number: parseInt(serverTable.tableid.replace('table_', '')),
        displayNumber: parseInt(serverTable.displaynumber),
        side: serverTable.side,
        maxCapacity: 12,
        extendedCapacity: 12,
        currentCount: 0,
        seats: Array(12).fill(null).map((_, seatIndex) => ({
            id: `${serverTable.tableid}_seat_${seatIndex}`,
            tableId: serverTable.tableid,
            seatNumber: seatIndex + 1,
            occupied: false,
            guest: null
        })),
        notes: serverTable.notes || ''
    }))
    
    // Sort tables by side first, then by display number
    return tables.sort((a, b) => {
        // First sort by side (left first, then right)
        if (a.side !== b.side) {
            return a.side === 'left' ? -1 : 1
        }
        // Then sort by display number within each side
        return a.displayNumber - b.displayNumber
    })
}

// Load and process guest data from server
export const processGuestDataFromServer = (guests, tables) => {
    if (guests.length === 0) {
        return tables
    }

    // Filter out empty guest records (backend now returns lowercase fields)
    const validGuests = guests.filter(g => g.name && g.name.trim() !== '')

    const updatedTables = tables.map(table => {
        // Find all guests for this table
        const tableGuests = validGuests.filter(g => g.tableid === table.id)
        
        // Start with the base 12 seats from freshTables
        let tableSeats = [...table.seats]
        
        // Check if we need to add extended seats (seat numbers > 12)
        const maxSeatNumber = Math.max(0, ...tableGuests.map(g => parseInt(g.seatnumber) || 0))
        if (maxSeatNumber > 12) {
            // Add extended seats
            for (let i = 13; i <= maxSeatNumber; i++) {
                tableSeats.push({
                    id: `${table.id}_seat_${i-1}`,
                    tableId: table.id,
                    seatNumber: i,
                    occupied: false,
                    guest: null
                })
            }
        }
        
        // Map guests to seats
        const updatedSeats = tableSeats.map(seat => {
            const savedGuest = tableGuests.find(g => 
                g.seatid === seat.id && g.tableid === seat.tableId
            )
            
            if (savedGuest) {
                return {
                    ...seat,
                    occupied: true,
                    guest: {
                        name: savedGuest.name,
                        gender: savedGuest.gender,
                        phone: savedGuest.phone,
                        notes: savedGuest.notes,
                        accommodation: savedGuest.accommodation === true || savedGuest.accommodation === 'Yes',
                        relationship: savedGuest.relationship
                    }
                }
            }
            return seat
        })
        
        const currentCount = updatedSeats.filter(seat => seat.occupied).length
        const extendedCapacity = Math.max(12, maxSeatNumber)
        
        return {
            ...table,
            seats: updatedSeats,
            currentCount,
            extendedCapacity
        }
    })

    return updatedTables
}