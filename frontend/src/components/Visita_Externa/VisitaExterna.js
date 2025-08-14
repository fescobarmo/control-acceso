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
  Container,
  Divider,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ExitToApp as ExitIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import api from '../../utils/api';

const VisitaExterna = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [visitasExternas, setVisitasExternas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingVisita, setEditingVisita] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalVisitasExternas, setTotalVisitasExternas] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [fechaFilter, setFechaFilter] = useState('');
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    empresa: '',
    motivo: '',
    ubicacion_destino: '',
    contacto: '',
    vehiculo: '',
    placa: '',
    tipo_visita: '',
    autorizacion: '',
    acompanantes: '',
    equipamiento: '',
    observaciones: ''
  });

  useEffect(() => {
    fetchVisitasExternas();
    fetchEstadisticas();
  }, [page, limit, searchTerm, estadoFilter, fechaFilter]);

  const fetchVisitasExternas = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page + 1,
        limit: limit,
        search: searchTerm,
        estado: estadoFilter,
        fecha: fechaFilter
      });

      const response = await api.get(`/visitas-externas?${params}`);
      setVisitasExternas(response.data.data);
      setTotalVisitasExternas(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching visitas externas:', error);
      setError('Error al cargar las visitas externas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      const response = await api.get('/visitas-externas/estadisticas');
      setEstadisticas(response.data.data);
    } catch (error) {
      console.error('Error fetching estadisticas:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingVisita) {
        await api.put(`/visitas-externas/${editingVisita.id}`, formData);
      } else {
        await api.post('/visitas-externas', formData);
      }
      
      setOpenModal(false);
      resetForm();
      fetchVisitasExternas();
      fetchEstadisticas();
    } catch (error) {
      console.error('Error saving visita externa:', error);
    }
  };

  const handleEdit = (visita) => {
    setEditingVisita(visita);
    setFormData({
      nombre: visita.nombre || '',
      apellido: visita.apellido || '',
      documento: visita.documento || '',
      empresa: visita.empresa || '',
      motivo: visita.motivo || '',
      ubicacion_destino: visita.ubicacion_destino || '',
      contacto: visita.contacto || '',
      vehiculo: visita.vehiculo || '',
      placa: visita.placa || '',
      tipo_visita: visita.tipo_visita || '',
      autorizacion: visita.autorizacion || '',
      acompanantes: visita.acompanantes || '',
      equipamiento: visita.equipamiento || '',
      observaciones: visita.observaciones || ''
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta visita externa?')) {
      try {
        await api.delete(`/visitas-externas/${id}`);
        fetchVisitasExternas();
        fetchEstadisticas();
      } catch (error) {
        console.error('Error deleting visita externa:', error);
      }
    }
  };

  const handleRegistrarSalida = async (id) => {
    try {
      await api.put(`/visitas-externas/${id}/salida`);
      fetchVisitasExternas();
      fetchEstadisticas();
    } catch (error) {
      console.error('Error registering salida:', error);
    }
  };

  const handleCancelar = async (id) => {
    try {
      await api.put(`/visitas-externas/${id}/cancelar`);
      fetchVisitasExternas();
      fetchEstadisticas();
    } catch (error) {
      console.error('Error canceling visita externa:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      documento: '',
      empresa: '',
      motivo: '',
      ubicacion_destino: '',
      contacto: '',
      vehiculo: '',
      placa: '',
      tipo_visita: '',
      autorizacion: '',
      acompanantes: '',
      equipamiento: '',
      observaciones: ''
    });
    setEditingVisita(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      ingreso: 'En Ingreso',
      salida: 'Completada',
      cancelada: 'Cancelada'
    };
    return labels[estado] || estado;
  };

  const getEstadoColor = (estado) => {
    const colors = {
      ingreso: 'primary',
      salida: 'success',
      cancelada: 'error'
    };
    return colors[estado] || 'default';
  };

  const handleRefresh = () => {
    fetchVisitasExternas();
    fetchEstadisticas();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setEstadoFilter('todos');
    setFechaFilter('');
    setPage(1);
  };

  return (
    <Layout>
      <Box sx={{ p: 3, width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Visitas Externas
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.600' }}>
            Administra y controla las visitas externas al complejo
          </Typography>
        </Box>

        {/* Filtros y búsqueda */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Buscar visitas..."
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
              <FormControl fullWidth>
                <InputLabel>Filtrar por estado</InputLabel>
                <Select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  label="Filtrar por estado"
                >
                  <MenuItem value="todos">Todos los estados</MenuItem>
                  <MenuItem value="ingreso">En Ingreso</MenuItem>
                  <MenuItem value="salida">Completadas</MenuItem>
                  <MenuItem value="cancelada">Canceladas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                value={fechaFilter}
                onChange={(e) => setFechaFilter(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleClearFilters}
              >
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  resetForm();
                  setOpenModal(true);
                }}
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  }
                }}
              >
                Nueva Visita Externa
              </Button>
            </Grid>
          </Grid>
        </Card>



        {/* Mensaje de error */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabla de visitas externas */}
        <Paper sx={{ borderRadius: 2, boxShadow: theme.shadows[2], overflow: 'hidden', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 200 }}>Nombre Completo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Documento</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Departamento</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Vehículo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Fecha Ingreso</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Fecha Salida</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Observaciones</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  // Skeleton loading
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                      <TableCell><Skeleton animation="wave" /></TableCell>
                    </TableRow>
                  ))
                ) : visitasExternas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No se encontraron visitas externas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visitasExternas.map((visita) => (
                    <TableRow key={visita.id} hover sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {visita.nombre} {visita.apellido}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {visita.documento || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {visita.departamento || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={visita.vehiculo ? 'Sí' : 'No'} 
                          size="small" 
                          color={visita.vehiculo ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {formatDate(visita.fecha_ingreso)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {visita.fecha_salida ? formatDate(visita.fecha_salida) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getEstadoLabel(visita.estado)} 
                          size="small" 
                          color={getEstadoColor(visita.estado)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {visita.observaciones || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(visita)}
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': { bgcolor: theme.palette.primary.light + '20' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {visitasExternas.length === 0 && !loading && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No se encontraron visitas externas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Intenta ajustar los filtros o crear una nueva visita externa
              </Typography>
            </Box>
          )}
          
          <TablePagination
            component="div"
            count={totalVisitasExternas}
            page={page - 1}
            onPageChange={(event, newPage) => setPage(newPage + 1)}
            rowsPerPage={limit}
            onRowsPerPageChange={(event) => {
              setLimit(parseInt(event.target.value, 10));
              setPage(1);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
          />
        </Paper>
      </Box>
    </Layout>
  );
};

export default VisitaExterna;


