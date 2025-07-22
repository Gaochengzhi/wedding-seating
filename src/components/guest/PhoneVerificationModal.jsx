import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

const PhoneVerificationModal = ({
    open,
    onClose,
    verificationAction,
    guestPhone,
    phoneInput,
    onPhoneInputChange,
    onVerify
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                身份验证
            </DialogTitle>
            <DialogContent>
                <div className="space-y-4 pt-4">
                    <p className="text-gray-600">
                        为了安全{verificationAction === 'edit' ? '编辑' : '删除'}宾客信息，请输入该宾客手机号码的中间4位数字：
                    </p>
                    {guestPhone && (
                        <p className="text-sm text-gray-500">
                            手机号格式: {guestPhone.slice(0, 3)}****{guestPhone.slice(7)}
                        </p>
                    )}
                    <TextField
                        label="手机号中间4位"
                        fullWidth
                        variant="outlined"
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => {
                            // Only allow 4 digits
                            const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                            onPhoneInputChange(value)
                        }}
                        placeholder="请输入4位数字"
                        slotProps={{
                            htmlInput: { maxLength: 4 }
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    取消
                </Button>
                <Button
                    onClick={onVerify}
                    variant="contained"
                    disabled={phoneInput.length !== 4}
                >
                    验证
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PhoneVerificationModal