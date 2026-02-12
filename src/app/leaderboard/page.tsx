export default function Leaderboard() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1>Leaderboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Top contributors this week.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '4px' }}>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Week</button>
          <button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Month</button>
          <button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>All Time</button>
        </div>
      </div>
      
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px', padding: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
          <div>Rank</div>
          <div>User</div>
          <div>Points</div>
          <div>Level</div>
        </div>
        
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px', padding: '1rem', borderBottom: i < 10 ? '1px solid var(--border-color)' : 'none', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: i <= 3 ? 'var(--primary-color)' : 'var(--text-secondary)' }}>#{i}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `hsl(${200 - (i * 10)}, 70%, 80%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String.fromCharCode(65 + i)}</div>
              <span style={{ fontWeight: 600 }}>User {String.fromCharCode(65 + i)}</span>
            </div>
            <div style={{ fontWeight: 600 }}>{10000 - (i * 250)} pts</div>
            <div style={{ color: 'var(--text-secondary)' }}>Level {20 - i}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
