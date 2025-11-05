import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material'
import { HowToVote, Info, BarChart } from '@mui/icons-material'

export default function UserHome() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        >1@> ?>60;>20BL
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        8G=K9 :018=5B 8718@0B5;O
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <HowToVote sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6">>;>A>20=85</Typography>
              <Typography variant="body2">
                @8<8B5 CG0AB85 2 2K1>@0E
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <BarChart sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6"> 57C;LB0BK</Typography>
              <Typography variant="body2">
                @>A<>B@ @57C;LB0B>2 2K1>@>2
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Info sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6">=D>@<0F8O</Typography>
              <Typography variant="body2">
                :BC0;L=K5 2K1>@K 8 =>2>AB8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          =AB@C:F88
        </Typography>
        <Typography variant="body2" paragraph>
          1. K15@8B5 @0745; ">;>A>20=85" 4;O CG0AB8O 2 2K1>@0E
        </Typography>
        <Typography variant="body2" paragraph>
          2. @>A<>B@8B5 @57C;LB0BK 2 @0745;5 " 57C;LB0BK"
        </Typography>
        <Typography variant="body2">
          3. >409B5 60;>1C 2 A;CG05 2KO2;5=8O =0@CH5=89
        </Typography>
      </Paper>
    </Box>
  )
}
