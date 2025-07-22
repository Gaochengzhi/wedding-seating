import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

const AdminLoginModal = ({
    open,
    onClose,
    credentials,
    onCredentialsChange,
    onLogin
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                }
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'medium',
                    color: '#374151',
                    fontFamily: 'serif',
                    padding: '24px 32px 16px'
                }}
            >
                管理员登录
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: '16px 32px'
                }}
            >
                <div className="space-y-6 pt-2">
                    <TextField
                        label="用户名"
                        fullWidth
                        variant="standard"
                        value={credentials.username}
                        onChange={(e) => onCredentialsChange({ ...credentials, username: e.target.value })}
                        sx={{
                            '& .MuiInput-underline:before': {
                                borderBottomColor: '#E5E7EB',
                            },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottomColor: '#9CA3AF',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: '#6B7280',
                            }
                        }}
                    />
                    <TextField
                        label="密码"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={credentials.password}
                        onChange={(e) => onCredentialsChange({ ...credentials, password: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onLogin()
                            }
                        }}
                        sx={{
                            '& .MuiInput-underline:before': {
                                borderBottomColor: '#E5E7EB',
                            },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottomColor: '#9CA3AF',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: '#6B7280',
                            }
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: '16px 32px 24px',
                    gap: 2
                }}
            >
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderStyle: 'dashed',
                        borderWidth: '1px',
                        borderColor: '#9CA3AF',
                        color: '#6B7280',
                        borderRadius: '20px',
                        padding: '8px 24px',
                        '&:hover': {
                            borderColor: '#6B7280',
                            backgroundColor: '#F9FAFB'
                        }
                    }}
                >
                    取消
                </Button>
                <Button
                    onClick={onLogin}
                    variant="outlined"
                    disabled={!credentials.username || !credentials.password}
                    sx={{
                        borderStyle: 'dashed',
                        borderWidth: '1px',
                        borderColor: '#6B7280',
                        color: '#374151',
                        borderRadius: '20px',
                        padding: '8px 24px',
                        fontWeight: 'medium',
                        '&:hover': {
                            borderColor: '#374151',
                            backgroundColor: '#F9FAFB'
                        },
                        '&:disabled': {
                            borderColor: '#D1D5DB',
                            color: '#9CA3AF'
                        }
                    }}
                >
                    登录
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AdminLoginModal