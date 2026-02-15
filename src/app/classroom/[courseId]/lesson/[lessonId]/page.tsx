'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { MOCK_COURSES } from '@/lib/mockData';

export default function LessonDetail() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const course = MOCK_COURSES.find(c => c.id === courseId);
  
  // Find the lesson and its module
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any = null;
  let moduleIndex = -1;
  let lessonIndex = -1;
  
  if (course) {
    course.modules.forEach((mod, mIdx) => {
      const lIdx = mod.lessons.findIndex(l => l.id === lessonId);
      if (lIdx !== -1) {
        lesson = mod.lessons[lIdx];
        moduleIndex = mIdx;
        lessonIndex = lIdx;
      }
    });
  }

  if (!lesson || !course) {
    return <div>Lesson not found</div>;
  }
  
  // Calculate Previous and Next Lesson
  const prevLesson = lessonIndex > 0 
    ? course.modules[moduleIndex].lessons[lessonIndex - 1] 
    : (moduleIndex > 0 ? course.modules[moduleIndex - 1].lessons[course.modules[moduleIndex - 1].lessons.length - 1] : null);
    
  const nextLesson = lessonIndex < course.modules[moduleIndex].lessons.length - 1 
    ? course.modules[moduleIndex].lessons[lessonIndex + 1] 
    : (moduleIndex < course.modules.length - 1 ? course.modules[moduleIndex + 1].lessons[0] : null);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/classroom/${courseId}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Course
        </Link>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{lesson.title}</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Module: {course.modules[moduleIndex].title}</p>
      </div>
      
      {/* Video Player Placeholder */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem', aspectRatio: '16/9', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', gap: '1rem' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Video Placeholder</div>
        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{lesson.duration}</div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
        {prevLesson ? (
          <Link href={`/classroom/${courseId}/lesson/${prevLesson.id}`} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Previous
          </Link>
        ) : <div />}
        
        {nextLesson ? (
          <Link href={`/classroom/${courseId}/lesson/${nextLesson.id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '6px' }}>
            Next Lesson
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        ) : (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '6px' }}>
            Complete Course
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        )}
      </div>
      
      <div className="card" style={{ padding: '2rem' }}>
        <h3>Lesson Description</h3>
        <p style={{ marginTop: '1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          In this lesson, we will cover the core concepts of {lesson.title}. 
          Make sure to follow along with the exercises provided in the resources section below.
        </p>
        
        <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Resources</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
             <a href="#" style={{ textDecoration: 'underline' }}>Download Cheat Sheet PDF</a>
          </li>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
             <a href="#" style={{ textDecoration: 'underline' }}>Source Code (GitHub)</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
