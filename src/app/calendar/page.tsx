export default function Calendar() {
  return (
    <div>
      <h1>Calendar</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Upcoming events and live sessions.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem' }}>
            <div style={{ background: 'var(--bg-body)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', minWidth: '80px', flexShrink: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', textTransform: 'uppercase' }}>{i + 13} FEB</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{i + (i * 2)}</div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3>Community Live Call - Q&A Session {i}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Join us for a live discussion on advanced topics.</p>
                </div>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Join Zoom</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>10:00 AM - 11:30 AM EST</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                   <span>User {i * 12} attended</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
