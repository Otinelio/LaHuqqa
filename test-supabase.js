import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikwuontvemydphzmxyvd.supabase.co'
const supabaseKey = 'sb_publishable_I87RKdFUnWqvWiwkWrCAJA_aVzOlORr'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('categories').select('*')
  console.log('Categories:', data, error)
  const { data: menu, error: menuErr } = await supabase.from('menu_items').select('*')
  console.log('Menu:', menu, menuErr)
}
test()
