
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hlzmxhutxdisryxhzzuz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsem14aHV0eGRpc3J5eGh6enV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTcyNjIsImV4cCI6MjA2Mjg3MzI2Mn0.ZUCejH8zUVFpBW9MQK-JRsgwi2Wi2KlO3U_TmuU7Ea0'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase