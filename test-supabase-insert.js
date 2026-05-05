import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikwuontvemydphzmxyvd.supabase.co'
const supabaseKey = 'sb_publishable_I87RKdFUnWqvWiwkWrCAJA_aVzOlORr'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('categories').insert({ name: 'Test Category', position: 1 }).select()
  console.log('Insert:', data, error)
}
test()
