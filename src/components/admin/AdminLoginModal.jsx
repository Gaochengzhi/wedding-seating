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
        >
            <DialogTitle>管理员登录</DialogTitle>
            <DialogContent>
                <div className="space-y-4 pt-4">
                    <TextField
                        label="用户名"
                        fullWidth
                        variant="outlined"
                        value={credentials.username}
                        onChange={(e) => onCredentialsChange({ ...credentials, username: e.target.value })}
                    />
                    <TextField
                        label="密码"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={credentials.password}
                        onChange={(e) => onCredentialsChange({ ...credentials, password: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onLogin()
                            }
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    取消
                </Button>
                <Button
                    onClick={onLogin}
                    variant="contained"
                    disabled={!credentials.username || !credentials.password}
                >
                    登录
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AdminLoginModal