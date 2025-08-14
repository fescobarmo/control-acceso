import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Security,
  Assessment,
  Settings,
  Notifications,
  Search,
  Menu as MenuIcon,
  Person,
  PersonAdd,
  ExitToApp,
  CalendarToday,
  CheckBox,
  ContactSupport,
  Receipt,
  ShoppingCart,
  BarChart,
  Group,
  TableChart,
  KeyboardArrowDown,
  Book,
  Home,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Estilos personalizados
const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const drawerWidth = 280;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout: authLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authLogout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleMenuClick = (menuId) => {
    if (menuId === 'dashboard') {
      navigate('/dashboard');
    } else if (menuId === 'users') {
      navigate('/usuarios');
    } else if (menuId === 'residentes') {
      navigate('/residentes');
    } else if (menuId === 'visitas') {
      navigate('/visitas');
    } else if (menuId === 'visitas-externas') {
      navigate('/visitas-externas');
    } else if (menuId === 'visitantes') {
      navigate('/visitantes');
    } else if (menuId === 'owners') {
      navigate('/residentes');
    } else if (menuId === 'externals') {
      navigate('/personas-externas');
    } else if (menuId === 'vehicles') {
      navigate('/vehiculos');
    } else if (menuId === 'events') {
      navigate('/eventos');
    } else if (menuId === 'crossData') {
      navigate('/datos-transversales');
    }
  };

  const getCurrentMenu = () => {
    if (location.pathname === '/dashboard') return 'dashboard';
    if (location.pathname === '/usuarios') return 'users';
    if (location.pathname === '/residentes') return 'residentes';
    if (location.pathname === '/visitas') return 'visitas';
    if (location.pathname === '/visitas-externas') return 'visitas-externas';
    if (location.pathname === '/visitantes') return 'visitors';
    if (location.pathname === '/personas-externas') return 'externals';
    if (location.pathname === '/vehiculos') return 'vehicles';
    if (location.pathname === '/eventos') return 'events';
    if (location.pathname === '/datos-transversales') return 'crossData';
    return 'dashboard';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'users', label: 'Usuarios', icon: <People /> },
    { id: 'residentes', label: 'Residente / Propietario', icon: <Home /> },
    { id: 'visitas', label: 'Visitas', icon: <Book /> },
    { id: 'visitas-externas', label: 'Visitas Externas', icon: <PersonAdd /> },
    { id: 'access', label: 'Accesos', icon: <Security /> },
    { id: 'reports', label: 'Reportes', icon: <Assessment /> },
    { id: 'settings', label: 'Configuración', icon: <Settings /> },
  ];

  const secondaryMenuItems = [
    { id: 'visitors', label: 'Libro de Visitantes', icon: <People /> },
    { id: 'owners', label: 'Registro de Propietarios/Residentes', icon: <Person /> },
    { id: 'externals', label: 'Registro de Personas Externas', icon: <PersonAdd /> },
    { id: 'vehicles', label: 'Registro Vehicular', icon: <ShoppingCart /> },
    { id: 'events', label: 'Estadísticas de Eventos', icon: <Assessment /> },
    { id: 'crossData', label: 'Datos Transversales Esenciales', icon: <BarChart /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'white' }}>
      {/* Logo */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          ControlAcceso
        </Typography>
      </Box>

      {/* Menú Principal */}
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={getCurrentMenu() === item.id}
              onClick={() => handleMenuClick(item.id)}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Menú Secundario */}
      <Box sx={{ px: 3, py: 1 }}>
        <Typography variant="overline" sx={{ color: 'grey.600', fontWeight: 'bold' }}>
          PÁGINAS
        </Typography>
      </Box>
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={getCurrentMenu() === item.id}
              onClick={() => handleMenuClick(item.id)}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'grey.600' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'grey.800',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 2
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Barra de búsqueda */}
          <SearchBox>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchBox>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notificaciones */}
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={6} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Selector de idioma */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Español
            </Typography>
            <KeyboardArrowDown />
          </Box>

          {/* Perfil de usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 40, height: 40, mr: 1 }}>
              <Person />
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.600' }}>
                {user?.profile?.nombre || 'Perfil'}
              </Typography>
            </Box>
            <IconButton onClick={handleProfileMenuOpen}>
              <KeyboardArrowDown />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú lateral */}
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
          zIndex: 0,
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          pl: 2.5
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
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

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 4,
          zIndex: 1,
          position: 'relative',
          ml: { sm: `${drawerWidth - 130}px` }
        }}
      >
        {children}
      </Box>

      {/* Menú de perfil */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;
