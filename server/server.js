import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { createObjectCsvWriter } from 'csv-writer'
import { fileURLToPath } from 'url'
import { config } from './config.js'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = config.PORT

// Middleware
app.use(cors())
app.use(express.json())

// Data directory and CSV file paths
const dataDir = path.join(__dirname, 'data')
const csvFilePath = path.join(dataDir, 'guests.csv')
const tablesFilePath = path.join(dataDir, 'tables.csv')
const relationshipsFilePath = path.join(dataDir, 'relationships.csv')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
}

// CSV file headers (all lowercase)
const csvHeaders = [
    { id: 'name', title: 'name' },
    { id: 'gender', title: 'gender' },
    { id: 'phone', title: 'phone' },
    { id: 'notes', title: 'notes' },
    { id: 'accommodation', title: 'accommodation' },
    { id: 'relationship', title: 'relationship' },
    { id: 'tableid', title: 'tableid' },
    { id: 'seatid', title: 'seatid' },
    { id: 'seatnumber', title: 'seatnumber' },
    { id: 'timestamp', title: 'timestamp' }
]

// Tables CSV headers
const tablesHeaders = [
    { id: 'tableid', title: 'tableid' },
    { id: 'displaynumber', title: 'displaynumber' },
    { id: 'side', title: 'side' },
    { id: 'notes', title: 'notes' },
    { id: 'timestamp', title: 'timestamp' }
]

// Relationships CSV headers
const relationshipsHeaders = [
    { id: 'value', title: 'value' },
    { id: 'label', title: 'label' },
    { id: 'category', title: 'category' },
    { id: 'order', title: 'order' },
    { id: 'timestamp', title: 'timestamp' }
]

// Initialize tables CSV file
const initializeTablesFile = () => {
    if (!fs.existsSync(tablesFilePath)) {
        const csvWriter = createObjectCsvWriter({
            path: tablesFilePath,
            header: tablesHeaders
        })
        
        // Create tables structure based on configuration
        const tables = []
        for (let i = 1; i <= config.TOTAL_TABLES; i++) {
            const side = i <= config.TABLES_PER_SIDE ? 'left' : 'right'
            const displayNumber = side === 'left' ? i : i - config.TABLES_PER_SIDE
            
            tables.push({
                tableid: `table_${i}`,
                displaynumber: displayNumber,
                side: side,
                notes: '',
                timestamp: new Date().toISOString()
            })
        }
        
        csvWriter.writeRecords(tables)
        console.log('Initialized tables CSV file:', tablesFilePath)
    }
}

// Initialize relationships CSV file with default options
const initializeRelationshipsFile = () => {
    if (!fs.existsSync(relationshipsFilePath)) {
        const csvWriter = createObjectCsvWriter({
            path: relationshipsFilePath,
            header: relationshipsHeaders
        })
        
        // Default relationship options
        const defaultRelationships = [
            { value: 'groom_classmate', label: '男方同学/同事', category: 'groom', order: 1, timestamp: new Date().toISOString() },
            { value: 'bride_classmate', label: '女方同学/同事', category: 'bride', order: 2, timestamp: new Date().toISOString() },
            { value: 'groom_father_friends', label: '男方爸爸亲友', category: 'groom_family', order: 3, timestamp: new Date().toISOString() },
            { value: 'groom_mother_friends', label: '男方妈妈亲友', category: 'groom_family', order: 4, timestamp: new Date().toISOString() },
            { value: 'bride_father_friends', label: '女方爸爸亲友', category: 'bride_family', order: 5, timestamp: new Date().toISOString() },
            { value: 'bride_mother_friends', label: '女方妈妈亲友', category: 'bride_family', order: 6, timestamp: new Date().toISOString() },
            { value: 'groom_father_colleagues', label: '男方爸爸同事', category: 'groom_family', order: 7, timestamp: new Date().toISOString() },
            { value: 'bride_father_colleagues', label: '女方爸爸同事', category: 'bride_family', order: 8, timestamp: new Date().toISOString() },
            { value: 'other', label: '其他', category: 'other', order: 9, timestamp: new Date().toISOString() }
        ]
        
        csvWriter.writeRecords(defaultRelationships)
        console.log('Initialized relationships CSV file:', relationshipsFilePath)
    }
}

