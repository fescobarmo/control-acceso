import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import {
  Box,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  InputAdornment,
  Switch,
  FormControlLabel,
  CircularProgress,
  Pagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Search,
  FilterList,
  Person,
  Security,
  AdminPanelSettings,
  SupervisorAccount,
  Group,
  PersonAdd,
  PersonOutline,
  PersonOff,
  Assessment,
} from '@mui/icons-material';
import api from '../../utils/api';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    rol_id: '',
    perfil_id: '',
    telefono: '',
    direccion: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🚀 Componente Usuarios montado, cargando datos...');
    loadInitialData();
  }, []);

  // Log cuando cambien los estados
  useEffect(() => {
    console.log('📊 Estado actual - Roles:', roles.length, 'Perfiles:', perfiles.length);
  }, [roles, perfiles]);

  // Cargar usuarios cuando cambien los filtros
  useEffect(() => {
    loadUsers();
  }, [pagination.page, searchTerm, filterRol, filterEstado]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos iniciales...');
      
      const [rolesRes, perfilesRes] = await Promise.all([
        api.get('/users/roles'),
        api.get('/users/profiles')
      ]);

      console.log('📊 Respuesta de roles:', rolesRes.data);
      console.log('📊 Respuesta de perfiles:', perfilesRes.data);

      setRoles(rolesRes.data.data || []);
      setPerfiles(perfilesRes.data.data || []);
      
      console.log('✅ Roles cargados:', rolesRes.data.data);
      console.log('✅ Perfiles cargados:', perfilesRes.data.data);
      
      // Establecer valores por defecto
      if (rolesRes.data.data?.length > 0) {
        setFormData(prev => ({ ...prev, rol_id: rolesRes.data.data[0].id }));
        console.log('🎯 Rol por defecto establecido:', rolesRes.data.data[0].id);
      }
      if (perfilesRes.data.data?.length > 0) {
        setFormData(prev => ({ ...prev, perfil_id: perfilesRes.data.data[0].id }));
        console.log('🎯 Perfil por defecto establecido:', perfilesRes.data.data[0].id);
      }
    } catch (error) {
      console.error('❌ Error cargando datos iniciales:', error);
      setSnackbar({
        open: true,
        message: 'Error cargando datos iniciales',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        rol: filterRol,
        estado: filterEstado
      });

      const response = await api.get(`/users?${params}`);
      setUsuarios(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0
      }));
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setSnackbar({
        open: true,
        message: 'Error cargando usuarios',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error'
      });
      return;
    }

    try {
      if (editingUser) {
        // Actualizar usuario existente
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
          delete updateData.confirmPassword;
        }
        
        await api.put(`/users/${editingUser.id}`, updateData);
        setSnackbar({
          open: true,
          message: 'Usuario actualizado exitosamente',
          severity: 'success'
        });
      } else {
        // Crear nuevo usuario
        const createData = { ...formData };
        delete createData.confirmPassword;
        
        await api.post('/users', createData);
        setSnackbar({
          open: true,
          message: 'Usuario creado exitosamente',
          severity: 'success'
        });
      }

      handleCloseDialog();
      loadUsers(); // Recargar lista
    } catch (error) {
      console.error('Error guardando usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error guardando usuario';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      username: user.username || '',
      password: '',
      confirmPassword: '',
      rol_id: user.role?.id || '',
      perfil_id: user.profile?.id || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
    });
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
              await api.delete(`/users/${userId}`);
      setSnackbar({
        open: true,
        message: 'Usuario eliminado exitosamente',
        severity: 'success'
      });
      loadUsers(); // Recargar lista
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      setSnackbar({
        open: true,
        message: 'Error eliminando usuario',
        severity: 'error'
      });
    }
  };

  const handleToggleStatus = async (userId, currentEstado) => {
    try {
      const newEstado = currentEstado === 'activo' ? 'inactivo' : 'activo';
              await api.patch(`/users/${userId}/status`, { estado: newEstado });
      setSnackbar({
        open: true,
        message: `Estado cambiado a ${newEstado}`,
        severity: 'success'
      });
      loadUsers(); // Recargar lista
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setSnackbar({
        open: true,
        message: 'Error cambiando estado',
        severity: 'error'
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      rol_id: roles[0]?.id || '',
      perfil_id: perfiles[0]?.id || '',
      telefono: '',
      direccion: '',
    });
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterRol('');
    setFilterEstado('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Función para obtener el icono del rol
  const getRolIcon = (rolNombre) => {
    if (!rolNombre) return <Person />;
    
    const nombreLower = rolNombre.toLowerCase();
    if (nombreLower.includes('super administrador') || nombreLower.includes('admin')) return <AdminPanelSettings />;
    if (nombreLower.includes('gerente') || nombreLower.includes('supervisor')) return <SupervisorAccount />;
    if (nombreLower.includes('coordinador')) return <Group />;
    if (nombreLower.includes('avanzado')) return <PersonAdd />;
    if (nombreLower.includes('limitado')) return <PersonOutline />;
    if (nombreLower.includes('invitado')) return <PersonOff />;
    if (nombreLower.includes('auditor')) return <Assessment />;
    return <Person />;
  };

  // Función para obtener el color del rol
  const getRolColor = (rolNombre) => {
    if (!rolNombre) return 'default';
    
    const nombreLower = rolNombre.toLowerCase();
    if (nombreLower.includes('super administrador')) return 'error';
    if (nombreLower.includes('administrador')) return 'warning';
    if (nombreLower.includes('gerente')) return 'secondary';
    if (nombreLower.includes('supervisor')) return 'primary';
    if (nombreLower.includes('coordinador')) return 'success';
    if (nombreLower.includes('avanzado')) return 'warning';
    if (nombreLower.includes('estándar')) return 'info';
    if (nombreLower.includes('limitado')) return 'default';
    if (nombreLower.includes('invitado')) return 'default';
    if (nombreLower.includes('auditor')) return 'info';
    return 'default';
  };

  // Función para obtener el icono del perfil
  const getPerfilIcon = (perfilNombre) => {
    if (!perfilNombre) return <Security />;
    
    const nombreLower = perfilNombre.toLowerCase();
    if (nombreLower.includes('super administrador')) return <AdminPanelSettings />;
    if (nombreLower.includes('administrador')) return <Security />;
    if (nombreLower.includes('gerente')) return <SupervisorAccount />;
    if (nombreLower.includes('supervisor')) return <Group />;
    if (nombreLower.includes('coordinador')) return <Group />;
    if (nombreLower.includes('avanzado')) return <PersonAdd />;
    if (nombreLower.includes('estándar')) return <Person />;
    if (nombreLower.includes('limitado')) return <PersonOutline />;
    if (nombreLower.includes('invitado')) return <PersonOff />;
    if (nombreLower.includes('auditor')) return <Assessment />;
    return <Security />;
  };

  if (loading && usuarios.length === 0) {
    return (
      <Layout>
        <Box sx={{ p: 3, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3, width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.600' }}>
            Administra usuarios, roles y permisos del sistema
          </Typography>
        </Box>

        {/* Filtros y búsqueda */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por rol</InputLabel>
                <Select
                  value={filterRol}
                  onChange={(e) => setFilterRol(e.target.value)}
                  label="Filtrar por rol"
                >
                  <MenuItem value="">Todos los roles</MenuItem>
                  {roles.map(rol => (
                    <MenuItem key={rol.id} value={rol.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 16, 
                          height: 16, 
                          borderRadius: '50%', 
                          bgcolor: rol.color || '#1976d2', 
                          mr: 1 
                        }} />
                        {rol.nombre}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por estado</InputLabel>
                <Select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  label="Filtrar por estado"
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="bloqueado">Bloqueado</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleClearFilters}
              >
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  }
                }}
              >
                Nuevo Usuario
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Tabla de usuarios */}
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Perfil</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha Creación</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Último Acceso</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: user.role?.color || 'primary.main' }}>
                          {getRolIcon(user.role?.nombre)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {user.nombre} {user.apellido}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'grey.600' }}>
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getRolIcon(user.role?.nombre)}
                        label={user.role?.nombre}
                        color={getRolColor(user.role?.nombre)}
                        size="small"
                        sx={{ 
                          bgcolor: user.role?.color || undefined,
                          color: user.role?.color ? 'white' : undefined
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getPerfilIcon(user.profile?.nombre)}
                        label={user.profile?.nombre}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderColor: user.profile?.color || undefined,
                          color: user.profile?.color || undefined
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.estado === 'activo' ? 'Activo' : user.estado}
                        color={user.estado === 'activo' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar usuario">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cambiar estado">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={user.estado === 'activo'}
                                onChange={() => handleToggleStatus(user.id, user.estado)}
                                size="small"
                              />
                            }
                            label=""
                          />
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* Dialog para crear/editar usuario */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre de usuario"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      name="rol_id"
                      value={formData.rol_id}
                      onChange={handleInputChange}
                      label="Rol"
                    >
                      {roles.map(rol => (
                        <MenuItem key={rol.id} value={rol.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: rol.color || '#1976d2', 
                              mr: 1 
                            }} />
                            <Typography sx={{ ml: 1 }}>{rol.nombre}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Perfil</InputLabel>
                    <Select
                      name="perfil_id"
                      value={formData.perfil_id}
                      onChange={handleInputChange}
                      label="Perfil"
                    >
                      {perfiles.map(perfil => (
                        <MenuItem key={perfil.id} value={perfil.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: perfil.color || '#1976d2', 
                              mr: 1 
                            }} />
                            <Typography sx={{ ml: 1 }}>{perfil.nombre}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!editingUser}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  }
                }}
              >
                {editingUser ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Usuarios;
