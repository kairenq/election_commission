import { useState, useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { parties } from '../../services/api'

export default function PartiesManager() {
  const [data, setData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await parties.getAll()
      setData(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>#?@02;5=85 ?0@B8O<8</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>0720=85</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>0B0 @538AB@0F88</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>!B0BCA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.registration_date}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
