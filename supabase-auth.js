/**
 * RadCall Pro — Supabase Auth Module
 * Loaded by all Pro pages. Provides auth modal UI, session management,
 * and Supabase client access via window.RadCallAuth.
 *
 * IMPORTANT: Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project values.
 */

(function() {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────
  const SUPABASE_URL  = 'https://ovinsgofjbgzdrklwjok.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aW5zZ29mamJnemRya2x3am9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDg1NjQsImV4cCI6MjA5MDM4NDU2NH0.FF3ICHTFXWwOscklU-w7mhPDP34B2SXXaGzC9k3PYI4';

  // If not configured, skip Supabase init
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || !SUPABASE_URL.startsWith('https://')) {
    window.RadCallAuth = {
      supabase: null,
      getUser: () => null,
      requireAuth: () => Promise.resolve(null),
      onAuth: () => {},
      signOut: () => Promise.resolve(),
      _notConfigured: true
    };
    return;
  }

  // ── INIT ────────────────────────────────────────────────
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let _user = null;
  let _onAuthCallbacks = [];

  // ── AUTH STATE ──────────────────────────────────────────
  supabase.auth.getSession().then(({ data: { session } }) => {
    _user = session?.user || null;
    _fireCallbacks();
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    _user = session?.user || null;
    _fireCallbacks();
  });

  function _fireCallbacks() {
    _onAuthCallbacks.forEach(cb => cb(_user));
  }

  // ── AUTH FUNCTIONS ─────────────────────────────────────
  async function signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || '' } }
    });
    if (error) throw error;
    // Update profile with display name
    if (data.user && displayName) {
      await supabase.from('user_profiles').update({ display_name: displayName }).eq('id', data.user.id);
    }
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    _user = null;
  }

  async function getProfile() {
    if (!_user) return null;
    const { data } = await supabase.from('user_profiles').select('*').eq('id', _user.id).single();
    return data;
  }

  async function updateProfile(updates) {
    if (!_user) return;
    await supabase.from('user_profiles').update(updates).eq('id', _user.id);
  }

  // ── IMPORT LEGACY CASES ────────────────────────────────
  async function importLegacyCases(onProgress) {
    if (!_user) return;
    const profile = await getProfile();
    if (profile?.import_complete) return;

    let cases;
    try {
      const res = await fetch('legacy-cases.json');
      cases = await res.json();
    } catch (e) {
      console.warn('No legacy-cases.json found, skipping import');
      return;
    }

    if (!cases || !cases.length) return;

    // Map to DB schema
    const mapped = cases.map(c => ({
      user_id: _user.id,
      date: c['Date'] || null,
      hospital: c['Hospital'] || '',
      accession: c['Accession'] || '',
      procedure_type: c['Procedure Type'] || '',
      acgme_category: c['ACGME Procedure Category'] || '',
      procedure_name: c['Procedure'] || '',
      technique: c['Technique'] || '',
      attending: c['Attending'] || '',
      implants: c['Implant(s)'] || '',
      case_time_min: parseFloat(c['Case Time (min)']) || null,
      fluoro_time_min: parseFloat(c['Fluoro Time (min)']) || null,
      radiation_dose_mgy: parseFloat(c['Radiation Dose (mGy)']) || null,
      contrast_volume_ml: parseFloat(c['Contrast Volume (mL)']) || null,
      anesthetic_dose: c['Anesthetic Dose'] || '',
      complication_narrative: c['Complication Narrative'] || '',
      sir_grade: c['SIR Grade'] || '',
      notes: c['Notes'] || '',
      cpt_codes: [],
      is_imported: true
    }));

    // Batch insert in chunks of 100
    const CHUNK = 100;
    for (let i = 0; i < mapped.length; i += CHUNK) {
      const chunk = mapped.slice(i, i + CHUNK);
      const { error } = await supabase.from('cases').insert(chunk);
      if (error) { console.error('Import error:', error); return; }
      if (onProgress) onProgress(Math.min(i + CHUNK, mapped.length), mapped.length);
    }

    await updateProfile({ import_complete: true });
  }

  // ── AUTH MODAL UI ──────────────────────────────────────
  function injectAuthModal() {
    if (document.getElementById('rc-auth-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'rc-auth-overlay';
    overlay.innerHTML = `
      <div class="rc-auth-card">
        <div class="rc-auth-logo">
          <div class="rc-auth-icon">RC</div>
          <div>
            <div class="rc-auth-title">RadCall Pro</div>
            <div class="rc-auth-sub">Sign in to continue</div>
          </div>
        </div>
        <div class="rc-auth-tabs">
          <button class="rc-auth-tab active" data-tab="signin">Sign In</button>
          <button class="rc-auth-tab" data-tab="signup">Sign Up</button>
        </div>
        <div class="rc-auth-error" id="rcAuthError"></div>
        <form id="rcAuthForm" class="rc-auth-form">
          <div id="rcNameField" style="display:none">
            <label>Display Name</label>
            <input type="text" id="rcName" placeholder="Dr. Smith" autocomplete="name">
          </div>
          <div>
            <label>Email</label>
            <input type="email" id="rcEmail" placeholder="you@institution.edu" required autocomplete="email">
          </div>
          <div>
            <label>Password</label>
            <input type="password" id="rcPassword" placeholder="Password" required autocomplete="current-password" minlength="6">
          </div>
          <button type="submit" class="rc-auth-btn" id="rcAuthBtn">Sign In</button>
        </form>
        <div class="rc-auth-footer">
          <a href="index.html" class="rc-auth-back">&larr; Back to RadCall</a>
        </div>
      </div>
      <div class="rc-import-overlay" id="rcImportOverlay" style="display:none">
        <div class="rc-import-card">
          <div class="rc-import-spinner"></div>
          <div class="rc-import-text">Importing your cases...</div>
          <div class="rc-import-progress" id="rcImportProgress">0 / 0</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      #rc-auth-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
      }
      .rc-auth-card {
        background: #111620; border: 1px solid #1e2737; border-radius: 16px;
        padding: 36px 32px 28px; width: 380px; max-width: 90vw;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      }
      .rc-auth-logo {
        display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
      }
      .rc-auth-icon {
        width: 40px; height: 40px; background: #14b8a6; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 700; color: white;
      }
      .rc-auth-title { font-size: 18px; font-weight: 600; color: #e2e8f0; }
      .rc-auth-sub { font-size: 12px; color: #64748b; }
      .rc-auth-tabs {
        display: flex; gap: 4px; margin-bottom: 20px;
        background: #0b0f14; border-radius: 8px; padding: 3px;
      }
      .rc-auth-tab {
        flex: 1; padding: 8px; border: none; border-radius: 6px;
        background: transparent; color: #64748b; font-family: inherit;
        font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
      }
      .rc-auth-tab.active { background: #1e2737; color: #14b8a6; }
      .rc-auth-form label {
        display: block; font-size: 12px; font-weight: 500;
        color: #94a3b8; margin-bottom: 5px; margin-top: 14px;
      }
      .rc-auth-form input {
        width: 100%; padding: 10px 12px; background: #0b0f14;
        border: 1.5px solid #2a3444; border-radius: 8px; color: #e2e8f0;
        font-family: inherit; font-size: 14px; outline: none; transition: border-color 0.2s;
      }
      .rc-auth-form input:focus { border-color: #14b8a6; }
      .rc-auth-form input::placeholder { color: #4a5568; }
      .rc-auth-btn {
        width: 100%; margin-top: 20px; padding: 11px; border: none;
        border-radius: 8px; background: #14b8a6; color: white;
        font-family: inherit; font-size: 14px; font-weight: 600;
        cursor: pointer; transition: background 0.15s;
      }
      .rc-auth-btn:hover { background: #0d9488; }
      .rc-auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .rc-auth-error {
        display: none; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
        border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #ef4444;
        margin-bottom: 8px;
      }
      .rc-auth-error.show { display: block; }
      .rc-auth-footer { text-align: center; margin-top: 20px; }
      .rc-auth-back { color: #64748b; font-size: 13px; text-decoration: none; }
      .rc-auth-back:hover { color: #94a3b8; }
      .rc-import-overlay {
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(0,0,0,0.9); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
      }
      .rc-import-card { text-align: center; }
      .rc-import-spinner {
        width: 40px; height: 40px; border: 3px solid #1e2737;
        border-top-color: #14b8a6; border-radius: 50%;
        animation: rcSpin 0.8s linear infinite; margin: 0 auto 16px;
      }
      @keyframes rcSpin { to { transform: rotate(360deg); } }
      .rc-import-text { color: #e2e8f0; font-size: 16px; font-weight: 500; margin-bottom: 8px; }
      .rc-import-progress { color: #64748b; font-size: 14px; }
    `;
    document.head.appendChild(style);

    // Tab switching
    let mode = 'signin';
    overlay.querySelectorAll('.rc-auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        mode = tab.dataset.tab;
        overlay.querySelectorAll('.rc-auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('rcNameField').style.display = mode === 'signup' ? 'block' : 'none';
        document.getElementById('rcAuthBtn').textContent = mode === 'signup' ? 'Create Account' : 'Sign In';
        document.getElementById('rcPassword').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
        document.getElementById('rcAuthError').classList.remove('show');
      });
    });

    // Form submit
    document.getElementById('rcAuthForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('rcAuthBtn');
      const errEl = document.getElementById('rcAuthError');
      const email = document.getElementById('rcEmail').value.trim();
      const password = document.getElementById('rcPassword').value;
      const name = document.getElementById('rcName').value.trim();

      btn.disabled = true;
      errEl.classList.remove('show');

      try {
        if (mode === 'signup') {
          await signUp(email, password, name);
        } else {
          await signIn(email, password);
        }
        // Auth state change callback will handle the rest
      } catch (err) {
        errEl.textContent = err.message || 'Authentication failed';
        errEl.classList.add('show');
        btn.disabled = false;
      }
    });
  }

  function showAuthModal() {
    injectAuthModal();
    document.getElementById('rc-auth-overlay').style.display = 'flex';
  }

  function hideAuthModal() {
    const el = document.getElementById('rc-auth-overlay');
    if (el) el.style.display = 'none';
  }

  function showImportOverlay() {
    const el = document.getElementById('rcImportOverlay');
    if (el) el.style.display = 'flex';
  }

  function hideImportOverlay() {
    const el = document.getElementById('rcImportOverlay');
    if (el) el.style.display = 'none';
  }

  // ── USER NAV ───────────────────────────────────────────
  function injectUserNav() {
    const existing = document.getElementById('rc-user-nav');
    if (existing) existing.remove();

    if (!_user) return;

    const container = document.querySelector('.nav-stats') || document.querySelector('.nav-search');
    if (!container) return;

    const nav = document.createElement('div');
    nav.id = 'rc-user-nav';
    nav.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:12px;flex-shrink:0;';
    nav.innerHTML = `
      <span style="font-size:12px;color:#94a3b8;">${_user.email}</span>
      <button id="rcLogoutBtn" style="
        padding:5px 12px;border-radius:6px;border:1px solid #2a3444;
        background:transparent;color:#94a3b8;font-size:12px;font-family:inherit;
        cursor:pointer;transition:all 0.15s;
      ">Logout</button>
    `;
    container.parentNode.insertBefore(nav, container.nextSibling);

    document.getElementById('rcLogoutBtn').addEventListener('click', async () => {
      await signOut();
      window.location.reload();
    });
  }

  // ── REQUIRE AUTH ───────────────────────────────────────
  /**
   * Call this on page load. Returns a promise that resolves with the user
   * once authenticated. Shows auth modal if not logged in.
   * Also handles first-login import.
   */
  function requireAuth() {
    return new Promise((resolve) => {
      if (_user) {
        hideAuthModal();
        injectUserNav();
        _handleImport().then(() => resolve(_user));
        return;
      }

      showAuthModal();

      onAuth(async (user) => {
        if (user) {
          hideAuthModal();
          injectUserNav();
          await _handleImport();
          resolve(user);
        }
      });
    });
  }

  async function _handleImport() {
    const profile = await getProfile();
    if (profile && !profile.import_complete) {
      showImportOverlay();
      await importLegacyCases((done, total) => {
        const el = document.getElementById('rcImportProgress');
        if (el) el.textContent = `${done} / ${total} cases`;
      });
      hideImportOverlay();
    }
  }

  function onAuth(callback) {
    _onAuthCallbacks.push(callback);
  }

  // ── PUBLIC API ─────────────────────────────────────────
  window.RadCallAuth = {
    supabase,
    getUser:      () => _user,
    signUp,
    signIn,
    signOut,
    getProfile,
    updateProfile,
    importLegacyCases,
    requireAuth,
    onAuth,
    showAuthModal,
    hideAuthModal
  };

})();
