import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import Layout from '../Layout';

const Propietarios = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPropietarios, setTotalPropietarios] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [openModal, setOpenModal] = useState(false);
  const [editingPropietario, setEditingPropietario] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    tipo: 'propietario', // propietario o residente
    telefono: '',
    email: '',
    direccion: '',
    unidad: '',
    estado: 'activo',
    observaciones: ''
  });

  // Estadísticas simuladas
  const [estadisticas] = useState({
    total_propietarios: 25,
    propietarios_activos: 20,
    residentes_activos: 15,
    propietarios_inactivos: 5
  });

  useEffect(() => {
    fetchPropietarios();
  }, [page, limit, searchTerm, estadoFilter, tipoFilter]);

  const fetchPropietarios = async () => {
    setLoading(true);
    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos simulados
      const mockData = [
        {
          id: 1,
          nombre: 'Juan Carlos',
          apellido: 'García',
          documento: '12345678',
          tipo: 'propietario',
          telefono: '0991234567',
          email: 'juan.garcia@email.com',
          direccion: 'Av. Principal 123',
          unidad: 'A-101',
          estado: 'activo',
          observaciones: 'Propietario original'
        },
        {
          id: 2,
          nombre: 'María Elena',
          apellido: 'Rodríguez',
          documento: '87654321',
          tipo: 'residente',
          telefono: '0987654321',
          email: 'maria.rodriguez@email.com',
          direccion: 'Calle Secundaria 456',
          unidad: 'B-205',
          estado: 'activo',
          observaciones: 'Residente autorizado'
        }
      ];
      
      setPropietarios(mockData);
      setTotalPropietarios(mockData.length);
      setError(null);
    } catch (err) {
      setError('Error al cargar propietarios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingPropietario) {
        // Actualizar existente
        setPropietarios(prev => 
          prev.map(p => 
            p.id === editingPropietario.id 
              ? { ...formData, id: p.id }
              : p
          )
        );
      } else {
        // Crear nuevo
        const newPropietario = {
          ...formData,
          id: Date.now()
        };
        setPropietarios(prev => [newPropietario, ...prev]);
      }
      
      resetForm();
      setOpenModal(false);
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleEdit = (propietario) => {
    setEditingPropietario(propietario);
    setFormData(propietario);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este propietario/residente?')) {
      try {
        setPropietarios(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      documento: '',
      tipo: 'propietario',
      telefono: '',
      email: '',
      direccion: '',
      unidad: '',
      estado: 'activo',
      observaciones: ''
    });
    setEditingPropietario(null);
  };

  const handleRefresh = () => {
    fetchPropietarios();
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'pendiente': return 'Pendiente';
      default: return estado;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'error';
      case 'pendiente': return 'warning';
      default: return 'default';
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'propietario': return 'Propietario';
      case 'residente': return 'Residente';
      default: return tipo;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'propietario': return 'primary';
      case 'residente': return 'secondary';
      default: return 'default';
    }
  };

  if (loading && propietarios.length === 0) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Propietarios / Residentes
            </Typography>
            <Typography>Cargando...</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 4, width: '100%' }}>
        {/* Título de la página */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <HomeIcon sx={{ fontSize: '2rem', mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Propietarios / Residentes
          </Typography>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
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
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.primary.main }}>
                      {estadisticas.total_propietarios || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                      Total Propietarios
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
                  }}>
                    <HomeIcon sx={{ color: theme.palette.primary.main, fontSize: '1.75rem' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
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
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.success.main }}>
                      {estadisticas.propietarios_activos || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                      Propietarios Activos
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
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.warning.main }}>
                      {estadisticas.residentes_activos || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                      Residentes Activos
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.warning.main, 0.1) 
                  }}>
                    <ScheduleIcon sx={{ color: theme.palette.warning.main, fontSize: '1.75rem' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
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
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: theme.palette.error.main }}>
                      {estadisticas.propietarios_inactivos || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
                      Propietarios Inactivos
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.error.main, 0.1) 
                  }}>
                    <CancelIcon sx={{ color: theme.palette.error.main, fontSize: '1.75rem' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros y búsqueda */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: theme.shadows[2] }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: '1.2rem' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              Filtros y Búsqueda
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'nowrap' }}>
            <TextField
              size="small"
              placeholder="Buscar por nombre, documento o unidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: '200px',
                flex: '1 1 auto',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: '150px', flex: '0 0 auto' }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                label="Estado"
                sx={{
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.grey[300],
                  },
                }}
              >
                <MenuItem value="todos">Todos los Estados</MenuItem>
                <MenuItem value="activo">Activos</MenuItem>
                <MenuItem value="inactivo">Inactivos</MenuItem>
                <MenuItem value="pendiente">Pendientes</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: '150px', flex: '0 0 auto' }}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                label="Tipo"
                sx={{
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.grey[300],
                  },
                }}
              >
                <MenuItem value="todos">Todos los Tipos</MenuItem>
                <MenuItem value="propietario">Propietarios</MenuItem>
                <MenuItem value="residente">Residentes</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
              sx={{
                borderRadius: 1,
                py: 0.5,
                px: 2,
                fontWeight: 'bold',
                boxShadow: theme.shadows[1],
                fontSize: '0.8rem',
                flex: '0 0 auto',
                '&:hover': {
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              Nuevo Propietario
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ 
                borderRadius: 1, 
                fontSize: '0.8rem',
                flex: '0 0 auto',
                ml: 'auto'
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Paper>

        {/* Tabla de propietarios */}
        <Paper sx={{ borderRadius: 2, boxShadow: theme.shadows[2], overflow: 'hidden', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Documento</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Tipo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Teléfono</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Dirección</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 80 }}>Unidad</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 100 }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Observaciones</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 120 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {propietarios.map((propietario) => (
                  <TableRow key={propietario.id} hover sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {propietario.nombre} {propietario.apellido}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {propietario.documento}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getTipoLabel(propietario.tipo)} 
                        size="small" 
                        color={getTipoColor(propietario.tipo)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {propietario.telefono}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {propietario.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {propietario.direccion}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {propietario.unidad}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getEstadoLabel(propietario.estado)} 
                        size="small" 
                        color={getEstadoColor(propietario.estado)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                                           <Typography variant="body2" sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                       {propietario.observaciones || 'N/A'}
                     </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(propietario)}
                          sx={{ 
                            color: theme.palette.primary.main,
                            '&:hover': { bgcolor: theme.palette.primary.light + '20' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(propietario.id)}
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': { bgcolor: theme.palette.error.light + '20' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {propietarios.length === 0 && !loading && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No se encontraron propietarios/residentes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Intenta ajustar los filtros o crear un nuevo propietario/residente
              </Typography>
            </Box>
          )}
          
          <TablePagination
            component="div"
            count={totalPropietarios}
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

export default Propietarios;
