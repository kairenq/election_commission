import { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material'
import {
  People,
  HowToVote,
  Groups,
  Poll,
} from '@mui/icons-material'
import { elections, voters, parties, votes } from '../../services/api'

export default function AdminHome() {
  const [stats, setStats] = useState({
    elections: 0,
    voters: 0,
    parties: 0,
    votes: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [electionsRes, votersRes, partiesRes, votesRes] = await Promise.all([
        elections.getAll(),
        voters.getAll(),
        parties.getAll(),
        votes.getAll(),
      ])
      setStats({
        elections: electionsRes.data.length,
        voters: votersRes.data.length,
        parties: partiesRes.data.length,
        votes: votesRes.data.length,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const statCards = [
    { title: 'K1>@K', value: stats.elections, icon: <HowToVote />, color: '#1976d2' },
    { title: '718@0B5;8', value: stats.voters, icon: <People />, color: '#2e7d32' },
    { title: '0@B88', value: stats.parties, icon: <Groups />, color: '#ed6c02' },
    { title: '>;>A0', value: stats.votes, icon: <Poll />, color: '#9c27b0' },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        0=5;L C?@02;5=8O
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        >1@> ?>60;>20BL 2 A8AB5<C C?@02;5=8O 8718@0B5;L=>9 :><8AA859
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {card.value}
                    </Typography>
                    <Typography variant="body1">{card.title}</Typography>
                  </Box>
                  <Box sx={{ fontSize: 48, opacity: 0.8 }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          KAB@K5 459AB28O
        </Typography>
        <Typography variant="body1" color="text.secondary">
          K15@8B5 @0745; 2 <5=N A;520 4;O C?@02;5=8O 40==K<8 A8AB5<K.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            " #?@02;5=85 2K1>@0<8 8 3>;>A>20=85<
          </Typography>
          <Typography variant="body2" color="text.secondary">
            "  538AB@0F8O 8 C?@02;5=85 8718@0B5;O<8
          </Typography>
          <Typography variant="body2" color="text.secondary">
            " #?@02;5=85 ?>;8B8G5A:8<8 ?0@B8O<8
          </Typography>
          <Typography variant="body2" color="text.secondary">
            " 1@01>B:0 60;>1 8 @57C;LB0B>2
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