// Read relationships from CSV
const readRelationshipsFromCsv = () => {
    return new Promise((resolve, reject) => {
        const relationships = []
        
        if (!fs.existsSync(relationshipsFilePath)) {
            resolve([])
            return
        }
        
        fs.createReadStream(relationshipsFilePath)
            .pipe(csv({ 
                mapHeaders: ({ header }) => header.toLowerCase() 
            }))
            .on('data', (row) => {
                relationships.push({
                    ...row,
                    order: parseInt(row.order) || 0
                })
            })
            .on('end', () => {
                // Sort by order
                relationships.sort((a, b) => a.order - b.order)
                resolve(relationships)
            })
            .on('error', (error) => {
                reject(error)
            })
    })
}

// Write relationships to CSV
const writeRelationshipsToCsv = (relationships) => {
    return new Promise((resolve, reject) => {
        const csvWriter = createObjectCsvWriter({
            path: relationshipsFilePath,
            header: relationshipsHeaders
        })
        
        const processedRelationships = relationships.map((rel, index) => ({
            ...rel,
            order: rel.order || index + 1,
            timestamp: rel.timestamp || new Date().toISOString()
        }))
        
        csvWriter.writeRecords(processedRelationships)
            .then(() => {
                console.log('Wrote', processedRelationships.length, 'relationships to CSV')
                resolve()
            })
            .catch(reject)
    })
}

// Read tables from CSV
const readTablesFromCsv = () => {
    return new Promise((resolve, reject) => {
        const tables = []
        
        if (!fs.existsSync(tablesFilePath)) {
            resolve([])
            return
        }
        
        fs.createReadStream(tablesFilePath)
            .pipe(csv({ 
                mapHeaders: ({ header }) => header.toLowerCase() 
            }))
            .on('data', (row) => {
                tables.push(row)
            })
            .on('end', () => {
                resolve(tables)
            })
            .on('error', (error) => {
                reject(error)
            })
    })
}

// Write tables to CSV
const writeTablesToCsv = (tables) => {
    return new Promise((resolve, reject) => {
        const csvWriter = createObjectCsvWriter({
            path: tablesFilePath,
            header: tablesHeaders
        })
        
        const processedTables = tables.map(table => ({
            ...table,
            timestamp: table.timestamp || new Date().toISOString()
        }))
        
        csvWriter.writeRecords(processedTables)
            .then(() => {
                console.log('Wrote', processedTables.length, 'tables to CSV')
                resolve()
            })
            .catch(reject)
    })
}

