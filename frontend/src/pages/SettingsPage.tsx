import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { fakeUsers, fakeNotifications } from '@/lib/fakeData'

const tabs = ['General', 'Notifications', 'Security', 'Appearance', 'Billing', 'API & Integrations']

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General')
  const user = fakeUsers[0]

  return (
    <AppLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="page-header-wrap">
        <div><h1>Settings</h1></div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Side tabs */}
        <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '0.55rem 0.8rem', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: activeTab === t ? 'var(--primary-bg)' : 'transparent', color: activeTab === t ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '0.85rem', fontWeight: activeTab === t ? 600 : 400,
            }} onMouseEnter={(e) => activeTab !== t && (e.currentTarget.style.background = 'var(--bg-elevated)')}
              onMouseLeave={(e) => activeTab !== t && (e.currentTarget.style.background = 'transparent')}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'General' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Profile</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{user.avatar}</div>
                <div><button className="button button-sm">Change Photo</button></div>
              </div>
              {[
                { label: 'Full Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone },
                { label: 'Department', value: user.department },
                { label: 'Role', value: user.role },
              ].map((f) => (
                <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{f.label}</label>
                  <input style={{ padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} defaultValue={f.value} />
                </div>
              ))}
              <div><button className="button">Save Changes</button></div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <h3>Notification Preferences</h3>
              {[
                { label: 'Email notifications', desc: 'Receive updates via email', enabled: true },
                { label: 'Push notifications', desc: 'Browser push alerts', enabled: true },
                { label: 'Task reminders', desc: 'Daily task deadline reminders', enabled: true },
                { label: 'Mention alerts', desc: 'When someone mentions you', enabled: true },
                { label: 'Weekly digest', desc: 'Weekly summary of activity', enabled: false },
              ].map((n) => (
                <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div><div style={{ fontSize: '0.85rem' }}>{n.label}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{n.desc}</div></div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={n.enabled} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Recent Notifications</h3>
                {fakeNotifications.slice(0, 5).map((n) => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', opacity: n.read ? 0.6 : 1 }}>
                    <div className="today-check" style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid', borderColor: n.read ? 'var(--border)' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {n.read && <span style={{ fontSize: '0.5rem', color: 'var(--text-tertiary)' }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '0.82rem', flex: 1 }}>{n.text}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Security Settings</h3>
              {[
                { label: 'Current Password', value: '••••••••', type: 'password' },
                { label: 'New Password', value: '', type: 'password' },
                { label: 'Confirm Password', value: '', type: 'password' },
              ].map((f) => (
                <div key={f.label}><label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{f.label}</label>
                  <input style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem', marginTop: '0.2rem' }} type="password" defaultValue={f.value} placeholder={f.label} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="button">Update Password</button>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Last changed 30 days ago</div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <h3>Two-Factor Authentication</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add an extra layer of security to your account.</div>
              <button className="button button-secondary">Enable 2FA</button>
              <h3>Sessions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)' }}>
                  <span style={{ fontSize: '0.82rem' }}>Windows Chrome · Current</span><span style={{ color: 'var(--green)', fontSize: '0.75rem' }}>Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)' }}>
                  <span style={{ fontSize: '0.82rem' }}>Android App</span><span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>2 days ago</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Appearance</h3>
              {[
                { label: 'Theme', options: ['Dark', 'Light', 'System'], current: 'Dark' },
                { label: 'Language', options: ['English', 'Arabic'], current: 'English' },
                { label: 'Font Size', options: ['Small', 'Medium', 'Large'], current: 'Medium' },
                { label: 'Compact Mode', options: ['On', 'Off'], current: 'Off' },
              ].map((s) => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.85rem' }}>{s.label}</span>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {s.options.map((o) => (
                      <button key={o} className={`button ${o === s.current ? '' : 'button-secondary'} button-xs`} style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}>{o}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="button">Apply Appearance</button>
            </div>
          )}

          {activeTab === 'Billing' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h3>Plan & Billing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                {[
                  { name: 'Free', price: '$0', features: ['3 Projects', '5 Members', 'Basic support'] },
                  { name: 'Pro', price: '$19', features: ['Unlimited projects', '50 Members', 'Priority support', 'Analytics'], current: true },
                  { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'Unlimited members', 'Dedicated support', 'Custom integrations'] },
                ].map((p) => (
                  <div key={p.name} style={{ padding: '1rem', borderRadius: 'var(--radius)', background: p.current ? 'var(--primary-bg)' : 'var(--bg-elevated)', border: p.current ? '1px solid var(--primary)' : '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>{p.name}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.price}<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>/mo</span></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.6rem' }}>
                      {p.features.map((f) => <div key={f} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>✓ {f}</div>)}
                    </div>
                    <button className={`button ${p.current ? '' : 'button-secondary'} button-sm`} style={{ width: '100%' }}>{p.current ? 'Current' : 'Upgrade'}</button>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '0.5rem 0' }}>Next billing: May 15, 2026 · Free trial ends in 12 days</div>
            </div>
          )}

          {activeTab === 'API & Integrations' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h3>API Tokens</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input style={{ flex: 1, padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem', fontFamily: 'monospace' }} placeholder="tf_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" readOnly value="tf_sk_••••••••••••••••••" />
                <button className="button button-sm">Copy</button>
                <button className="button button-secondary button-sm">Regenerate</button>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Created 15 days ago · 2,340 requests</div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <h3>Integrations</h3>
              {[
                { name: 'GitHub', desc: 'Sync tasks with GitHub issues', connected: true },
                { name: 'Slack', desc: 'Receive notifications in Slack', connected: false },
                { name: 'Jira', desc: 'Two-way sync with Jira', connected: false },
                { name: 'Figma', desc: 'Preview Figma designs in tasks', connected: true },
                { name: 'Zapier', desc: 'Connect with 3000+ apps', connected: false },
              ].map((i) => (
                <div key={i.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div><div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{i.name}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{i.desc}</div></div>
                  <button className={`button ${i.connected ? '' : 'button-secondary'} button-sm`}>{i.connected ? 'Connected' : 'Connect'}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
    </AppLayout>
  )
}
