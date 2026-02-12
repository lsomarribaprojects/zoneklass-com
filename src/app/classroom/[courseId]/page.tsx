'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { MOCK_COURSES } from '@/lib/mockData';

export default function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = MOCK_COURSES.find(c => c.id === courseId);

  // State to track expanded modules (default all expanded for now)
  const [expandedModules, setExpandedModules] = useState<string[]>(course?.modules.map(m => m.id) || []);

  if (!course) {
    return <div>Course not found</div>;
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/classroom" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Classroom
        </Link>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{course.title}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{course.description}</p>
        
        <div style={{ marginTop: '2rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
            <span>Course Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--primary-color)', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {course.modules.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No modules available yet.
          </div>
        ) : (
          course.modules.map(module => (
            <div key={module.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div 
                onClick={() => toggleModule(module.id)}
                style={{ 
                  padding: '1.25rem 1.5rem', 
                  background: 'var(--bg-card)', 
                  borderBottom: '1px solid var(--border-color)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                <span>{module.title}</span>
                <span style={{ transform: expandedModules.includes(module.id) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </div>
              
              {expandedModules.includes(module.id) && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {module.lessons.map(lesson => (
                    <Link 
                      href={`/classroom/${course.id}/lesson/${lesson.id}`} 
                      key={lesson.id}
                      style={{ 
                        padding: '1rem 1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        borderBottom: '1px solid var(--border-color)', 
                        background: lesson.completed ? '#f9fafb' : 'white',
                        transition: 'background 0.2s',
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                      className="lesson-item" /* Specific hover style could be added globally or via module */
                    >
                      <div style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        border: '2px solid ' + (lesson.completed ? 'var(--primary-color)' : '#d1d5db'), 
                        background: lesson.completed ? 'var(--primary-color)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        {lesson.completed && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: lesson.completed ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: lesson.completed ? 'none' : 'none' }}>{lesson.title}</div>
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {lesson.duration}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
