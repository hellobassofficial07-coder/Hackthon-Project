// Centralized Supabase Client & Authentication Helper
const SUPABASE_URL = "https://bqyzpmzzdqaiixpesgsq.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_ANON_PUBLIC_KEY_HERE"; // Ensure your anon key is pasted here

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Helper to retrieve active user and check role
async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', session.user.email)
    .single();

  return profile || session.user;
}

// Global Logout function
async function handleLogout() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  window.location.href = "/index.html";
}

// Route users to their specific entity portal
function routeUserToPortal(role) {
  switch (role) {
    case 'student':
      window.location.href = "/student/index.html";
      break;
    case 'company':
      window.location.href = "/company/index.html";
      break;
    case 'faculty':
      window.location.href = "/faculty/index.html";
      break;
    case 'institution':
      window.location.href = "/institution/index.html";
      break;
    default:
      window.location.href = "/student/index.html";
  }
}