import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...value] = line.split('=')
    if (key && value) acc[key.trim()] = value.join('=').trim()
    return acc
  }, {})

const supabaseUrl = env.VITE_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const targetEmail = 'demo@agro.com'

async function setAdmin() {
  console.log(`Searching for user with email ${targetEmail}...`)
  
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error listing users:', listError)
    return
  }

  const user = users.find(u => u.email === targetEmail)

  if (!user) {
    console.error('User not found in list')
    console.log('Available users:', users.map(u => u.email))
    return
  }

  console.log(`Found user: ${user.id}. Setting admin role...`)
  
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { role: 'admin' }
  })

  if (error) {
    console.error('Error updating user:', error)
  } else {
    console.log('Success! User demo@agro.com is now an admin.')
    console.log('Metadata:', data.user.app_metadata)
  }
}

setAdmin()
