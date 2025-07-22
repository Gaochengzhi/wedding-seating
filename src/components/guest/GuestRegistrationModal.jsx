import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material'

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
        >
            <DialogTitle>
                {isEditing ? '编辑宾客信息' : '宾客注册'}
            </DialogTitle>
            <DialogContent>
                <div className="space-y-4 pt-4">
                    {/* Name - Required */}
                    <TextField
                        label="姓名 *"
                        fullWidth
                        variant="outlined"
                        value={guestData.name}
                        onChange={(e) => onGuestDataChange({ ...guestData, name: e.target.value })}
                    />

                    {/* Gender - Required */}
                    <FormControl fullWidth>
                        <InputLabel>性别 *</InputLabel>
                        <Select
                            value={guestData.gender}
                            label="性别 *"
                            onChange={(e) => onGuestDataChange({ ...guestData, gender: e.target.value })}
                        >
                            <MenuItem value="male">男</MenuItem>
                            <MenuItem value="female">女</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Phone - Required */}
                    <TextField
                        label="电话号码 *"
                        fullWidth
                        variant="outlined"
                        type="tel"
                        value={guestData.phone}
                        onChange={(e) => onGuestDataChange({ ...guestData, phone: e.target.value })}
                        helperText="请输入11位手机号码"
                    />

                    {/* Relationship - Required */}
                    <FormControl fullWidth>
                        <InputLabel>关系 *</InputLabel>
                        <Select
                            value={guestData.relationship}
                            label="关系 *"
                            onChange={(e) => onGuestDataChange({ ...guestData, relationship: e.target.value })}
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
                        variant="outlined"
                        multiline
                        rows={2}
                        value={guestData.notes}
                        onChange={(e) => onGuestDataChange({ ...guestData, notes: e.target.value })}
                        helperText="可选填写特殊需求或备注信息"
                    />

                    {/* Accommodation - Optional */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={guestData.accommodation}
                                onChange={(e) => onGuestDataChange({ ...guestData, accommodation: e.target.checked })}
                            />
                        }
                        label="是否安排住宿"
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    取消
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    type="button"
                >
                    确认
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default GuestRegistrationModal