export default function Classroom() {
  return (
    <div>
      <h1>Classroom</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Access your courses and learning materials.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '160px', background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 50%), hsl(${i * 60 + 30}, 70%, 40%))` }}></div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>MODULE {i}</div>
              <h3>Mastering Web Development - Part {i}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Learn the fundamentals of building modern web applications.</p>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '70%', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.random() * 100}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{Math.floor(Math.random() * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
