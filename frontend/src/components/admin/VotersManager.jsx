import { useState, useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { voters } from '../../services/api'

export default function VotersManager() {
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await voters.getAll()
      setData(response.data)
    } catch (err) {
      setError('H81:0 703@C7:8 40==KE')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('K C25@5=K?')) {
      try {
        await voters.delete(id)
        loadData()
      } catch (err) {
        setError('H81:0 C40;5=8O')
      }
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        #?@02;5=85 8718@0B5;O<8
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>$</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>0B0 @>645=8O</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>4@5A</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>59AB28O</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.full_name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.date_of_birth}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
