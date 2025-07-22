import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const AddTableModal = ({
    open,
    onClose,
    tableData,
    onTableDataChange,
    onSave
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
                添加新桌子
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: '16px 32px'
                }}
            >
                <div className="space-y-6 pt-2">
                    <TextField
                        label="桌号"
                        fullWidth
                        variant="standard"
                        type="number"
                        value={tableData.displayNumber}
                        onChange={(e) => onTableDataChange({ ...tableData, displayNumber: e.target.value })}
                        slotProps={{ htmlInput: { min: 1 } }}
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

                    <FormControl fullWidth variant="standard">
                        <InputLabel sx={{
                            '&.Mui-focused': {
                                color: '#6B7280'
                            }
                        }}>位置</InputLabel>
                        <Select
                            value={tableData.side}
                            label="位置"
                            onChange={(e) => onTableDataChange({ ...tableData, side: e.target.value })}
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
                            <MenuItem value="left">左侧</MenuItem>
                            <MenuItem value="right">右侧</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="桌子备注"
                        fullWidth
                        variant="standard"
                        multiline
                        rows={3}
                        value={tableData.notes}
                        onChange={(e) => onTableDataChange({ ...tableData, notes: e.target.value })}
                        placeholder="输入桌子备注信息（可选）"
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
                    onClick={onSave}
                    variant="outlined"
                    disabled={!tableData.displayNumber || !tableData.side}
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
                    添加
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddTableModal