export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Manage your account and preferences.</p>
      
      <div className="card" style={{ maxWidth: '600px', marginTop: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Display Name</label>
          <input type="text" value="Luis Somarriba" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
          <input type="email" value="luis@example.com" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Theme</label>
          <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
            <option>System Default</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
