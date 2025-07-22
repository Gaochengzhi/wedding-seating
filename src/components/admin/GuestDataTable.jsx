import { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Box,
    Typography,
    TablePagination,
    FormControlLabel,
    Checkbox
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material'

const GuestDataTable = ({ guests, relationships, onUpdateGuest, onDeleteGuest }) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingGuest, setEditingGuest] = useState(null)
    const [editData, setEditData] = useState({})

    const handleEditClick = (guest) => {
        setEditingGuest(guest)
        setEditData({
            name: guest.name || '',
            gender: guest.gender || '',
            phone: guest.phone || '',
            relationship: guest.relationship || '',
            notes: guest.notes || '',
            accommodation: guest.accommodation || false
        })
        setEditDialogOpen(true)
    }

    const handleEditSave = () => {
        if (editingGuest && onUpdateGuest) {
            onUpdateGuest(editingGuest, editData)
        }
        setEditDialogOpen(false)
        setEditingGuest(null)
        setEditData({})
    }

    const handleEditCancel = () => {
        setEditDialogOpen(false)
        setEditingGuest(null)
        setEditData({})
    }

    const handleDeleteClick = (guest) => {
        if (window.confirm(`确定要删除宾客 ${guest.name} 吗？`)) {
            onDeleteGuest(guest)
        }
    }

    const handleExportCSV = () => {
        if (!guests || guests.length === 0) {
            alert('没有数据可导出')
            return
        }

        // Create CSV content
        const headers = ['姓名', '性别', '电话', '关系', '备注', '住宿', '桌号', '座位号', '登记时间']
        const csvContent = [
            headers.join(','),
            ...guests.map(guest => [
                guest.name || '',
                guest.gender === 'male' ? '男' : '女',
                guest.phone || '',
                getRelationshipLabel(guest.relationship),
                `"${guest.notes || ''}"`, // Quote to handle commas in notes
                guest.accommodation ? '是' : '否',
                guest.tableid || '',
                guest.seatnumber || '',
                guest.timestamp ? new Date(guest.timestamp).toLocaleString('zh-CN') : ''
            ].join(','))
        ].join('\n')

        // Download file
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `宾客名单_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    const getRelationshipLabel = (value) => {
        const relationship = relationships.find(r => r.value === value)
        return relationship ? relationship.label : value
    }

    const getGenderColor = (gender) => {
        return gender === 'male' ? 'primary' : 'secondary'
    }

    const getAccommodationColor = (accommodation) => {
        return accommodation ? 'success' : 'default'
    }

    // Pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const paginatedGuests = guests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    宾客数据管理 ({guests.length} 位宾客)
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportCSV}
                >
                    导出CSV
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>姓名</TableCell>
                            <TableCell>性别</TableCell>
                            <TableCell>电话</TableCell>
                            <TableCell>关系</TableCell>
                            <TableCell>备注</TableCell>
                            <TableCell>住宿</TableCell>
                            <TableCell>桌号</TableCell>
                            <TableCell>座位</TableCell>
                            <TableCell>登记时间</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedGuests.map((guest, index) => (
                            <TableRow key={`${guest.tableid}_${guest.seatid}_${index}`}>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {guest.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={guest.gender === 'male' ? '男' : '女'}
                                        color={getGenderColor(guest.gender)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontFamily="monospace">
                                        {guest.phone}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getRelationshipLabel(guest.relationship)}
                                        variant="outlined"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {guest.notes || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={guest.accommodation ? '是' : '否'}
                                        color={getAccommodationColor(guest.accommodation)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{guest.tableid}</TableCell>
                                <TableCell>{guest.seatnumber}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontSize="0.75rem">
                                        {guest.timestamp ? new Date(guest.timestamp).toLocaleString('zh-CN') : '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <IconButton size="small" onClick={() => handleEditClick(guest)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(guest)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={guests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="每页显示:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
            />

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="sm" fullWidth>
                <DialogTitle>编辑宾客信息</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="姓名"
                            value={editData.name || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            fullWidth
                            required
                        />
                        
                        <FormControl fullWidth required>
                            <InputLabel>性别</InputLabel>
                            <Select
                                value={editData.gender || ''}
                                label="性别"
                                onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
                            >
                                <MenuItem value="male">男</MenuItem>
                                <MenuItem value="female">女</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="电话号码"
                            value={editData.phone || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                            fullWidth
                            required
                        />

                        <FormControl fullWidth required>
                            <InputLabel>关系</InputLabel>
                            <Select
                                value={editData.relationship || ''}
                                label="关系"
                                onChange={(e) => setEditData(prev => ({ ...prev, relationship: e.target.value }))}
                            >
                                {relationships.map(rel => (
                                    <MenuItem key={rel.value} value={rel.value}>
                                        {rel.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="备注"
                            value={editData.notes || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                            multiline
                            rows={2}
                            fullWidth
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={editData.accommodation || false}
                                    onChange={(e) => setEditData(prev => ({ ...prev, accommodation: e.target.checked }))}
                                />
                            }
                            label="需要安排住宿"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCancel}>取消</Button>
                    <Button onClick={handleEditSave} variant="contained">保存</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default GuestDataTable