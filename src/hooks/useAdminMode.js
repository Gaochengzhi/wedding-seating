import { useState } from 'react'

export const useAdminMode = () => {
    const [isAdminMode, setIsAdminMode] = useState(false)
    const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
    const [adminCredentials, setAdminCredentials] = useState({
        username: '',
        password: ''
    })

    const handleAdminLogin = () => {
        const username = adminCredentials.username
        const password = adminCredentials.password
        const correctUsername = import.meta.env.VITE_ADMIN_USERNAME || 'root'
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'root'
        
        if (username === correctUsername && password === correctPassword) {
            setIsAdminMode(true)
            setIsAdminLoginOpen(false)
            setAdminCredentials({ username: '', password: '' })
            console.log('管理员登录成功！')
        } else {
            console.warn('用户名或密码错误')
        }
    }

    const handleAdminLogout = () => {
        setIsAdminMode(false)
    }

    const openAdminLogin = () => {
        setIsAdminLoginOpen(true)
    }

    const closeAdminLogin = () => {
        setIsAdminLoginOpen(false)
        setAdminCredentials({ username: '', password: '' })
    }

    return {
        isAdminMode,
        isAdminLoginOpen,
        adminCredentials,
        setAdminCredentials,
        handleAdminLogin,
        handleAdminLogout,
        openAdminLogin,
        closeAdminLogin
    }
}