import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

const TableNotesModal = ({
    open,
    onClose,
    table,
    noteInput,
    onNoteInputChange,
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
                编辑 {table?.displayNumber}桌 备注
            </DialogTitle>
            <DialogContent>
                <div className="space-y-4 pt-4">
                    <TextField
                        label="桌子备注"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={noteInput}
                        onChange={(e) => onNoteInputChange(e.target.value)}
                        placeholder="输入桌子备注信息，如：VIP桌、新娘同学桌等"
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
                >
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TableNotesModal