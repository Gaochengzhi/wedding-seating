import { useState, useEffect } from 'react'
import { Button } from '@mui/material'

// Import image assets directly
import leftFlowerSvg from '../assets/left_flower.svg'
import rightFlowerSvg from '../assets/right_flower.svg'
import weddingTitleSvg from '../assets/wedding_invitaion_titile_logo.svg'
import coupleSvg from '../assets/couple.svg'
import elegantHeartSvg from '../assets/elegant_heart.svg'

const WelcomePage = ({ onOpenSeatSelection }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Start the fade-in animation after component mounts
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-white overflow-hidden relative ">
            {/* Background Flowers - Controlled Size */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Left flower - bottom left */}
                <div className={`absolute left-0 bottom-0 transform transition-all duration-2000 ease-out ${isLoaded
                    ? 'translate-x-0 translate-y-0 opacity-100'
                    : '-translate-x-10 translate-y-10 opacity-0 blur-sm'
                    }`}>
                    <img
                        src={leftFlowerSvg}
                        alt="Left Flower"
                        className={`w-auto h-[30vh] sm:h-[60vh] max-w-[50vw] object-contain animate-pulse-gentle ${isLoaded ? 'animate-multi-axis-left' : ''
                            }`}
                    />
                </div>

                {/* Right flower - top right */}
                <div className={`absolute right-0 top-0 transform transition-all duration-2000 ease-out delay-300 ${isLoaded
                    ? 'translate-x-0 translate-y-0 opacity-100'
                    : 'translate-x-10 -translate-y-10 opacity-0 blur-sm'
                    }`}>
                    <img
                        src={rightFlowerSvg}
                        alt="Right Flower"
                        className={`w-auto h-[50vh] sm:h-[60vh] max-w-[50vw] object-contain animate-pulse-gentle ${isLoaded ? 'animate-multi-axis-right' : ''
                            }`}
                    />
                </div>
            </div>

            {/* Main Content Container - Properly Centered */}
            <div className="relative z-10 min-h-screen max-h-screen flex items-center justify-center px-4 sm:px-6">

                <div className="w-full flex flex-col items-center  text-center sm:max-w-3xl">

                    {/* Wedding Logo - 1/6 from top, 1/2 screen width */}
                    <div >
                        <div className={`mb-8 sm:mb-12  transform transition-all duration-1500 ease-out delay-500 ${isLoaded
                            ? 'translate-y-0 opacity-100 scale-100'
                            : '-translate-y-8 opacity-0 scale-90 blur-sm'
                            }`}>
                            <img
                                src={weddingTitleSvg}
                                alt="Wedding Invitation Title"
                                className="w-1/2 h-auto mx-auto max-w-[200px] sm:max-w-[300px]"
                            />
                        </div>

                        {/* Couple Photo - 0.8 screenview width */}
                        <div className={`mb-6 sm:mb-8 transform transition-all duration-1500 ease-out delay-700 ${isLoaded
                            ? 'translate-y-0 opacity-100 scale-100'
                            : 'translate-y-8 opacity-0 scale-95 blur-sm'
                            }`}>
                            <div className="w-3/5 mx-auto relative">
                                <img
                                    src={coupleSvg}
                                    alt="Couple Photo"
                                    className="w-full h-auto object-contain"
                                />
                                {/* Bottom gradient fade-out overlay */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                    </div>
                    {/* Names */}
                    <div className={`mb-4 sm:mb-6 transform transition-all duration-1500 ease-out delay-900 ${isLoaded
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                        }`}>
                        <div className="flex items-center justify-center gap-1 sm:gap-3">
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-chinese-serif drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)' }}>
                                {import.meta.env.VITE_BRIDE_NAME || '刘子悦'}
                            </span>
                            <div className="w-18 h-18 flex items-center justify-center animate-pulse">
                                <img
                                    src={elegantHeartSvg}
                                    alt="Elegant Heart"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-chinese-serif drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)' }}>
                                {import.meta.env.VITE_GROOM_NAME || '高成志'}
                            </span>
                        </div>
                    </div>

                    {/* Wedding Date */}
                    <div className={`mb-3 sm:mb-4 transform transition-all duration-1500 ease-out delay-1100 ${isLoaded
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                        }`}>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 font-medium font-chinese-serif drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)' }}>
                            {import.meta.env.VITE_WEDDING_DATE || '2025年10月2日'}
                        </p>
                    </div>

                    {/* Wedding Location */}
                    <div className={`mb-8 sm:mb-12 transform transition-all duration-1500 ease-out delay-1300 ${isLoaded
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                        }`}>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-chinese-serif drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)' }}>
                            {import.meta.env.VITE_WEDDING_LOCATION || '常州中吴宾馆中午XX厅'}
                        </p>
                    </div>

                    {/* Online Seat Selection Button */}
                    <div className={`transform transition-all duration-1500 ease-out delay-1500 ${isLoaded
                        ? 'translate-y-0 opacity-100 scale-100'
                        : 'translate-y-4 opacity-0 scale-95'
                        }`}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={onOpenSeatSelection}
                            className="px-6 sm:px-8 py-3 text-base sm:text-lg font-medium border-2 border-dashed hover:bg-gray-50 hover:scale-105 transition-all duration-300"
                            sx={{
                                backgroundColor: 'white',
                                borderColor: '#9CA3AF',
                                borderStyle: 'dashed',
                                borderWidth: '1px',
                                color: '#374151',
                                '&:hover': {
                                    backgroundColor: '#F9FAFB',
                                    borderColor: '#6B7280',
                                    transform: 'scale(1.05)',
                                }
                            }}
                        >
                            在线选座
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage