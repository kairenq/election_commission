import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { elections } from '../../services/api'
import { format } from 'date-fns'

export default function ElectionsManager() {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    election_type: '',
    status: '0?;0=8@>20=K',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await elections.getAll()
      setData(response.data)
    } catch (err) {
      setError('H81:0 703@C7:8 40==KE')
    }
  }

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item)
      setFormData({
        name: item.name,
        start_date: item.start_date,
        end_date: item.end_date,
        election_type: item.election_type,
        status: item.status,
      })
    } else {
      setEditItem(null)
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        election_type: '',
        status: '0?;0=8@>20=K',
      })
    }
    setOpen(true)
    setError('')
  }

  const handleClose = () => {
    setOpen(false)
    setEditItem(null)
  }

  const handleSubmit = async () => {
    try {
      if (editItem) {
        await elections.update(editItem.id, formData)
      } else {
        await elections.create(formData)
      }
      handleClose()
      loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'H81:0 A>E@0=5=8O')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('K C25@5=K, GB> E>B8B5 C40;8BL MB8 2K1>@K?')) {
      try {
        await elections.delete(id)
        loadData()
      } catch (err) {
        setError('H81:0 C40;5=8O')
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          #?@02;5=85 2K1>@0<8
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          >1028BL 2K1>@K
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>0720=85</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>0B0 =0G0;0</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>0B0 >:>=G0=8O</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>"8?</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>!B0BCA</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>59AB28O</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.start_date}</TableCell>
                <TableCell>{row.end_date}</TableCell>
                <TableCell>{row.election_type}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(row)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editItem ? ' 540:B8@>20BL 2K1>@K' : '>1028BL 2K1>@K'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="0720=85"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="0B0 =0G0;0"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="0B0 >:>=G0=8O"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
          <TextField
            margin="dense"
            label=""8? 2K1>@>2"
            fullWidth
            value={formData.election_type}
            onChange={(e) => setFormData({ ...formData, election_type: e.target.value })}
          />
          <TextField
            margin="dense"
            label="!B0BCA"
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>B<5=0</Button>
          <Button onClick={handleSubmit} variant="contained">
            !>E@0=8BL
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
