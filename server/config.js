// Server configuration with environment variables fallbacks
export const config = {
    // Table and Seat Configuration
    DEFAULT_SEATS_PER_TABLE: parseInt(process.env.DEFAULT_SEATS_PER_TABLE) || 12,
    TABLES_PER_SIDE: parseInt(process.env.TABLES_PER_SIDE) || 11,
    TOTAL_TABLES: parseInt(process.env.TOTAL_TABLES) || 22,
    MAX_SEATS_PER_TABLE: parseInt(process.env.MAX_SEATS_PER_TABLE) || 16,
    
    // Phone Validation
    PHONE_NUMBER_LENGTH: parseInt(process.env.PHONE_NUMBER_LENGTH) || 11,
    
    // Server Configuration
    PORT: process.env.PORT || 3001
}