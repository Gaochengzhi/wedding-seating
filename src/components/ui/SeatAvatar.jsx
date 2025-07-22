import { Avatar } from '@mui/material'
import { maskName } from '../../utils/helpers'

const SeatAvatar = ({
    seat,
    isAdminMode,
    draggedFromSeat,
    onClick,
    onDragStart,
    onDragOver,
    onDrop
}) => {
    const isEmpty = !seat.occupied
    const gender = seat.guest?.gender || 'none'
    const seatColor = isEmpty ? 'gray' : (gender === 'male' ? '#93c5fd' : '#fca5a5')
    const textColor = isEmpty ? 'white' : 'black'
    
    // Show masked name unless in admin mode
    const displayName = isEmpty ? '可选' : 
        (isAdminMode ? seat.guest?.name : maskName(seat.guest?.name))

    return (
        <Avatar
            sx={{
                width: 32,
                height: 32,
                fontSize: isEmpty || displayName.length <= 2 ? '12px' : '10px',
                bgcolor: seatColor,
                color: textColor,
                cursor: isAdminMode && seat.occupied ? 'move' : 'pointer',
                margin: '2px',
                border: draggedFromSeat?.id === seat.id ? '2px solid #orange' : 'none',
                opacity: draggedFromSeat?.id === seat.id ? 0.5 : 1
            }}
            onClick={() => onClick(seat)}
            draggable={isAdminMode && seat.occupied}
            onDragStart={() => onDragStart(seat)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(seat)}
        >
            {displayName}
        </Avatar>
    )
}

export default SeatAvatar