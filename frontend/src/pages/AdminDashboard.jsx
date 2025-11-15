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
  People,
  Groups,
  PersonPin,
  Poll,
  ReportProblem,
  BarChart,
  ExitToApp,
} from '@mui/icons-material'
import { useAuthStore } from '../utils/store'

// Import admin components (will create these)
import AdminHome from '../components/admin/AdminHome'
import ElectionsManager from '../components/admin/ElectionsManager'
import VotersManager from '../components/admin/VotersManager'
import PartiesManager from '../components/admin/PartiesManager'
import StaffManager from '../components/admin/StaffManager'
import VotesManager from '../components/admin/VotesManager'
import ComplaintsManager from '../components/admin/ComplaintsManager'
import ResultsManager from '../components/admin/ResultsManager'

const drawerWidth = 260

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { text: ';02=0O', icon: <Dashboard />, path: '' },
    { text: 'K1>@K', icon: <HowToVote />, path: 'elections' },
    { text: '718@0B5;8', icon: <People />, path: 'voters' },
    { text: '0@B88', icon: <Groups />, path: 'parties' },
    { text: '!>B@C4=8:8', icon: <PersonPin />, path: 'staff' },
    { text: '>;>A>20=85', icon: <Poll />, path: 'votes' },
    { text: '0;>1K', icon: <ReportProblem />, path: 'complaints' },
    { text: ' 57C;LB0BK', icon: <BarChart />, path: 'results' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          4<8=-?0=5;L
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(`/admin/${item.path}`)}>
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
            {user?.email} ({user?.role_name})
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
          <Route path="/" element={<AdminHome />} />
          <Route path="/elections" element={<ElectionsManager />} />
          <Route path="/voters" element={<VotersManager />} />
          <Route path="/parties" element={<PartiesManager />} />
          <Route path="/staff" element={<StaffManager />} />
          <Route path="/votes" element={<VotesManager />} />
          <Route path="/complaints" element={<ComplaintsManager />} />
          <Route path="/results" element={<ResultsManager />} />
        </Routes>
      </Box>
    </Box>
  )
}
