export default function About() {
  return (
    <div>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>About ZoneKlass</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.8' }}>
          ZoneKlass is a community-driven platform designed to help you master new skills, connect with like-minded individuals, and achieve your goals. 
          Similar to popular platforms like Skool, we focus on simplicity, engagement, and gamification to make learning fun and effective.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>50+</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Courses</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>2.5k</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Members</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>100%</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Engagement</div>
          </div>
        </div>
      </div>
    </div>
  );
}
