// Centralized Supabase Client & Auth Helper
const SUPABASE_URL = "https://bqyzpmzzdqaiixpesgsq.supabase.co";
const SUPABASE_KEY = "sb_publishable_1jzWfwvAcgy4m0Bu3gsr4Q_zlIbGR53";

// Store on a distinct global property so it never clashes with the CDN object
if (window.supabase && typeof window.supabase.createClient === "function") {
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.error("Supabase CDN failed to load before supabase-client.js");
}

// Helper to retrieve active user
async function getCurrentUser() {
  if (!window.sb) return null;

  try {
    const sessionRes = await window.sb.auth.getSession();
    const session = sessionRes.data ? sessionRes.data.session : null;
    if (!session || !session.user) return null;

    const profileRes = await window.sb
      .from("profiles")
      .select("*")
      .eq("email", session.user.email)
      .maybeSingle();

    return profileRes.data || session.user;
  } catch (err) {
    console.error("Session check failed:", err);
    return null;
  }
}

// Global Logout function
async function handleLogout() {
  if (window.sb && window.sb.auth) {
    await window.sb.auth.signOut();
  }
  window.location.href = "/index.html";
}

// Route users to their specific entity portal
function routeUserToPortal(role) {
  switch (role) {
    case "student":
      window.location.href = "student/index.html";
      break;
    case "company":
      window.location.href = "company/index.html";
      break;
    case "faculty":
      window.location.href = "faculty/index.html";
      break;
    case "institution":
      window.location.href = "institution/index.html";
      break;
    default:
      window.location.href = "student/index.html";
  }
}