// Initialize CSV file with demo data for development
const initializeCsvFile = async () => {
    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: csvHeaders
    })
    
    // Check if we're in development mode (localhost)
    const isDevelopment = process.env.NODE_ENV !== 'production'
    
    if (isDevelopment) {
        // Check if file doesn't exist OR is empty (only header)
        let shouldInitialize = false
        
        if (!fs.existsSync(csvFilePath)) {
            shouldInitialize = true
            console.log('CSV file does not exist, will create with demo data')
        } else {
            // File exists, check if it has actual guest data
            try {
                const guests = await readGuestsFromCsv()
                if (guests.length === 0) {
                    shouldInitialize = true
                    console.log('CSV file exists but is empty, will add demo data')
                }
            } catch (error) {
                console.error('Error reading existing CSV, will reinitialize:', error)
                shouldInitialize = true
            }
        }
        
        if (shouldInitialize) {
            // Create demo data for first table (12 guests)
            const demoGuests = [
                { name: '张三', gender: 'male', phone: '13800138001', notes: '大学同学', accommodation: 'Yes', relationship: 'groom_classmate', tableid: 'table_1', seatid: 'table_1_seat_0', seatnumber: 1, timestamp: new Date().toISOString() },
                { name: '李四', gender: 'female', phone: '13800138002', notes: '工作同事', accommodation: 'No', relationship: 'bride_classmate', tableid: 'table_1', seatid: 'table_1_seat_1', seatnumber: 2, timestamp: new Date().toISOString() },
                { name: '王五', gender: 'male', phone: '13800138003', notes: '好朋友', accommodation: 'Yes', relationship: 'groom_classmate', tableid: 'table_1', seatid: 'table_1_seat_2', seatnumber: 3, timestamp: new Date().toISOString() },
                { name: '赵六', gender: 'female', phone: '13800138004', notes: '大学同学', accommodation: 'No', relationship: 'bride_classmate', tableid: 'table_1', seatid: 'table_1_seat_3', seatnumber: 4, timestamp: new Date().toISOString() },
                { name: '孙七', gender: 'male', phone: '13800138005', notes: '表哥', accommodation: 'Yes', relationship: 'groom_father_friends', tableid: 'table_1', seatid: 'table_1_seat_4', seatnumber: 5, timestamp: new Date().toISOString() },
                { name: '周八', gender: 'female', phone: '13800138006', notes: '同事', accommodation: 'No', relationship: 'bride_classmate', tableid: 'table_1', seatid: 'table_1_seat_5', seatnumber: 6, timestamp: new Date().toISOString() },
                { name: '吴九', gender: 'male', phone: '13800138007', notes: '室友', accommodation: 'Yes', relationship: 'groom_classmate', tableid: 'table_1', seatid: 'table_1_seat_6', seatnumber: 7, timestamp: new Date().toISOString() },
                { name: '郑十', gender: 'female', phone: '13800138008', notes: '堂妹', accommodation: 'No', relationship: 'bride_mother_friends', tableid: 'table_1', seatid: 'table_1_seat_7', seatnumber: 8, timestamp: new Date().toISOString() },
                { name: '刘一', gender: 'male', phone: '13800138009', notes: '高中同学', accommodation: 'Yes', relationship: 'groom_classmate', tableid: 'table_1', seatid: 'table_1_seat_8', seatnumber: 9, timestamp: new Date().toISOString() },
                { name: '陈二', gender: 'female', phone: '13800138010', notes: '部门同事', accommodation: 'No', relationship: 'bride_classmate', tableid: 'table_1', seatid: 'table_1_seat_9', seatnumber: 10, timestamp: new Date().toISOString() },
                { name: '杨三', gender: 'male', phone: '13800138011', notes: '父亲同事', accommodation: 'Yes', relationship: 'groom_father_colleagues', tableid: 'table_1', seatid: 'table_1_seat_10', seatnumber: 11, timestamp: new Date().toISOString() },
                { name: '黄四', gender: 'female', phone: '13800138012', notes: '父亲朋友', accommodation: 'No', relationship: 'bride_father_friends', tableid: 'table_1', seatid: 'table_1_seat_11', seatnumber: 12, timestamp: new Date().toISOString() }
            ]
            
            await csvWriter.writeRecords(demoGuests)
            console.log('Initialized CSV file with demo data for development:', csvFilePath)
        } else {
            console.log('CSV file already has guest data, skipping initialization')
        }
    } else {
        // Production: create empty file if it doesn't exist
        if (!fs.existsSync(csvFilePath)) {
            await csvWriter.writeRecords([])
            console.log('Initialized empty CSV file for production:', csvFilePath)
        }
    }
}

// Read all guests from CSV
const readGuestsFromCsv = () => {
    return new Promise((resolve, reject) => {
        const guests = []
        
        if (!fs.existsSync(csvFilePath)) {
            resolve([])
            return
        }
        
        fs.createReadStream(csvFilePath)
            .pipe(csv({ 
                mapHeaders: ({ header }) => header.toLowerCase() 
            }))
            .on('data', (row) => {
                // Skip empty rows (headers are now automatically lowercase)
                if (!row.name || row.name.trim() === '') {
                    return
                }
                
                // Convert accommodation string back to boolean
                row.accommodation = row.accommodation === 'true' || row.accommodation === 'Yes'
                guests.push(row)
            })
            .on('end', () => {
                resolve(guests)
            })
            .on('error', (error) => {
                reject(error)
            })
    })
}

