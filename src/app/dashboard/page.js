'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import StatCard from '@/components/ui/StatCard';
import SentimentBadge from '@/components/ui/SentimentBadge';
import { motion } from 'framer-motion';
import { meetingsAPI, analyticsAPI, mediaAPI } from '@/services/api';
import useStore from '@/store/useStore';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, initAuth, authLoading } = useStore();
  const [stats, setStats] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      // Auto-login with admin account for demo
      (async () => {
        try {
          await useStore.getState().login('admin@zoomlens.ai', 'admin123');
        } catch { }
        loadData();
      })();
    } else {
      loadData();
    }
  }, [authLoading, isAuthenticated]);

  async function loadData() {
    try {
      const [dashStats, meetingsData] = await Promise.all([
        analyticsAPI.getDashboard(),
        meetingsAPI.list(),
      ]);
      setStats(dashStats);
      setMeetings(Array.isArray(meetingsData) ? meetingsData : meetingsData || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const statCards = stats ? [
    { label: 'Total Meetings', value: stats.totalMeetings, trend: stats.trends?.meetings?.value, trendUp: stats.trends?.meetings?.direction === 'up', icon: '📹' },
    { label: 'Hours Analyzed', value: stats.hoursAnalyzed, trend: stats.trends?.hours?.value, trendUp: stats.trends?.hours?.direction === 'up', icon: '⏱️' },
    { label: 'Action Items', value: stats.actionItems?.toLocaleString(), trend: stats.trends?.actionItems?.value, trendUp: stats.trends?.actionItems?.direction === 'up', icon: '✅' },
    { label: 'Avg Engagement', value: `${stats.avgEngagement}%`, trend: stats.trends?.engagement?.value, trendUp: stats.trends?.engagement?.direction === 'up', icon: '⚡' },
  ] : [];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" subtitle="Your meeting intelligence overview">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.1} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Activity */}
        <GlassCard className="lg:col-span-2" delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Weekly Activity</h3>
            <select className="glass-input text-sm px-3 py-1.5 text-text-secondary">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-40">
            {(stats?.weeklyActivity || []).map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.meetings / 15) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                  className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-md min-h-[4px]"
                />
                <span className="text-xs text-text-muted">{day.day}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard delay={0.4}>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { icon: '📤', label: 'Upload Recording', color: 'from-primary/10 to-primary/5', action: 'upload' },
              { icon: '🔴', label: 'Start Live Analysis', color: 'from-rose/10 to-rose/5', action: 'live' },
              { icon: '📊', label: 'Generate Report', color: 'from-accent/10 to-accent/5', action: 'report' },
              { icon: '🔗', label: 'Connect Zoom', color: 'from-success/10 to-success/5', action: 'connect' },
            ].map(({ icon, label, color, action }) => (
              <button 
                key={label}
                onClick={async () => {
                  if (action === 'upload') {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'video/*,audio/*';
                    input.onchange = async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          alert(`Uploading ${file.name}...`);
                          // import { mediaAPI } from '@/services/api'; is already at top
                          // Wait, mediaAPI is imported at the top. Let's assume it works.
                          await mediaAPI.upload(file, 'new_meeting');
                          alert('Upload successful!');
                          loadData(); // refresh meetings
                        } catch (err) {
                          alert('Upload failed: ' + err.message);
                        }
                      }
                    };
                    input.click();
                  } else if (action === 'live') {
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                      alert('Camera and microphone access granted for live analysis.');
                      // Stream can be processed or passed to a video element here
                    } catch (err) {
                      alert('Permission denied for camera/microphone: ' + err.message);
                    }
                  } else {
                    alert(`${label} action clicked!`);
                  }
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${color} hover:brightness-125 transition-all text-left mt-2`}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium text-text-primary">{label}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Meetings */}
      <GlassCard delay={0.5}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-text-primary">Recent Meetings</h3>
          <button className="text-sm text-primary-light hover:underline">View All →</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Meeting', 'Date', 'Duration', 'Participants', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-text-muted uppercase tracking-wider pb-3 px-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {meetings.map((meeting, i) => (
                <motion.tr
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="hover:bg-white/3 cursor-pointer transition-colors"
                  onClick={() => router.push(`/meeting/${meeting.id}`)}
                >
                  <td className="py-3 px-2">
                    <p className="text-sm font-medium text-text-primary">{meeting.title}</p>
                  </td>
                  <td className="py-3 px-2 text-sm text-text-muted">
                    {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-2 text-sm text-text-secondary">
                    {meeting.duration ? `${Math.floor(meeting.duration / 60)}m` : '—'}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex -space-x-2">
                      {(meeting.participants || []).slice(0, 3).map((p, j) => (
                        <div key={j} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 border-2 border-surface flex items-center justify-center text-[9px] text-white font-bold">
                          {typeof p === 'string' ? p.split(' ').map(n => n[0]).join('') : '?'}
                        </div>
                      ))}
                      {(meeting.participants || []).length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-surface-lighter border-2 border-surface flex items-center justify-center text-[9px] text-text-muted">
                          +{meeting.participants.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      meeting.status === 'analyzed' ? 'bg-success/15 text-success' :
                      meeting.status === 'processing' ? 'bg-warning/15 text-warning' :
                      'bg-text-muted/15 text-text-secondary'
                    }`}>
                      {meeting.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/meeting/${meeting.id}`); }}
                      className="text-xs text-primary-light hover:underline"
                    >
                      View →
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
