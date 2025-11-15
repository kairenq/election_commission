import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { results } from '../../services/api'

export default function UserResults() {
  const [data, setData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await results.getAll()
      setData(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
         57C;LB0BK 3>;>A>20=8O
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>K1>@K</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>0@B8O</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>>;>A>2</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>@>F5=B</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.election_id}</TableCell>
                <TableCell>{row.party_id}</TableCell>
                <TableCell>{row.vote_count}</TableCell>
                <TableCell>{row.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
