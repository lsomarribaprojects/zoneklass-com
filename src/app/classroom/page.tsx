'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_COURSES } from '@/lib/mockData';

export default function Classroom() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Classroom</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Access your courses and learning materials.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {MOCK_COURSES.map((course) => (
          <Link href={`/classroom/${course.id}`} key={course.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', height: '100%' }}>
            {/* Image placeholder with gradient if no image */}
            <div style={{ height: '180px', background: course.imageUrl ? `url(${course.imageUrl}) center/cover` : 'var(--primary-color)', position: 'relative' }}>
               {/* Overlay for better text readability if needed */}
               <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}></div>
            </div>
            
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {course.modules.length} Modules
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{course.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>
                {course.description}
              </p>
              
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{course.progress}% COMPLETED</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Placeholder for "Coming Soon" courses */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: 0.7 }}>
           <div style={{ height: '180px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontWeight: 600 }}>COMING SOON</div>
           <div style={{ padding: '1.5rem' }}>
              <h3>Advanced Analytics</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Deep dive into tracking your community growth.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
