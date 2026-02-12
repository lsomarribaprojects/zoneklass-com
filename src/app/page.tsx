'use client'; // Client Component for interactivity

import React, { useState } from 'react';
import { MOCK_POSTS } from '@/lib/mockData';
import styles from './styles.module.css'; // Create this CSS module for local styles

export default function Home() {
  const [activeTab, setActiveTab] = useState('Newest');

  return (
    <div>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.communityImage}>
            {/* Placeholder for community cover/logo */}
            <div className={styles.communityLogo}>Z</div>
          </div>
          <div className={styles.communityInfo}>
            <h1>ZoneKlass Community</h1>
            <p>Welcome to the official ZoneKlass community! Connect, learn, and grow together.</p>
            <div className={styles.stats}>
              <span>Members: 2.5k</span> • <span>Online: 142</span>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
           <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             Write Post
           </button>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Main Feed */}
        <div className={styles.feedColumn}>
          
          {/* Create Post Input Widget */}
          <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s', padding: '1rem 1.5rem' }}>
            <div className={styles.userAvatar}>LS</div>
            <div style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Write something...
            </div>
          </div>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
             {['Newest', 'Popular', 'Unanswered', 'My Posts'].map(tab => (
               <button 
                 key={tab}
                 className={activeTab === tab ? styles.filterActive : styles.filter}
                 onClick={() => setActiveTab(tab)}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {MOCK_POSTS.map((post) => (
              <div key={post.id} className="card" style={post.isPinned ? { borderLeft: '4px solid var(--primary-color)' } : {}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className={styles.userAvatar} style={{ width: 40, height: 40, fontSize: '0.9rem' }}>
                    {post.author.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {post.author.name}
                      {post.author.role === 'admin' && <span className={styles.badge}>Admin</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {post.isPinned && <span style={{ marginRight: '0.5rem', fontWeight: 600 }}>📌 Pinned •</span>}
                      {post.createdAt} in <span style={{ color: 'var(--primary-color)', fontWeight: 500 }}>{post.category}</span>
                    </div>
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {post.content.length > 50 ? post.content.substring(0, 50) + "..." : post.content}
                </h3>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{post.content}</p>
                
                <div className={styles.postFooter}>
                  <div className={styles.postAction}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    <span>{post.likes} Likes</span>
                  </div>
                  <div className={styles.postAction}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <span>{post.comments} Comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Widget */}
        <div className={styles.sidebarColumn}>
          <div className="card">
            <h3>Leaderboard (This Week)</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>{i}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>User {String.fromCharCode(65 + i)}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)' }}>{1000 - (i * 50)} pts</div>
                </div>
              ))}
              <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                <a href="/leaderboard" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>View All</a>
              </div>
            </div>
          </div>
          
           <div className="card">
            <h3>Upcoming Events</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-body)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center', minWidth: '50px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>FEB</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>15</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Weekly Q&A</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live w/ Instructors</div>
                </div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>See Calendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
