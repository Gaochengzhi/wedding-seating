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
        >
            <DialogTitle>
                添加新桌子
            </DialogTitle>
            <DialogContent>
                <div className="space-y-4 pt-4">
                    <TextField
                        label="桌号"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={tableData.displayNumber}
                        onChange={(e) => onTableDataChange({...tableData, displayNumber: e.target.value})}
                        inputProps={{ min: 1 }}
                    />
                    
                    <FormControl fullWidth>
                        <InputLabel>位置</InputLabel>
                        <Select
                            value={tableData.side}
                            label="位置"
                            onChange={(e) => onTableDataChange({...tableData, side: e.target.value})}
                        >
                            <MenuItem value="left">左侧</MenuItem>
                            <MenuItem value="right">右侧</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <TextField
                        label="桌子备注"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={tableData.notes}
                        onChange={(e) => onTableDataChange({...tableData, notes: e.target.value})}
                        placeholder="输入桌子备注信息（可选）"
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    取消
                </Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    disabled={!tableData.displayNumber || !tableData.side}
                >
                    添加
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddTableModal