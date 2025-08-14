import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import api from '../../utils/api';

const Residentes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [residentes, setResidentes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingResidente, setEditingResidente] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalResidentes, setTotalResidentes] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    documento: '',
    tipo_documento: 'DNI',
    email: '',
    telefono: '',
    departamento: '',
    piso: '',
    tipo_residente: 'propietario', // propietario, inquilino, familiar
    fecha_nacimiento: '',
    ocupacion: '',
    empresa: '',
    vehiculo: '',
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    fecha_registro: '',
    estado: 'activo', // activo, inactivo, suspendido
    observaciones: ''
  });

  useEffect(() => {
    fetchResidentes();
    fetchEstadisticas();
  }, [page, limit, searchTerm, estadoFilter, tipoFilter]);

  const fetchResidentes = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page + 1,
        limit: limit,
        search: searchTerm,
        estado: estadoFilter,
        tipo: tipoFilter
      });

      const response = await api.get(`/residentes?${params}`);
      setResidentes(response.data.residentes || []);
      setTotalResidentes(response.data.total || 0);
    } catch (err) {
      console.error('Error fetching residentes:', err);
      setError('Error al cargar los residentes');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      const response = await api.get('/residentes/estadisticas');
      setEstadisticas(response.data);
    } catch (err) {
      console.error('Error fetching estadísticas:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingResidente) {
        await api.put(`/residentes/${editingResidente.id}`, formData);
      } else {
        await api.post('/residentes', formData);
      }
      setOpenModal(false);
      setEditingResidente(null);
      resetForm();
      fetchResidentes();
      fetchEstadisticas();
    } catch (err) {
      console.error('Error saving residente:', err);
      setError('Error al guardar el residente');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (residente) => {
    setEditingResidente(residente);
    setFormData({
      nombre: residente.nombre || '',
      apellido_paterno: residente.apellido_paterno || '',
      apellido_materno: residente.apellido_materno || '',
      documento: residente.documento || '',
      tipo_documento: residente.tipo_documento || 'DNI',
      email: residente.email || '',
      telefono: residente.telefono || '',
      departamento: residente.departamento || '',
      piso: residente.piso || '',
      tipo_residente: residente.tipo_residente || 'propietario',
      fecha_nacimiento: residente.fecha_nacimiento || '',
      ocupacion: residente.ocupacion || '',
      empresa: residente.empresa || '',
      vehiculo: residente.vehiculo || '',
      placa: residente.placa || '',
      marca: residente.marca || '',
      modelo: residente.modelo || '',
      color: residente.color || '',
      fecha_registro: residente.fecha_registro || '',
      estado: residente.estado || 'activo',
      observaciones: residente.observaciones || ''
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este residente?')) {
      try {
        await api.delete(`/residentes/${id}`);
        fetchResidentes();
        fetchEstadisticas();
      } catch (err) {
        console.error('Error deleting residente:', err);
        setError('Error al eliminar el residente');
      }
    }
  };

  const handleCancelar = () => {
    setOpenModal(false);
    setEditingResidente(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      documento: '',
      tipo_documento: 'DNI',
      email: '',
      telefono: '',
      departamento: '',
      piso: '',
      tipo_residente: 'propietario',
      fecha_nacimiento: '',
      ocupacion: '',
      empresa: '',
      vehiculo: '',
      placa: '',
      marca: '',
      modelo: '',
      color: '',
      fecha_registro: '',
      estado: 'activo',
      observaciones: ''
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      activo: 'Activo',
      inactivo: 'Inactivo',
      suspendido: 'Suspendido'
    };
    return labels[estado] || estado;
  };

  const getEstadoColor = (estado) => {
    const colors = {
      activo: 'success',
      inactivo: 'warning',
      suspendido: 'error'
    };
    return colors[estado] || 'default';
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      propietario: 'Propietario',
      inquilino: 'Inquilino',
      familiar: 'Familiar'
    };
    return labels[tipo] || tipo;
  };

  const getTipoColor = (tipo) => {
    const colors = {
      propietario: 'primary',
      inquilino: 'secondary',
      familiar: 'info'
    };
    return colors[tipo] || 'default';
  };

  const handleRefresh = () => {
    fetchResidentes();
    fetchEstadisticas();
  };

  return (
    <Layout>
      <Box sx={{ p: 4, width: '100%' }}>
        {/* Título de la página */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <HomeIcon sx={{ fontSize: '2rem', mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Registro de Residentes
          </Typography>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: -2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2, 
              height: '70%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.primary.main }}>
                      {estadisticas.total_residentes || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                      Total de Residentes
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
                  }}>
                    <PersonIcon sx={{ color: theme.palette.primary.main, fontSize: '1.75rem' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2, 
              height: '70%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.success.main }}>
                      {estadisticas.residentes_activos || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                      Residentes Activos
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.success.main, 0.1) 
                  }}>
                    <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: '1.75rem' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2, 
              height: '70%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.warning.main }}>
                      {estadisticas.propietarios || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                      Propietarios
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.warning.main, 0.1) 
                  }}>
                    <HomeIcon sx={{ color: theme.palette.warning.main, fontSize: '1.75rem' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2, 
              height: '70%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.info.main }}>
                      {estadisticas.inquilinos || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                      Inquilinos
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.info.main, 0.1) 
                  }}>
                    <ScheduleIcon sx={{ color: theme.palette.info.main, fontSize: '1.75rem' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros y búsqueda */}
        <Paper sx={{ p: 3, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar residentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="suspendido">Suspendido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  label="Tipo"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="propietario">Propietario</MenuItem>
                  <MenuItem value="inquilino">Inquilino</MenuItem>
                  <MenuItem value="familiar">Familiar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  Actualizar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenModal(true)}
                  disabled={loading}
                >
                  Nuevo Residente
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de residentes */}
        <Paper sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nombre Completo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Documento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha Registro</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from(new Array(limit)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : residentes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No se encontraron residentes
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  residentes.map((residente) => (
                    <TableRow key={residente.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {`${residente.nombre} ${residente.apellido_paterno} ${residente.apellido_materno}`}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {residente.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {residente.tipo_documento}: {residente.documento}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          Depto. {residente.departamento}
                        </Typography>
                        {residente.piso && (
                          <Typography variant="caption" color="textSecondary">
                            Piso {residente.piso}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTipoLabel(residente.tipo_residente)}
                          color={getTipoColor(residente.tipo_residente)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {residente.telefono || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getEstadoLabel(residente.estado)}
                          color={getEstadoColor(residente.estado)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(residente.fecha_registro)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(residente)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(residente.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalResidentes}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>

        {/* Modal para crear/editar residente */}
        <Dialog
          open={openModal}
          onClose={handleCancelar}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {editingResidente ? 'Editar Residente' : 'Nuevo Residente'}
            </Typography>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Información Personal */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Información Personal
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Apellido Paterno"
                    value={formData.apellido_paterno}
                    onChange={(e) => setFormData({...formData, apellido_paterno: e.target.value})}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Apellido Materno"
                    value={formData.apellido_materno}
                    onChange={(e) => setFormData({...formData, apellido_materno: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Documento</InputLabel>
                    <Select
                      value={formData.tipo_documento}
                      onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}
                      label="Tipo de Documento"
                    >
                      <MenuItem value="DNI">DNI</MenuItem>
                      <MenuItem value="CE">CE</MenuItem>
                      <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
                      <MenuItem value="RUC">RUC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Número de Documento"
                    value={formData.documento}
                    onChange={(e) => setFormData({...formData, documento: e.target.value})}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Residente</InputLabel>
                    <Select
                      value={formData.tipo_residente}
                      onChange={(e) => setFormData({...formData, tipo_residente: e.target.value})}
                      label="Tipo de Residente"
                    >
                      <MenuItem value="propietario">Propietario</MenuItem>
                      <MenuItem value="inquilino">Inquilino</MenuItem>
                      <MenuItem value="familiar">Familiar</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ocupación"
                    value={formData.ocupacion}
                    onChange={(e) => setFormData({...formData, ocupacion: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                  />
                </Grid>

                {/* Información del Departamento */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Información del Departamento
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Departamento"
                    value={formData.departamento}
                    onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Piso"
                    value={formData.piso}
                    onChange={(e) => setFormData({...formData, piso: e.target.value})}
                  />
                </Grid>

                {/* Información del Vehículo */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Información del Vehículo
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Marca"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Modelo"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Placa"
                    value={formData.placa}
                    onChange={(e) => setFormData({...formData, placa: e.target.value})}
                  />
                </Grid>

                {/* Estado y Observaciones */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Estado y Observaciones
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                      label="Estado"
                    >
                      <MenuItem value="activo">Activo</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                      <MenuItem value="suspendido">Suspendido</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Registro"
                    type="date"
                    value={formData.fecha_registro}
                    onChange={(e) => setFormData({...formData, fecha_registro: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observaciones"
                    multiline
                    rows={3}
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={handleCancelar} color="inherit">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {editingResidente ? 'Actualizar' : 'Crear'} Residente
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Alertas de error */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </Box>
    </Layout>
  );
};

export default Residentes;
