import { IconButton } from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import SeatAvatar from './SeatAvatar'

const TableCard = ({
    table,
    isAdminMode,
    draggedFromSeat,
    onAddGuest,
    onEditTableNotes,
    onDeleteTable,
    onSeatClick,
    onDragStart,
    onDragOver,
    onDrop
}) => {
    const occupiedCount = table.seats.filter(seat => seat.occupied).length

    const renderSeat = (seat) => (
        <SeatAvatar
            key={seat.id}
            seat={seat}
            isAdminMode={isAdminMode}
            draggedFromSeat={draggedFromSeat}
            onClick={onSeatClick}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        />
    )

    return (
        <div className="bg-white rounded-lg p-4 shadow-md border">
            <div className="text-center mb-2">
                <div className="flex items-center justify-center gap-2">
                    <h3 className="font-semibold">{table.displayNumber}桌</h3>
                    {isAdminMode && (
                        <div className="flex gap-1">
                            <IconButton size="small" onClick={() => onEditTableNotes(table)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDeleteTable(table.id)} color="error">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </div>
                    )}
                </div>
                {table.notes && (
                    <p className="text-xs text-blue-600 mb-1">{table.notes}</p>
                )}
                <p className="text-sm text-gray-600">{occupiedCount}/{table.extendedCapacity}</p>
                <IconButton size="small" onClick={() => onAddGuest(table.id)}>
                    <AddIcon fontSize="small" />
                </IconButton>
            </div>

            {/* Seats layout in circular arrangement */}
            <div className="grid grid-cols-4 gap-1 justify-items-center">
                {table.seats.slice(0, 4).map(renderSeat)}
            </div>
            <div className="grid grid-cols-2 gap-1 justify-items-center my-2">
                {table.seats.slice(4, 6).map(renderSeat)}
                {table.seats.slice(10, 12).map(renderSeat)}
            </div>
            <div className="grid grid-cols-4 gap-1 justify-items-center">
                {table.seats.slice(6, 10).map(renderSeat)}
            </div>
            
            {/* Extended seat (13th seat) if exists */}
            {table.seats.length > 12 && (
                <div className="flex justify-center mt-1">
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-orange-600">+</span>
                        {renderSeat(table.seats[12])}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TableCard