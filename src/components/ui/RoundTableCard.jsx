import { IconButton } from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import SeatChair from './SeatChair'

const RoundTableCard = ({
    table,
    isAdminMode,
    draggedFromSeat,
    onAddGuest,
    onEditTableNotes,
    onDeleteTable,
    onSeatClick,
    onDragStart,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop
}) => {
    const occupiedCount = table.seats.filter(seat => seat.occupied).length
    
    // Calculate circular positions for seats around the table
    const calculateSeatPosition = (index, totalSeats) => {
        const angle = (index * 360) / totalSeats - 90 // Start from top
        const radius = parseInt(import.meta.env.VITE_TABLE_RADIUS) || 65 // Distance from center
        const centerSize = parseInt(import.meta.env.VITE_TABLE_CENTER_SIZE) || 96
        const centerX = centerSize // Container center X
        const centerY = centerSize // Container center Y
        
        const x = centerX + radius * Math.cos((angle * Math.PI) / 180)
        const y = centerY + radius * Math.sin((angle * Math.PI) / 180)
        
        // Return angle to rotate seat so trapezoid short side faces center
        return { x, y, angle: angle - 90 }
    }

    const renderSeat = (seat, index, totalSeats) => {
        const position = calculateSeatPosition(index, totalSeats)
        return (
            <div
                key={seat.id}
                className="absolute hover:z-10 transition-all duration-300"
                style={{
                    left: `${position.x - 24}px`, // Offset for seat width
                    top: `${position.y - 20}px`,  // Offset for seat height
                    transform: `rotate(${position.angle}deg)`, // Rotate so short side faces center
                    transformOrigin: 'center'
                }}
            >
                <SeatChair
                    seat={seat}
                    isAdminMode={isAdminMode}
                    draggedFromSeat={draggedFromSeat}
                    onClick={onSeatClick}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    textRotation={-position.angle}
                />
            </div>
        )
    }

    return (
        <div className="relative w-48 h-48 mx-auto my-4">
            {/* All seats arranged in circle - including extended seats */}
            {table.seats.map((seat, index) => renderSeat(seat, index, table.seats.length))}
            
            
            {/* Central round table */}
            <div 
                className="absolute w-20 h-20 rounded-full bg-white border-2 border-gray-300 flex flex-col items-center justify-center shadow-md"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                {/* Table number */}
                <h3 className="text-sm font-bold text-gray-800">{table.displayNumber}</h3>
                
                {/* Occupied count */}
                <p className="text-xs text-gray-600">{occupiedCount}/{table.extendedCapacity}</p>
                
                {/* Add guest button */}
                <IconButton 
                    size="small" 
                    onClick={() => onAddGuest(table.id)}
                    sx={{ 
                        padding: '2px',
                        '& svg': { fontSize: '16px' }
                    }}
                >
                    <AddIcon />
                </IconButton>
            </div>
            
            {/* Table notes - positioned above the table with arrow pointing down */}
            {table.notes && (
                <div className="absolute flex flex-col items-center" style={{ 
                    left: '50%',
                    top: '-15px',
                    transform: 'translateX(-50%)'
                }}>
                    <div className="bg-white border border-dashed border-gray-300 rounded px-2 py-1">
                        <p className="text-xs text-gray-600 whitespace-nowrap">{table.notes}</p>
                    </div>
                    {/* Arrow pointing down to table */}
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300" 
                         style={{ marginTop: '-1px' }}></div>
                </div>
            )}
            
            {/* Admin controls - positioned at top right */}
            {isAdminMode && (
                <div className="absolute -top-2 -right-2 flex gap-1">
                    <IconButton 
                        size="small" 
                        onClick={() => onEditTableNotes(table)}
                        sx={{ 
                            backgroundColor: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                            '& svg': { fontSize: '16px' }
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => onDeleteTable(table.id)} 
                        color="error"
                        sx={{ 
                            backgroundColor: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                            '& svg': { fontSize: '16px' }
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
        </div>
    )
}

export default RoundTableCard