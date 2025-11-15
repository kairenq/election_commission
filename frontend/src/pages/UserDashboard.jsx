import { useState } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  HowToVote,
  ReportProblem,
  Person,
  ExitToApp,
  BarChart,
} from '@mui/icons-material'
import { useAuthStore } from '../utils/store'

// Import user components (will create these)
import UserHome from '../components/user/UserHome'
import VotingPage from '../components/user/VotingPage'
import UserComplaints from '../components/user/UserComplaints'
import UserProfile from '../components/user/UserProfile'
import UserResults from '../components/user/UserResults'

const drawerWidth = 260

export default function UserDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { text: ';02=0O', icon: <Dashboard />, path: '' },
    { text: '>;>A>20=85', icon: <HowToVote />, path: 'voting' },
    { text: ' 57C;LB0BK', icon: <BarChart />, path: 'results' },
    { text: '0;>1K', icon: <ReportProblem />, path: 'complaints' },
    { text: '@>D8;L', icon: <Person />, path: 'profile' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          8G=K9 :018=5B
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(`/user/${item.path}`)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            718@0B5;L=0O :><8AA8O @O=A:>9 >1;0AB8
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />}>
            KE>4
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/voting" element={<VotingPage />} />
          <Route path="/results" element={<UserResults />} />
          <Route path="/complaints" element={<UserComplaints />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Box>
    </Box>
  )
}
