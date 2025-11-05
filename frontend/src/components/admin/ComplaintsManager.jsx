import { useState, useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { complaints } from '../../services/api'

export default function ComplaintsManager() {
  const [data, setData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await complaints.getAll()
      setData(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>#?@02;5=85 60;>10<8</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID 8718@0B5;O</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>"8?</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>?8A0=85</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>!B0BCA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.voter_id}</TableCell>
                <TableCell>{row.complaint_type}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
