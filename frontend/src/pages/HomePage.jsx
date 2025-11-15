import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material'
import {
  HowToVote,
  Groups,
  BarChart,
  Security,
} from '@mui/icons-material'
import { useAuthStore } from '../utils/store'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const features = [
    {
      icon: <HowToVote fontSize="large" color="primary" />,
      title: '-;5:B@>==>5 3>;>A>20=85',
      description: '#4>1=0O A8AB5<0 >=;09= 3>;>A>20=8O 4;O 2A5E 8718@0B5;59',
    },
    {
      icon: <Groups fontSize="large" color="primary" />,
      title: ' 538AB@0F8O ?0@B89',
      description: '@>AB0O @538AB@0F8O 8 C?@02;5=85 ?>;8B8G5A:8<8 ?0@B8O<8',
    },
    {
      icon: <BarChart fontSize="large" color="primary" />,
      title: ' 57C;LB0BK 2 @50;L=>< 2@5<5=8',
      description: 'BA;568209B5 @57C;LB0BK 3>;>A>20=8O 2 @568<5 @50;L=>3> 2@5<5=8',
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: '57>?0A=>ABL',
      description: '0I8B0 40==KE 8 ?@>7@0G=>ABL 8718@0B5;L=>3> ?@>F5AA0',
    },
  ]

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            718@0B5;L=0O :><8AA8O @O=A:>9 >1;0AB8
          </Typography>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                >9B8
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                 538AB@0F8O
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              8G=K9 :018=5B
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            >1@> ?>60;>20BL
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            =D>@<0F8>==0O A8AB5<0 8718@0B5;L=>9 :><8AA88 @O=A:>9 >1;0AB8
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => navigate('/register')}
                >
                  0@538AB@8@>20BLAO
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => navigate('/login')}
                >
                  >9B8
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => navigate('/dashboard')}
              >
                5@59B8 2 ;8G=K9 :018=5B
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold" mb={4}>
          >7<>6=>AB8 A8AB5<K
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h6" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" gutterBottom>
             A8AB5<5
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            =D>@<0F8>==0O A8AB5<0 8718@0B5;L=>9 :><8AA88 @O=A:>9 >1;0AB8 ?@54=07=0G5=0 4;O
            >@30=870F88 8 ?@>2545=8O 2K1>@>2, CG5B0 8718@0B5;59, @538AB@0F88 ?>;8B8G5A:8E ?0@B89
            8 >1@01>B:8 @57C;LB0B>2 3>;>A>20=8O.
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            !8AB5<0 >15A?5G8205B ?@>7@0G=>ABL 8718@0B5;L=>3> ?@>F5AA0 8 C4>1AB2> 4;O 2A5E
            CG0AB=8:>2.
          </Typography>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: 'grey.900', color: 'white' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" align="center">
            © 2025 718@0B5;L=0O :><8AA8O @O=A:>9 >1;0AB8
          </Typography>
        </Container>
      </Box>
    </>
  )
}
