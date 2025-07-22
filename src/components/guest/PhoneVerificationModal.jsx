import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

const PhoneVerificationModal = ({
    open,
    onClose,
    verificationAction,
    guestPhone,
    phoneInput,
    onPhoneInputChange,
    onVerify,
    onDelete
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
                身份验证
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: '16px 32px'
                }}
            >
                <div className="space-y-6 pt-2">
                    <p className="text-gray-600" style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#6B7280'
                    }}>
                        为了安全{verificationAction === 'edit' ? '编辑' : '删除'}宾客信息，请输入该宾客手机号码的中间4位数字：
                    </p>
                    {guestPhone && (
                        <p className="text-sm text-gray-500" style={{
                            fontSize: '0.875rem',
                            color: '#9CA3AF',
                            textAlign: 'center',
                            backgroundColor: '#F9FAFB',
                            padding: '8px 12px',
                            borderRadius: '8px'
                        }}>
                            手机号格式: {guestPhone.slice(0, 3)}****{guestPhone.slice(7)}
                        </p>
                    )}
                    <TextField
                        label="手机号中间4位"
                        fullWidth
                        variant="standard"
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => {
                            // Only allow 4 digits
                            const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                            onPhoneInputChange(value)
                        }}
                        placeholder="请输入4位数字"
                        slotProps={{
                            htmlInput: { 
                                maxLength: 4,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '1.25rem',
                                    letterSpacing: '0.5rem'
                                }
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
                    gap: 2,
                    justifyContent: 'center'
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
                {verificationAction === 'edit' && onDelete && (
                    <Button
                        onClick={() => {
                            if (phoneInput.length === 4) {
                                onDelete()
                            }
                        }}
                        variant="outlined"
                        disabled={phoneInput.length !== 4}
                        sx={{
                            borderStyle: 'dashed',
                            borderWidth: '1px',
                            borderColor: '#DC2626',
                            color: '#DC2626',
                            borderRadius: '20px',
                            padding: '8px 24px',
                            '&:hover': {
                                borderColor: '#B91C1C',
                                backgroundColor: '#FEF2F2'
                            },
                            '&:disabled': {
                                borderColor: '#D1D5DB',
                                color: '#9CA3AF'
                            }
                        }}
                    >
                        删除
                    </Button>
                )}
                <Button
                    onClick={onVerify}
                    variant="outlined"
                    disabled={phoneInput.length !== 4}
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
                    {verificationAction === 'edit' ? '编辑' : '验证'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PhoneVerificationModal