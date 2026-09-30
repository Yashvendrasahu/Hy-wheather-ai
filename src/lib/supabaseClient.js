// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate if real Supabase credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey.length > 20
);

// Hash function helper for SHA-256 OTP security
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Development Demo Profiles (Seed Accounts)
export const DEMO_USERS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'citizen@weatherai.gov.in',
    aliases: ['citizen@weatherai.gov.in', 'user@weatherai.gov.in', 'satish@weatherai.gov.in'],
    password: 'User@12345',
    user_id: 'CITIZEN-01',
    full_name: 'Satish Sahu',
    role: 'user',
    status: 'active',
    designation: 'Citizen Observer',
    organization: 'Public Weather Network'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'a.sharma.synoptic@imd.gov.in',
    aliases: ['a.sharma.synoptic@imd.gov.in', 'meteorologist@weatherai.gov.in', 'met@weatherai.gov.in', 'imd.gov@weatherai.gov.in'],
    password: 'Synoptic@IMD2025',
    user_id: 'MET-IMD-01',
    full_name: 'Dr. Ananya Sharma',
    role: 'meteorologist',
    status: 'active',
    designation: 'Senior Forecaster · Synoptic Ops',
    organization: 'India Meteorological Department (IMD)'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'v.rathore@rajasthan.gov.in',
    aliases: ['v.rathore@rajasthan.gov.in', 'disaster@weatherai.gov.in', 'dma@weatherai.gov.in', 'eoc@weatherai.gov.in'],
    password: 'Disaster@EOC2025',
    user_id: 'DMA-EOC-01',
    full_name: 'Vikramaditya Rathore',
    role: 'disaster_manager',
    status: 'active',
    designation: 'State EOC Joint Director & SDRF Commander',
    organization: 'State Emergency Operations Centre (SEOC)'
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'r.verma@gov.nic.in',
    aliases: ['r.verma@gov.nic.in', 'admin.gov@weatherai.gov.in', 'admin@weatherai.gov.in', 'admin@gov.nic.in'],
    password: 'Admin@SEC2025',
    user_id: 'ADMIN-SEC-01',
    full_name: 'Rajesh K. Verma, IAS',
    role: 'administrator',
    status: 'active',
    designation: 'Principal Systems Director (Tier-1)',
    organization: 'National Meteorological Operations & Cyber-Security'
  }
];

// In-memory or localStorage simulator for seamless operation when live credentials are not yet configured
class MockSupabaseClient {
  constructor() {
    this.authListeners = [];
    this.storageKey = 'weatherai_mock_session';
  }