// Write all guests to CSV
const writeGuestsToCsv = (guests) => {
    return new Promise((resolve, reject) => {
        const csvWriter = createObjectCsvWriter({
            path: csvFilePath,
            header: csvHeaders
        })
        
        // Filter out empty guests and convert boolean to string for CSV storage
        const validGuests = guests.filter(guest => guest.name && guest.name.trim() !== '')
        const processedGuests = validGuests.map(guest => ({
            ...guest,
            accommodation: guest.accommodation ? 'Yes' : 'No'
        }))
        
        console.log('Writing valid guests to CSV:', processedGuests)
        
        csvWriter.writeRecords(processedGuests)
            .then(() => {
                console.log('Wrote', processedGuests.length, 'valid guests to CSV')
                resolve()
            })
            .catch(reject)
    })
}

// API Routes

// Get all guests
app.get('/api/guests', async (req, res) => {
    try {
        const guests = await readGuestsFromCsv()
        res.json({ success: true, data: guests })
    } catch (error) {
        console.error('Error reading guests:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Save a new guest or update existing
app.post('/api/guests', async (req, res) => {
    try {
        const { guest, seat } = req.body
        
        if (!guest || !seat) {
            return res.status(400).json({ success: false, error: 'Guest and seat data required' })
        }
        
        // Read existing guests
        const existingGuests = await readGuestsFromCsv()
        console.log('Existing guests before save:', existingGuests)
        
        // Remove any existing guest at the same seat
        const filteredGuests = existingGuests.filter(g => 
            !(g.seatid === seat.id && g.tableid === seat.tableId)
        )
        console.log('Filtered guests:', filteredGuests)
        
        // Add new guest
        const newGuest = {
            name: guest.name,
            gender: guest.gender,
            phone: guest.phone,
            notes: guest.notes || '',
            accommodation: guest.accommodation,
            relationship: guest.relationship,
            tableid: seat.tableId,
            seatid: seat.id,
            seatnumber: seat.seatNumber || seat.seatNumber,
            timestamp: new Date().toISOString()
        }
        
        filteredGuests.push(newGuest)
        console.log('All guests to save:', filteredGuests)
        
        // Write back to CSV
        await writeGuestsToCsv(filteredGuests)
        
        res.json({ success: true, data: newGuest })
        
    } catch (error) {
        console.error('Error saving guest:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Delete a guest
app.delete('/api/guests/:seatId/:tableId', async (req, res) => {
    try {
        const { seatId, tableId } = req.params
        
        console.log(`=== DELETE REQUEST ===`)
        console.log(`Received seatId: "${seatId}", tableId: "${tableId}"`)
        
        // Read existing guests
        const existingGuests = await readGuestsFromCsv()
        console.log(`Current guests in CSV:`)
        existingGuests.forEach((g, i) => {
            console.log(`  ${i}: seatid="${g.seatid}", tableid="${g.tableid}", name="${g.name}"`)
        })
        
        // Remove guest at the specified seat (CSV fields are lowercase)
        const filteredGuests = existingGuests.filter(g => 
            !(g.seatid === seatId && g.tableid === tableId)
        )
        
        console.log(`Before deletion: ${existingGuests.length} guests`)
        console.log(`After deletion: ${filteredGuests.length} guests`)
        console.log(`=== END DELETE REQUEST ===`)
        
        // Write back to CSV
        await writeGuestsToCsv(filteredGuests)
        
        res.json({ success: true, message: 'Guest deleted successfully' })
        
    } catch (error) {
        console.error('Error deleting guest:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Clear all guests (for testing)
app.delete('/api/guests', async (req, res) => {
    try {
        await writeGuestsToCsv([])
        res.json({ success: true, message: 'All guests cleared' })
    } catch (error) {
        console.error('Error clearing guests:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Clean up CSV file (remove empty rows)
app.post('/api/guests/cleanup', async (req, res) => {
    try {
        const existingGuests = await readGuestsFromCsv()
        const validGuests = existingGuests.filter(guest => guest.name && guest.name.trim() !== '')
        await writeGuestsToCsv(validGuests)
        res.json({ 
            success: true, 
            message: `Cleaned up CSV, removed ${existingGuests.length - validGuests.length} empty rows`,
            validGuests: validGuests.length
        })
    } catch (error) {
        console.error('Error cleaning up CSV:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Tables API Routes

// Get all tables
app.get('/api/tables', async (req, res) => {
    try {
        const tables = await readTablesFromCsv()
        
        // Sort tables by side first, then by display number
        const sortedTables = tables.sort((a, b) => {
            // First sort by side (left first, then right)
            if (a.side !== b.side) {
                return a.side === 'left' ? -1 : 1
            }
            // Then sort by display number within each side
            return parseInt(a.displaynumber) - parseInt(b.displaynumber)
        })
        
        res.json({ success: true, data: sortedTables })
    } catch (error) {
        console.error('Error reading tables:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Add a new table
app.post('/api/tables', async (req, res) => {
    try {
        const { displayNumber, side, notes } = req.body
        
        if (!displayNumber || !side) {
            return res.status(400).json({ success: false, error: 'Display number and side are required' })
        }
        
        // Read existing tables
        const existingTables = await readTablesFromCsv()
        
        // Find the highest table ID to generate a new one
        const maxTableNum = Math.max(0, ...existingTables.map(t => {
            const match = t.tableid.match(/table_(\d+)/)
            return match ? parseInt(match[1]) : 0
        }))
        
        const newTableId = `table_${maxTableNum + 1}`
        
        // Create new table entry
        const newTable = {
            tableid: newTableId,
            displaynumber: displayNumber,
            side: side,
            notes: notes || '',
            timestamp: new Date().toISOString()
        }
        
        // Add to existing tables
        const updatedTables = [...existingTables, newTable]
        
        // Write back to CSV
        await writeTablesToCsv(updatedTables)
        
        res.json({ success: true, data: newTable })
        
    } catch (error) {
        console.error('Error adding table:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Delete a table
app.delete('/api/tables/:tableId', async (req, res) => {
    try {
        const { tableId } = req.params
        
        console.log(`Deleting table: ${tableId}`)
        
        // Read existing tables
        const existingTables = await readTablesFromCsv()
        
        // Remove the specific table
        const filteredTables = existingTables.filter(table => table.tableid !== tableId)
        
        if (filteredTables.length === existingTables.length) {
            return res.status(404).json({ success: false, error: 'Table not found' })
        }
        
        // Also remove all guests from this table
        const existingGuests = await readGuestsFromCsv()
        const filteredGuests = existingGuests.filter(guest => guest.tableid !== tableId)
        
        // Write both back to CSV
        await writeTablesToCsv(filteredTables)
        await writeGuestsToCsv(filteredGuests)
        
        res.json({ success: true, message: 'Table deleted successfully' })
        
    } catch (error) {
        console.error('Error deleting table:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Update table notes
app.put('/api/tables/:tableId', async (req, res) => {
    try {
        const { tableId } = req.params
        const { notes } = req.body
        
        console.log(`Updating table ${tableId} notes to: "${notes}"`)
        
        // Read existing tables
        const existingTables = await readTablesFromCsv()
        
        // Update the specific table
        const updatedTables = existingTables.map(table => {
            if (table.tableid === tableId) {
                return {
                    ...table,
                    notes: notes || '',
                    timestamp: new Date().toISOString()
                }
            }
            return table
        })
        
        // Write back to CSV
        await writeTablesToCsv(updatedTables)
        
        res.json({ success: true, message: 'Table notes updated successfully' })
        
    } catch (error) {
        console.error('Error updating table notes:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Relationships API Routes

// Get all relationships
app.get('/api/relationships', async (req, res) => {
    try {
        const relationships = await readRelationshipsFromCsv()
        res.json({ success: true, data: relationships })
    } catch (error) {
        console.error('Error reading relationships:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Add a new relationship
app.post('/api/relationships', async (req, res) => {
    try {
        const { value, label, category } = req.body
        
        if (!value || !label) {
            return res.status(400).json({ success: false, error: 'Value and label are required' })
        }
        
        // Read existing relationships
        const existingRelationships = await readRelationshipsFromCsv()
        
        // Check for duplicate values
        if (existingRelationships.some(rel => rel.value === value)) {
            return res.status(400).json({ success: false, error: 'Relationship value already exists' })
        }
        
        // Create new relationship with next order
        const maxOrder = Math.max(0, ...existingRelationships.map(rel => rel.order))
        const newRelationship = {
            value: value,
            label: label,
            category: category || 'other',
            order: maxOrder + 1,
            timestamp: new Date().toISOString()
        }
        
        // Add to existing relationships
        const updatedRelationships = [...existingRelationships, newRelationship]
        
        // Write back to CSV
        await writeRelationshipsToCsv(updatedRelationships)
        
        res.json({ success: true, data: newRelationship })
        
    } catch (error) {
        console.error('Error adding relationship:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Update a relationship
app.put('/api/relationships/:value', async (req, res) => {
    try {
        const { value } = req.params
        const { label, category, order } = req.body
        
        console.log(`Updating relationship ${value}`)
        
        // Read existing relationships
        const existingRelationships = await readRelationshipsFromCsv()
        
        // Find and update the specific relationship
        const relationshipIndex = existingRelationships.findIndex(rel => rel.value === value)
        if (relationshipIndex === -1) {
            return res.status(404).json({ success: false, error: 'Relationship not found' })
        }
        
        // Update the relationship
        existingRelationships[relationshipIndex] = {
            ...existingRelationships[relationshipIndex],
            label: label || existingRelationships[relationshipIndex].label,
            category: category || existingRelationships[relationshipIndex].category,
            order: order !== undefined ? parseInt(order) : existingRelationships[relationshipIndex].order,
            timestamp: new Date().toISOString()
        }
        
        // Write back to CSV
        await writeRelationshipsToCsv(existingRelationships)
        
        res.json({ success: true, message: 'Relationship updated successfully' })
        
    } catch (error) {
        console.error('Error updating relationship:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Delete a relationship
app.delete('/api/relationships/:value', async (req, res) => {
    try {
        const { value } = req.params
        
        console.log(`Deleting relationship: ${value}`)
        
        // Read existing relationships
        const existingRelationships = await readRelationshipsFromCsv()
        
        // Remove the specific relationship
        const filteredRelationships = existingRelationships.filter(rel => rel.value !== value)
        
        if (filteredRelationships.length === existingRelationships.length) {
            return res.status(404).json({ success: false, error: 'Relationship not found' })
        }
        
        // Write back to CSV
        await writeRelationshipsToCsv(filteredRelationships)
        
        res.json({ success: true, message: 'Relationship deleted successfully' })
        
    } catch (error) {
        console.error('Error deleting relationship:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Reorder relationships
app.put('/api/relationships/reorder', async (req, res) => {
    try {
        const { relationships } = req.body
        
        if (!Array.isArray(relationships)) {
            return res.status(400).json({ success: false, error: 'Relationships array is required' })
        }
        
        console.log('Reordering relationships')
        
        // Update order for each relationship
        const updatedRelationships = relationships.map((rel, index) => ({
            ...rel,
            order: index + 1,
            timestamp: new Date().toISOString()
        }))
        
        // Write back to CSV
        await writeRelationshipsToCsv(updatedRelationships)
        
        res.json({ success: true, message: 'Relationships reordered successfully' })
        
    } catch (error) {
        console.error('Error reordering relationships:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Wedding invitation server is running',
        timestamp: new Date().toISOString()
    })
})

// Start server
app.listen(PORT, async () => {
    console.log(`🎉 Wedding invitation server running on port ${PORT}`)
    console.log(`📊 CSV file will be stored at: ${csvFilePath}`)
    
    // Initialize CSV files
    try {
        await initializeCsvFile()
        initializeTablesFile()
        initializeRelationshipsFile()
        console.log('✅ All CSV files initialized successfully')
    } catch (error) {
        console.error('❌ Error initializing CSV files:', error)
    }
})