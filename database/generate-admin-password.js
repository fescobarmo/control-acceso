const bcrypt = require('bcrypt');

async function generatePassword() {
  const password = 'admin123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Contraseña:', password);
    console.log('Hash generado:', hash);
    
    // Verificar que funciona
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verificación exitosa:', isValid);
    
    return hash;
  } catch (error) {
    console.error('Error generando hash:', error);
  }
}

generatePassword();




