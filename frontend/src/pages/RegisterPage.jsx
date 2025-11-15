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
  Tab,
  Tabs,
} from '@mui/material'
import { PersonAdd as RegisterIcon } from '@mui/icons-material'
import { useAuthStore } from '../utils/store'
import { auth } from '../services/api'

function TabPanel({ children, value, index }) {
  return value === index && <Box sx={{ pt: 3 }}>{children}</Box>
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [tabValue, setTabValue] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Voter form
  const [voterData, setVoterData] = useState({
    full_name: '',
    date_of_birth: '',
    address: '',
    email: '',
    phone: '',
    password: '',
  })

  // Party form
  const [partyData, setPartyData] = useState({
    name: '',
    registration_date: '',
    status: ':B82=0',
    password: '',
  })

  // Staff form
  const [staffData, setStaffData] = useState({
    full_name: '',
    date_of_birth: '',
    address: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleSubmit = async (e, type) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let data
      if (type === 'voter') data = voterData
      else if (type === 'party') data = partyData
      else data = staffData

      const response = await auth.register(type, data)
      const token = response.data.access_token

      // Get user data
      const userResponse = await auth.me()
      const user = userResponse.data

      setAuth(user, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'H81:0 @538AB@0F88')
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

      <Container maxWidth="md">
        <Box
          sx={{
            mt: 4,
            mb: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <RegisterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h4" fontWeight="bold">
                 538AB@0F8O
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
              <Tab label="718@0B5;L" />
              <Tab label="0@B8O" />
              <Tab label="!>B@C4=8:" />
            </Tabs>

            {/* Voter Registration */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={(e) => handleSubmit(e, 'voter')}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="$"
                  value={voterData.full_name}
                  onChange={(e) => setVoterData({ ...voterData, full_name: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="0B0 @>645=8O"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={voterData.date_of_birth}
                  onChange={(e) => setVoterData({ ...voterData, date_of_birth: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="4@5A"
                  value={voterData.address}
                  onChange={(e) => setVoterData({ ...voterData, address: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={voterData.email}
                  onChange={(e) => setVoterData({ ...voterData, email: e.target.value })}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label=""5;5D>="
                  value={voterData.phone}
                  onChange={(e) => setVoterData({ ...voterData, phone: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="0@>;L"
                  type="password"
                  value={voterData.password}
                  onChange={(e) => setVoterData({ ...voterData, password: e.target.value })}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? ' 538AB@0F8O...' : '0@538AB@8@>20BLAO'}
                </Button>
              </Box>
            </TabPanel>

            {/* Party Registration */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={(e) => handleSubmit(e, 'party')}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="0720=85 ?0@B88"
                  value={partyData.name}
                  onChange={(e) => setPartyData({ ...partyData, name: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="0B0 @538AB@0F88"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={partyData.registration_date}
                  onChange={(e) => setPartyData({ ...partyData, registration_date: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="0@>;L"
                  type="password"
                  value={partyData.password}
                  onChange={(e) => setPartyData({ ...partyData, password: e.target.value })}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? ' 538AB@0F8O...' : '0@538AB@8@>20BLAO'}
                </Button>
              </Box>
            </TabPanel>

            {/* Staff Registration */}
            <TabPanel value={tabValue} index={2}>
              <Box component="form" onSubmit={(e) => handleSubmit(e, 'staff')}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="$"
                  value={staffData.full_name}
                  onChange={(e) => setStaffData({ ...staffData, full_name: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="0B0 @>645=8O"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={staffData.date_of_birth}
                  onChange={(e) => setStaffData({ ...staffData, date_of_birth: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="4@5A"
                  value={staffData.address}
                  onChange={(e) => setStaffData({ ...staffData, address: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={staffData.email}
                  onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label=""5;5D>="
                  value={staffData.phone}
                  onChange={(e) => setStaffData({ ...staffData, phone: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="0@>;L"
                  type="password"
                  value={staffData.password}
                  onChange={(e) => setStaffData({ ...staffData, password: e.target.value })}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? ' 538AB@0F8O...' : '0@538AB@8@>20BLAO'}
                </Button>
              </Box>
            </TabPanel>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                #65 5ABL 0::0C=B? >948B5
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  )
}
