// API client for backend communication

// Determine API base URL based on environment
const getApiBaseUrl = () => {
    const hostname = window.location.hostname
    
    // Both IP and domain access use HTTP API (no HTTPS)
    if (hostname === '74.48.115.131' || hostname === 'gaochengzhi.com') {
        return 'http://74.48.115.131:3001/api'
    }
    
    // Development environment
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
}

const API_BASE_URL = getApiBaseUrl()

console.log('API Base URL:', API_BASE_URL)

class ApiClient {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`)
            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'API request failed')
            }

            return data
        } catch (error) {
            console.error(`API GET ${endpoint} failed:`, error)
            throw error
        }
    }

    async post(endpoint, body) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'API request failed')
            }

            return data
        } catch (error) {
            console.error(`API POST ${endpoint} failed:`, error)
            throw error
        }
    }

    async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'API request failed')
            }

            return data
        } catch (error) {
            console.error(`API DELETE ${endpoint} failed:`, error)
            throw error
        }
    }

    async put(endpoint, body) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'API request failed')
            }

            return data
        } catch (error) {
            console.error(`API PUT ${endpoint} failed:`, error)
            throw error
        }
    }

    // Guest-specific methods
    async getAllGuests() {
        return this.get('/guests')
    }

    async saveGuest(guest, seat) {
        return this.post('/guests', { guest, seat })
    }

    async deleteGuest(seatId, tableId) {
        return this.delete(`/guests/${seatId}/${tableId}`)
    }

    async clearAllGuests() {
        return this.delete('/guests')
    }

    async healthCheck() {
        return this.get('/health')
    }

    // Auth-specific methods
    async verifyInvitationCode(invitationCode) {
        return this.post('/auth/verify-invitation', { invitationCode })
    }

    // Table-specific methods
    async getAllTables() {
        return this.get('/tables')
    }

    async updateTableNotes(tableId, notes) {
        return this.put(`/tables/${tableId}`, { notes })
    }

    async addTable(displayNumber, side, notes = '') {
        return this.post('/tables', { displayNumber, side, notes })
    }

    async deleteTable(tableId) {
        return this.delete(`/tables/${tableId}`)
    }

    // Relationship-specific methods
    async getAllRelationships() {
        return this.get('/relationships')
    }

    async addRelationship(value, label, category = 'other') {
        return this.post('/relationships', { value, label, category })
    }

    async updateRelationship(value, label, category, order) {
        return this.put(`/relationships/${value}`, { label, category, order })
    }

    async deleteRelationship(value) {
        return this.delete(`/relationships/${value}`)
    }

    async reorderRelationships(relationships) {
        return this.put('/relationships/reorder', { relationships })
    }
}

export const apiClient = new ApiClient()
export default apiClient