'use client';

import { motion } from 'framer-motion';
import useStore from '@/store/useStore';
import { mediaAPI } from '@/services/api';

export default function Topbar({ title, subtitle }) {
  const { currentUser, searchQuery, setSearchQuery, sidebarOpen } = useStore();
  const user = currentUser || { name: 'User' };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-nav sticky top-0 z-40 px-6 py-3 flex items-center justify-between"
    >
      <div>
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search meetings, transcripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-64 pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted bg-surface-lighter/50 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose rounded-full animate-pulse" />
        </button>

        {/* Upload */}
        <button 
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*,audio/*';
            input.onchange = async (e) => {
              const file = e.target.files[0];
              if (file) {
                try {
                  alert(`Uploading ${file.name}...`);
                  await mediaAPI.upload(file, 'new_meeting');
                  alert('Upload successful!');
                  // Optionally trigger a re-fetch of some global data here
                } catch (err) {
                  alert('Upload failed: ' + err.message);
                }
              }
            };
            input.click();
          }}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 pl-4 border-l border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-rose flex items-center justify-center text-white text-xs font-bold">
            {(user.name || 'U').split(' ').map((n) => n[0]).join('')}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
