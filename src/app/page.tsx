import React from 'react';

export default function Home() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Community</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to the ZoneKlass community feed.</p>
        </div>
        <button className="btn-primary">
          Write Post
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
        {/* Main Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Pinned Post */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd' }}></div>
              <div>
                <div style={{ fontWeight: 600 }}>Admin</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pinned • 2 days ago</div>
              </div>
            </div>
            <h3>Welcome strictly to ZoneKlass!</h3>
            <p>Here are the community guidelines and how to get started. Make sure to complete your profile and introduce yourself in the comments below.</p>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>👍 42 Likes</span>
              <span>💬 12 Comments</span>
            </div>
          </div>

          {/* Regular Posts */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `hsl(${i * 60}, 70%, 80%)` }}></div>
                <div>
                  <div style={{ fontWeight: 600 }}>Member {i}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{i} hours ago in General</div>
                </div>
              </div>
              <h3>Does anyone know how to integrate payment gateways?</h3>
              <p>I've been trying to set up Stripe but getting some errors with the webhook configuration. Any tips?</p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>👍 {i * 3} Likes</span>
                <span>💬 {i} Comments</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3>Upcoming Events</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-body)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center', minWidth: '50px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)' }}>FEB</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>15</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Weekly Q&A Session</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live with Instructors</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Leaderboard</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{i}</div>
                    <div style={{ fontSize: '0.9rem' }}>User {i}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)' }}>{1000 - (i * 50)} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
