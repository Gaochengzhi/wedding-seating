import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
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
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
    Card,
    CardContent,
    Divider
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DragHandle as DragIcon
} from '@mui/icons-material'

const RelationshipManager = ({
    relationships,
    onAddRelationship,
    onUpdateRelationship,
    onDeleteRelationship,
    onReorderRelationships
}) => {
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingRelationship, setEditingRelationship] = useState(null)
    const [formData, setFormData] = useState({
        value: '',
        label: '',
        category: 'other'
    })

    const categoryOptions = [
        { value: 'groom', label: '男方相关' },
        { value: 'bride', label: '女方相关' },
        { value: 'groom_family', label: '男方家庭' },
        { value: 'bride_family', label: '女方家庭' },
        { value: 'other', label: '其他' }
    ]

    const getCategoryLabel = (category) => {
        const cat = categoryOptions.find(c => c.value === category)
        return cat ? cat.label : category
    }

    const getCategoryColor = (category) => {
        const colors = {
            groom: 'primary',
            bride: 'secondary',
            groom_family: 'info',
            bride_family: 'warning',
            other: 'default'
        }
        return colors[category] || 'default'
    }

    const handleAddClick = () => {
        setFormData({
            value: '',
            label: '',
            category: 'other'
        })
        setAddDialogOpen(true)
    }

    const handleEditClick = (relationship) => {
        setEditingRelationship(relationship)
        setFormData({
            value: relationship.value,
            label: relationship.label,
            category: relationship.category || 'other'
        })
        setEditDialogOpen(true)
    }

    const handleAddSave = async () => {
        if (!formData.value || !formData.label) {
            alert('请填写完整信息')
            return
        }

        try {
            await onAddRelationship(formData.value, formData.label, formData.category)
            setAddDialogOpen(false)
            setFormData({ value: '', label: '', category: 'other' })
        } catch (error) {
            alert('添加失败: ' + error.message)
        }
    }

    const handleEditSave = async () => {
        if (!formData.label) {
            alert('请填写标签名称')
            return
        }

        try {
            await onUpdateRelationship(
                editingRelationship.value,
                formData.label,
                formData.category,
                editingRelationship.order
            )
            setEditDialogOpen(false)
            setEditingRelationship(null)
            setFormData({ value: '', label: '', category: 'other' })
        } catch (error) {
            alert('更新失败: ' + error.message)
        }
    }

    const handleDeleteClick = async (relationship) => {
        if (window.confirm(`确定要删除关系标签"${relationship.label}"吗？`)) {
            try {
                await onDeleteRelationship(relationship.value)
            } catch (error) {
                alert('删除失败: ' + error.message)
            }
        }
    }

    const handleCancel = () => {
        setAddDialogOpen(false)
        setEditDialogOpen(false)
        setEditingRelationship(null)
        setFormData({ value: '', label: '', category: 'other' })
    }

    // Group relationships by category
    const groupedRelationships = relationships.reduce((acc, rel) => {
        const category = rel.category || 'other'
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(rel)
        return acc
    }, {})

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 2 }}>
                <Typography variant="h6">
                    关系标签管理 ({relationships.length} 个标签)
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    添加标签
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(groupedRelationships).map(([category, categoryRelationships]) => (
                    <Card key={category} variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                {getCategoryLabel(category)} ({categoryRelationships.length}个)
                            </Typography>
                            <List dense>
                                {categoryRelationships.map((relationship, index) => (
                                    <ListItem
                                        key={relationship.value}
                                        secondaryAction={
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <IconButton size="small" onClick={() => handleEditClick(relationship)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(relationship)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        }
                                    >
                                        <IconButton size="small" sx={{ cursor: 'move', mr: 1 }}>
                                            <DragIcon fontSize="small" />
                                        </IconButton>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {relationship.label}
                                                    </Typography>
                                                    <Chip
                                                        label={relationship.value}
                                                        size="small"
                                                        variant="outlined"
                                                        color={getCategoryColor(category)}
                                                    />
                                                </Box>
                                            }
                                            secondary={`排序: ${relationship.order}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Add Dialog */}
            <Dialog 
                open={addDialogOpen} 
                onClose={handleCancel} 
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
                    添加关系标签
                </DialogTitle>
                <DialogContent
                    sx={{
                        padding: '16px 32px'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <TextField
                            label="标签值 (唯一标识)"
                            value={formData.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                            fullWidth
                            required
                            variant="standard"
                            placeholder="例如: groom_college_friend"
                            helperText="用于程序识别，建议使用英文和下划线"
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
                            label="显示名称"
                            value={formData.label}
                            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                            fullWidth
                            required
                            variant="standard"
                            placeholder="例如: 男方大学同学"
                            helperText="用户看到的标签名称"
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
                            }}>分类</InputLabel>
                            <Select
                                value={formData.category}
                                label="分类"
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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
                                {categoryOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: '16px 32px 24px',
                        gap: 2
                    }}
                >
                    <Button 
                        onClick={handleCancel}
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
                        onClick={handleAddSave} 
                        variant="outlined"
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
                        添加
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog 
                open={editDialogOpen} 
                onClose={handleCancel} 
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
                    编辑关系标签
                </DialogTitle>
                <DialogContent
                    sx={{
                        padding: '16px 32px'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <TextField
                            label="标签值"
                            value={formData.value}
                            fullWidth
                            disabled
                            variant="standard"
                            helperText="标签值不能修改"
                            sx={{
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: '#E5E7EB',
                                },
                                '& .MuiInput-underline.Mui-disabled:before': {
                                    borderBottomColor: '#E5E7EB',
                                    borderBottomStyle: 'dotted'
                                }
                            }}
                        />

                        <TextField
                            label="显示名称"
                            value={formData.label}
                            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                            fullWidth
                            required
                            variant="standard"
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
                            }}>分类</InputLabel>
                            <Select
                                value={formData.category}
                                label="分类"
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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
                                {categoryOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: '16px 32px 24px',
                        gap: 2
                    }}
                >
                    <Button 
                        onClick={handleCancel}
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
                        onClick={handleEditSave} 
                        variant="outlined"
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
                        保存
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default RelationshipManager