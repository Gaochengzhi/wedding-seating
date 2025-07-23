// CSV file management utilities for guest data

export const CSV_HEADERS = [
    'name',
    'gender', 
    'phone',
    'notes',
    'accommodation',
    'relationship',
    'tableId',
    'seatId',
    'timestamp'
]

export const csvRowToString = (guestData, seatInfo) => {
    const row = [
        `"${guestData.name}"`,
        guestData.gender,
        guestData.phone,
        `"${guestData.notes || ''}"`,
        guestData.accommodation ? 'Yes' : 'No',
        guestData.relationship,
        seatInfo.tableId,
        seatInfo.id,
        new Date().toISOString()
    ]
    return row.join(',')
}

export const parseCSVRow = (csvRow) => {
    const values = csvRow.split(',')
    
    return {
        name: values[0]?.replace(/"/g, '') || '',
        gender: values[1] || '',
        phone: values[2] || '',
        notes: values[3]?.replace(/"/g, '') || '',
        accommodation: values[4] === 'Yes',
        relationship: values[5] || '',
        tableId: values[6] || '',
        seatId: values[7] || '',
        timestamp: values[8] || ''
    }
}

export const downloadCSV = (guestDataArray) => {
    const csvContent = [
        CSV_HEADERS.join(','),
        ...guestDataArray.map(item => csvRowToString(item.guest, item.seat))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `wedding_guests_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const uploadCSV = (file, callback) => {
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
        const text = e.target.result
        const rows = text.split('\n').filter(row => row.trim())
        
        // Skip header row
        const dataRows = rows.slice(1)
        
        const guestDataArray = dataRows.map(row => {
            try {
                return parseCSVRow(row)
            } catch (error) {
                console.error('Error parsing CSV row:', row, error)
                return null
            }
        }).filter(Boolean)
        
        callback(guestDataArray)
    }
    
    reader.readAsText(file, 'utf-8')
}

// Note: localStorage functions have been removed to ensure data consistency with server
// All data should be fetched from and synced with the Express backend server