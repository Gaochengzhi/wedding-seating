import { maskName } from '../../utils/helpers'

const SeatChair = ({
    seat,
    isAdminMode,
    draggedFromSeat,
    onClick,
    onDragStart,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop,
    textRotation = 0
}) => {
    const isEmpty = !seat.occupied
    const gender = seat.guest?.gender || 'none'
    
    // Light, low saturation colors
    const getSeatColor = () => {
        if (isEmpty) return '#f3f4f6' // Very light gray
        return gender === 'male' ? '#dbeafe' : '#fce7f3' // Very light blue/pink
    }
    
    const getTextColor = () => {
        if (isEmpty) return '#6b7280' // Medium gray
        return '#374151' // Dark gray for better readability
    }
    
    // Show masked name unless in admin mode
    const displayName = isEmpty ? '可选' : 
        (isAdminMode ? seat.guest?.name : maskName(seat.guest?.name))
    
    const isDragging = draggedFromSeat?.id === seat.id

    return (
        <div
            className={`relative transform transition-all duration-200 hover:scale-105 ${
                isAdminMode && seat.occupied ? 'cursor-move' : 'cursor-pointer'
            }`}
            onClick={() => onClick(seat)}
            draggable={isAdminMode && seat.occupied}
            onDragStart={(e) => {
                e.stopPropagation()
                onDragStart(seat)
            }}
            onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDragOver(e)
            }}
            onDragEnter={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDragEnter && onDragEnter(e)
            }}
            onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDragLeave && onDragLeave(e)
            }}
            onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDrop(seat)
            }}
            style={{
                opacity: isDragging ? 0.5 : 1,
                filter: isDragging ? 'brightness(0.8)' : 'none'
            }}
        >
            {/* Trapezoid chair shape using CSS clip-path with border effect */}
            <div className="relative">
                {/* Border layer - slightly larger trapezoid with border color */}
                <div
                    className="absolute w-12 h-10"
                    style={{
                        backgroundColor: isDragging ? '#f97316' : '#d1d5db',
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                        borderRadius: '4px 4px 2px 2px'
                    }}
                />
                {/* Main chair shape - positioned inside border layer */}
                <div
                    className="relative w-12 h-10 flex items-center justify-center text-sm font-medium shadow-sm"
                    style={{
                        backgroundColor: getSeatColor(),
                        color: getTextColor(),
                        clipPath: 'polygon(22% 3%, 78% 3%, 97% 97%, 3% 97%)',
                        borderRadius: '4px 4px 2px 2px',
                        boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                        top: '1px',
                        left: '0px'
                    }}
                >
                    <span 
                        className="transform scale-90"
                        style={{
                            transform: `rotate(${textRotation}deg)`,
                            display: 'inline-block'
                        }}
                    >
                        {displayName.length > 3 ? displayName.slice(0, 2) + '...' : displayName}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SeatChair