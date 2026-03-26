// Test password hashing
const bcrypt = require('bcryptjs')

async function testPassword() {
  const password = 'password123'
  const storedHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2'
  
  console.log('Testing password verification...')
  console.log('Password:', password)
  console.log('Stored hash:', storedHash)
  
  try {
    const isValid = await bcrypt.compare(password, storedHash)
    console.log('Password verification result:', isValid)
    
    if (isValid) {
      console.log('✅ Password verification works!')
    } else {
      console.log('❌ Password verification failed!')
      
      // Test creating a new hash
      const newHash = await bcrypt.hash(password, 12)
      console.log('New hash for same password:', newHash)
      
      const testNew = await bcrypt.compare(password, newHash)
      console.log('New hash verification:', testNew)
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testPassword()