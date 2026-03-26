// Test database connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ukbtozftlofoosmsrrtq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYnRvemZ0bG9mb29zbXNycnRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM3NDI1MiwiZXhwIjoyMDg5OTUwMjUyfQ.kSvMQ9TIuWgfY7iGQtm-M_QSONis_P-VRm3srs2mgG0'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection with service role...')
    
    // Test users table with service role key
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('email, first_name, subscription_status')
    
    if (userError) {
      console.error('❌ Users table error:', userError.message)
    } else if (users && users.length > 0) {
      console.log('✅ Demo users found:')
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.first_name}) - ${user.subscription_status}`)
      })
    } else {
      console.log('⚠️ No users found in database')
    }
    
    // Test charities
    const { data: charities, error: charityError } = await supabase
      .from('charities')
      .select('name')
      .limit(3)
    
    if (charityError) {
      console.error('❌ Charities error:', charityError.message)
    } else {
      console.log('✅ Charities found:', charities.map(c => c.name))
    }
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
  }
}

testConnection()