  get auth() {
    return {
      getSession: async () => {
        try {
          const raw = localStorage.getItem(this.storageKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            return { data: { session: parsed }, error: null };
          }
        } catch (_) {}
        return { data: { session: null }, error: null };
      },

      onAuthStateChange: (callback) => {
        this.authListeners.push(callback);
        // Trigger initial state
        this.auth.getSession().then(({ data }) => {
          callback(data.session ? 'SIGNED_IN' : 'INITIAL_SESSION', data.session);
        });
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                this.authListeners = this.authListeners.filter(l => l !== callback);
              }
            }
          }
        };
      },

      signInWithPassword: async ({ email, password }) => {
        const cleanIdentifier = (email || '').toLowerCase().trim();
        const cleanPassword = (password || '').trim();

        let found = DEMO_USERS.find(u => {
          const matchesEmail = u.email.toLowerCase() === cleanIdentifier;
          const matchesUserId = u.user_id.toLowerCase() === cleanIdentifier;
          const matchesAlias = u.aliases && u.aliases.some(a => a.toLowerCase() === cleanIdentifier);
          const isMatch = matchesEmail || matchesUserId || matchesAlias;
          
          if (!isMatch) return false;
          // Flexible password check for demo credentials
          return (
            u.password === cleanPassword ||
            cleanPassword === 'Admin@SEC2025' ||
            cleanPassword === 'Disaster@EOC2025' ||
            cleanPassword === 'Synoptic@IMD2025' ||
            cleanPassword === 'User@12345' ||
            cleanPassword === '123456' ||
            cleanPassword === 'admin' ||
            cleanPassword === 'password'
          );
        });

        if (!found) {
          try {
            const stored = JSON.parse(localStorage.getItem('weatherai_registered_users') || '[]');
            found = stored.find(
              u => (u.email.toLowerCase() === cleanIdentifier || u.user_id.toLowerCase() === cleanIdentifier) &&
                   u.password === cleanPassword
            );
          } catch (_) {}
        }

        if (!found) {
          return { data: { user: null, session: null }, error: { message: 'Invalid email / user ID or password.' } };
        }

        const session = {
          access_token: 'mock-jwt-token-' + Date.now(),
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: {
            id: found.id,
            email: found.email,
            user_metadata: {
              full_name: found.full_name,
              user_id: found.user_id,
              role: found.role
            }
          }
        };

        try {
          localStorage.setItem(this.storageKey, JSON.stringify(session));
        } catch (_) {}

        this.authListeners.forEach(cb => cb('SIGNED_IN', session));
        return { data: { user: session.user, session }, error: null };
      },

      signUp: async ({ email, password, options }) => {
        const metadata = options?.data || {};
        const newId = 'user-' + Date.now();
        const newUser = {
          id: newId,
          email: email,
          password: password,
          user_id: metadata.user_id || 'USER-' + Math.floor(1000 + Math.random() * 9000),
          full_name: metadata.full_name || email.split('@')[0],
          phone: metadata.phone || '',
          city: metadata.city || '',
          role: metadata.role || 'user',
          status: 'active',
          designation: metadata.designation || 'Citizen Observer',
          organization: metadata.organization || 'Public Weather Network',
          created_at: new Date().toISOString()
        };

        // Persist to custom users in localStorage
        try {
          const stored = JSON.parse(localStorage.getItem('weatherai_registered_users') || '[]');
          const exists = stored.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (exists) {
            return { data: { user: null, session: null }, error: { message: 'An account with this email address already exists.' } };
          }
          stored.push(newUser);
          localStorage.setItem('weatherai_registered_users', JSON.stringify(stored));
        } catch (_) {}

        const session = {
          access_token: 'mock-jwt-token-' + Date.now(),
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: {
            id: newUser.id,
            email: newUser.email,
            user_metadata: {
              full_name: newUser.full_name,
              user_id: newUser.user_id,
              role: newUser.role,
              phone: newUser.phone,
              city: newUser.city
            }
          }
        };

        try {
          localStorage.setItem(this.storageKey, JSON.stringify(session));
        } catch (_) {}

        this.authListeners.forEach(cb => cb('SIGNED_IN', session));
        return { data: { user: session.user, session }, error: null };
      },

      signOut: async () => {
        try {
          localStorage.removeItem(this.storageKey);
        } catch (_) {}
        this.authListeners.forEach(cb => cb('SIGNED_OUT', null));
        return { error: null };
      },

      resetPasswordForEmail: async (email) => {
        // Mock successful dispatch
        return { data: {}, error: null };
      }
    };
  }

  from(table) {
    return {
      select: (fields = '*') => ({
        eq: (col, val) => ({
          single: async () => {
            if (table === 'profiles') {
              let profile = DEMO_USERS.find(u => u[col] === val);
              if (!profile) {
                try {
                  const stored = JSON.parse(localStorage.getItem('weatherai_registered_users') || '[]');
                  profile = stored.find(u => u[col] === val);
                } catch (_) {}
              }
              if (profile) {
                const { password, ...clean } = profile;
                return { data: clean, error: null };
              }
              return { data: null, error: { message: 'Profile not found' } };
            }
            return { data: null, error: { message: 'Table not found' } };
          }
        })
      }),
      insert: async (data) => ({ data, error: null }),
      update: (data) => ({
        eq: (col, val) => ({
          data,
          error: null
        })
      })
    };
  }

  async rpc(funcName, params) {
    // Mock RPC calls if used
    return { data: { success: true }, error: null };
  }
}

// Export singleton Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : new MockSupabaseClient();

export default supabase;
