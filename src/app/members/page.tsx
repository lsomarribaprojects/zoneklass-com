export default function Members() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Members</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Connect with other learners.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <input 
            type="text" 
            placeholder="Search members..." 
            style={{ border: 'none', background: 'transparent', outline: 'none', padding: '0.2rem', width: '200px' }}
          />
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: `hsl(${i * 45}, 70%, 80%)`, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
              {String.fromCharCode(65 + i)}
            </div>
            <h3>User {String.fromCharCode(65 + i)}name</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Web Developer • Level {i}</p>
            <button className="btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}
