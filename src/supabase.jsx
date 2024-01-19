import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
// const supabaseUrl = "https://yhzaldtwlzwcwhlegllc.supabase.co";
// const supabaseKey =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloemFsZHR3bHp3Y3dobGVnbGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQzMzM2NjEsImV4cCI6MjAxOTkwOTY2MX0.g8SyCSlaaUg-h78__XZlDZvl-yKbgs1LHWDcUvNGv7Q";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
