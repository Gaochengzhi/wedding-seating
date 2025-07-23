import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Switch, Typography } from '@mui/material'

const GuestRegistrationModal = ({
    open,
    onClose,
    isEditing,
    guestData,
    onGuestDataChange,
    onSubmit,
    relationships = []
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
                {isEditing ? '编辑宾客信息' : '宾客注册'}
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: '16px 32px'
                }}
            >
                <div className="space-y-6 py-8">
                    {/* Name - Required */}
                    <TextField
                        label="姓名 *"
                        fullWidth
                        variant="standard"
                        value={guestData.name}
                        onChange={(e) => onGuestDataChange({ ...guestData, name: e.target.value })}
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

                    {/* Gender - Required with Switch */}
                    <div className="flex flex-row items-center gap-5 mt-5">
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#6B7280',
                                fontSize: '1rem',
                                fontWeight: 'medium'
                            }}
                        >
                            性别 *
                        </Typography>
                        <div className="flex items-center space-x-4">
                            <Typography
                                sx={{
                                    color: guestData.gender === 'male' ? '#1976D2' : '#9CA3AF',
                                    fontWeight: guestData.gender === 'male' ? 'medium' : 'normal',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                男
                            </Typography>
                            <Switch
                                checked={guestData.gender === 'female'}
                                onChange={(e) => onGuestDataChange({
                                    ...guestData,
                                    gender: e.target.checked ? 'female' : 'male'
                                })}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#EC4899'
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#EC4899'
                                    },
                                    '& .MuiSwitch-switchBase': {
                                        color: '#1976D2'
                                    },
                                    '& .MuiSwitch-track': {
                                        backgroundColor: '#1976D2'
                                    }
                                }}
                            />
                            <Typography
                                sx={{
                                    color: guestData.gender === 'female' ? '#EC4899' : '#9CA3AF',
                                    fontWeight: guestData.gender === 'female' ? 'medium' : 'normal',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                女
                            </Typography>
                        </div>
                    </div>

                    {/* Phone - Required */}
                    <TextField
                        label="电话号码 *"
                        fullWidth
                        variant="standard"
                        type="tel"
                        value={guestData.phone}
                        onChange={(e) => onGuestDataChange({ ...guestData, phone: e.target.value })}
                        helperText={`请输入${import.meta.env.VITE_PHONE_NUMBER_LENGTH || 11}位手机号码`}
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

                    {/* Relationship - Required */}
                    <FormControl fullWidth variant="standard">
                        <InputLabel sx={{
                            '&.Mui-focused': {
                                color: '#6B7280'
                            }
                        }}>关系 *</InputLabel>
                        <Select
                            value={guestData.relationship}
                            label="关系 *"
                            onChange={(e) => onGuestDataChange({ ...guestData, relationship: e.target.value })}
                            sx={{
                                '& .MuiSelect-select:before': {
                                    borderBottomColor: '#E5E7EB',
                                },
                                '& .MuiSelect-select:hover:not(.Mui-disabled):before': {
                                    borderBottomColor: '#9CA3AF',
                                },
                                '& .MuiSelect-select:after': {
                                    borderBottomColor: '#6B7280',
                                }
                            }}
                        >
                            {relationships.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Notes - Optional */}
                    <TextField
                        label="备注"
                        fullWidth
                        variant="standard"
                        multiline
                        rows={2}
                        value={guestData.notes}
                        onChange={(e) => onGuestDataChange({ ...guestData, notes: e.target.value })}
                        helperText="可选填写特殊需求或备注信息"
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

                    {/* Accommodation - Optional */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={guestData.accommodation}
                                onChange={(e) => onGuestDataChange({ ...guestData, accommodation: e.target.checked })}
                                sx={{
                                    color: '#9CA3AF',
                                    '&.Mui-checked': {
                                        color: '#6B7280'
                                    }
                                }}
                            />
                        }
                        label="是否安排住宿"
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                color: '#6B7280',
                                fontSize: '0.875rem'
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
                    onClick={onSubmit}
                    variant="outlined"
                    type="button"
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
                        }
                    }}
                >
                    确认
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default GuestRegistrationModal