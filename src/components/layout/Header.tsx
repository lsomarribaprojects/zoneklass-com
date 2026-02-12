'use client';

import React from 'react';
import styles from './Header.module.css';

// Simple Icons again
const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  MessageSquare: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  ChevronDown: () => <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
};

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <Icons.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search community, courses, or members..." 
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.actions}>
        <button title="Messages" className={styles.actionBtn}>
          <Icons.MessageSquare />
        </button>
        <button title="Notifications" className={styles.actionBtn}>
          <Icons.Bell />
        </button>
        
        <div className={styles.profile}>
          <div className={styles.avatar}>LS</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Luis Somarriba</span>
            <span className={styles.userLevel}>Level 1</span>
          </div>
          <Icons.ChevronDown />
        </div>
      </div>
    </header>
  );
}
