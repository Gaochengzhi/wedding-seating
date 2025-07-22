import { useState, useEffect } from 'react'
import { Alert, Snackbar } from '@mui/material'

const useNotification = () => {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info' // 'success' | 'error' | 'warning' | 'info'
    })

    const showNotification = (message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity
        })
    }

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }))
    }

    const NotificationComponent = () => (
        <Snackbar
            open={notification.open}
            autoHideDuration={3000}
            onClose={hideNotification}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={hideNotification} severity={notification.severity}>
                {notification.message}
            </Alert>
        </Snackbar>
    )

    return {
        showNotification,
        hideNotification,
        NotificationComponent
    }
}

export default useNotification