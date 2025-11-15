import { useState, useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { votes } from '../../services/api'

export default function VotesManager() {
  const [data, setData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await votes.getAll()
      setData(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>#?@02;5=85 3>;>A>20=85<</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID 8718@0B5;O</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID 2K1>@>2</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>@5<O</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>5AB></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.voter_id}</TableCell>
                <TableCell>{row.election_id}</TableCell>
                <TableCell>{new Date(row.voting_time).toLocaleString()}</TableCell>
                <TableCell>{row.voting_place}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
