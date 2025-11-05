import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, Alert } from '@mui/material'
import { elections } from '../../services/api'

export default function VotingPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await elections.getAll()
      setData(response.data.filter(e => e.status === '4CB'))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        >;>A>20=85
      </Typography>
      {data.length === 0 ? (
        <Alert severity="info">
           40==K9 <><5=B =5B 0:B82=KE 2K1>@>2
        </Alert>
      ) : (
        data.map((election) => (
          <Paper key={election.id} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">{election.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              "8?: {election.election_type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              5@8>4: {election.start_date} - {election.end_date}
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              @>3>;>A>20BL
            </Button>
          </Paper>
        ))
      )}
    </Box>
  )
}
