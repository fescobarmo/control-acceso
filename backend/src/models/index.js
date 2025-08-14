const { sequelize } = require('../config/database');

// Importar modelos
const User = require('./User')(sequelize);
const Role = require('./Role')(sequelize);
const Profile = require('./Profile')(sequelize);
const Visita = require('./Visita')(sequelize);
const VisitaExterna = require('./VisitaExterna')(sequelize);
const Residente = require('./Residente')(sequelize);

// Definir solo las asociaciones esenciales
User.belongsTo(Role, { foreignKey: 'rol_id', as: 'role' });
User.belongsTo(Profile, { foreignKey: 'perfil_id', as: 'profile' });

Role.hasMany(User, { foreignKey: 'rol_id', as: 'users' });
Profile.hasMany(User, { foreignKey: 'perfil_id', as: 'users' });

// Asociaciones para visitas
Visita.belongsTo(User, { foreignKey: 'created_by', as: 'creador' });
Visita.belongsTo(User, { foreignKey: 'updated_by', as: 'actualizador' });

User.hasMany(Visita, { foreignKey: 'created_by', as: 'visitas_creadas' });
User.hasMany(Visita, { foreignKey: 'updated_by', as: 'visitas_actualizadas' });

// Asociaciones para visitas externas
VisitaExterna.belongsTo(User, { foreignKey: 'created_by', as: 'creador' });
VisitaExterna.belongsTo(User, { foreignKey: 'updated_by', as: 'actualizador' });

User.hasMany(VisitaExterna, { foreignKey: 'created_by', as: 'visitas_externas_creadas' });
User.hasMany(VisitaExterna, { foreignKey: 'updated_by', as: 'visitas_externas_actualizadas' });

// Asociaciones para residentes
Residente.belongsTo(User, { foreignKey: 'created_by', as: 'creador' });
Residente.belongsTo(User, { foreignKey: 'updated_by', as: 'actualizador' });

User.hasMany(Residente, { foreignKey: 'created_by', as: 'residentes_creados' });
User.hasMany(Residente, { foreignKey: 'updated_by', as: 'residentes_actualizados' });

// Exportar modelos y sequelize
module.exports = {
  sequelize,
  User,
  Role,
  Profile,
  Visita,
  VisitaExterna,
  Residente
};
