import { Box, Typography, Paper } from '@mui/material'
import { useAuthStore } from '../../utils/store'

export default function UserProfile() {
  const { user } = useAuthStore()

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        @>D8;L
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Email: {user?.email}
        </Typography>
        <Typography variant="body1">
          >38=: {user?.login}
        </Typography>
        <Typography variant="body1">
           >;L: {user?.role_name}
        </Typography>
      </Paper>
    </Box>
  )
}
