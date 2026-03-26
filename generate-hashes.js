// Generate correct password hashes
const bcrypt = require('bcryptjs')

async function generateHashes() {
  console.log('Generating password hashes...')
  
  const password123Hash = await bcrypt.hash('password123', 12)
  const admin123Hash = await bcrypt.hash('admin123', 12)
  
  console.log('Password for demo@golfheart.com (password123):')
  console.log(password123Hash)
  console.log('')
  console.log('Password for admin@golfheart.com (admin123):')
  console.log(admin123Hash)
  console.log('')
  
  // Test verification
  console.log('Testing verification:')
  console.log('password123 verification:', await bcrypt.compare('password123', password123Hash))
  console.log('admin123 verification:', await bcrypt.compare('admin123', admin123Hash))
}

generateHashes()