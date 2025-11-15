import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'
import { useAuthStore } from '../utils/store'
import { auth } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const loginResponse = await auth.login(formData)
      const token = loginResponse.data.access_token

      // Get user data
      const userResponse = await auth.me()
      const user = userResponse.data

      setAuth(user, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'H81:0 2E>40')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            718@0B5;L=0O :><8AA8O @O=A:>9 >1;0AB8
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            0 3;02=CN
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h4" fontWeight="bold">
                E>4 2 A8AB5<C
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label=">38="
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="0@>;L"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'E>4...' : '>9B8'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/register" variant="body2">
                  5B 0::0C=B0? 0@538AB@8@C9B5AL
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  )
}
