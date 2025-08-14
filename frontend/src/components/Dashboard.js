import React from 'react';
import Layout from './Layout';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';

const Dashboard = () => {
  const statsCards = [
    {
      title: 'Total Usuarios',
      value: '40,689',
      change: '+8.5%',
      changeType: 'up',
      icon: <People sx={{ color: '#9c27b0' }} />,
      subtitle: 'Desde ayer'
    },
    {
      title: 'Total Accesos',
      value: '10,293',
      change: '+1.3%',
      changeType: 'up',
      icon: <ShoppingCart sx={{ color: '#ff9800' }} />,
      subtitle: 'Desde la semana pasada'
    },
    {
      title: 'Total Ventas',
      value: '$89,000',
      change: '-4.3%',
      changeType: 'down',
      icon: <AttachMoney sx={{ color: '#4caf50' }} />,
      subtitle: 'Desde ayer'
    },
    {
      title: 'Pendientes',
      value: '2,040',
      change: '+1.8%',
      changeType: 'up',
      icon: <Schedule sx={{ color: '#ff5722' }} />,
      subtitle: 'Desde ayer'
    }
  ];

  return (
    <Layout>
      <Box sx={{ p: 4, width: '100%' }}>
        {/* Título de la página */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 5 }}>
          Dashboard
        </Typography>

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                p: 2.5, 
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {card.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                        {card.title}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      bgcolor: alpha(card.icon.props.sx.color, 0.1) 
                    }}>
                      {card.icon}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {card.changeType === 'up' ? (
                      <TrendingUp sx={{ color: '#4caf50', fontSize: 16, mr: 0.5 }} />
                    ) : (
                      <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: card.changeType === 'up' ? '#4caf50' : '#f44336',
                        fontWeight: 'bold'
                      }}
                    >
                      {card.change}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', ml: 0.5 }}>
                      {card.subtitle}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Gráfico de ventas */}
        <Card sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Detalles de Ventas
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Octubre
              </Typography>
            </Box>
          </Box>
          
          {/* Placeholder para el gráfico */}
          <Box sx={{ 
            height: 300, 
            bgcolor: '#f8f9fa', 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #dee2e6'
          }}>
            <Typography variant="h6" sx={{ color: 'grey.500' }}>
              Gráfico de Ventas
            </Typography>
          </Box>
        </Card>
      </Box>
    </Layout>
  );
};

export default Dashboard;
