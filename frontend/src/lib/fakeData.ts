export interface FakeUser {
  id: string; name: string; email: string; avatar: string; role: string; department: string; phone: string; joined: string; color: string; bio: string; tasksCompleted: number; rating: number; timezone: string
}
export interface FakeProject {
  id: string; name: string; description: string; status: string; priority: string; owner: string; members: number; progress: number; deadline: string; tasks: number; completed: number; image: string; color: string; budget: string; tech: string[]; lastActivity: string
}
export interface FakeActivity {
  id: string; user: string; userAvatar: string; userColor: string; action: string; target: string; time: string; type: string; color: string; details?: string
}
export interface FakeMessage {
  id: string; from: string; fromAvatar: string; fromColor: string; text: string; time: string; unread: boolean; pinned: boolean; attachments: number; online: boolean
}
export interface FakeNotification {
  id: string; text: string; time: string; type: string; read: boolean; actionable: boolean; actionLabel?: string
}
export interface FakeCalendarEvent {
  id: string; title: string; date: string; start: string; end: string; color: string; recurring: boolean; description: string; location?: string
}

const firstNames = ['Ahmed','Sara','Omar','Mariam','John','Emma','Mohamed','Lina','Ali','Nour','Khaled','Hana','Youssef','Layla','Hassan','Dana','Karim','Salma','Tarek','Nadia','Zaid','Maya','Rami','Leen','Samir','Huda','Bassel','Rasha','Fadi','Dima','Walid','Lama','Akram','Nada','Hisham','Rania','Ghassan','Alaa','Maher','Yara','Zakaria','Shahd','Tamer','Jana','Nabil','Rita','Fouad','Salwa','Adel','Mona','Shady','Mirna','Raafat','Heba','Fares']
const lastNames = ['Hassan','Mohamed','Khaled','Ali','Carter','Watson','Saleh','Nabil','Youssef','Amin','Fawzi','Rashid','Naguib','Anwar','Mansour','Shawki','Ghaly','Farid','Nassar','Gerges','Samaan','Boulos','Aziz','Karam','Malki','Shukr','Jabr','Ayoub','Tawil','Haddad']
const projectNames = ['Finance App','Crypto Landing','E-learning Platform','SaaS Dashboard','Mobile Wallet','Healthcare Portal','Real Estate App','Social Network','AI Chatbot','CRM System','Inventory Management','Task Manager','Mail Client','Analytics Dashboard','POS System','Booking Platform','Food Delivery App','Fitness Tracker','Music Player','Travel Planner','Learning LMS','Recruitment Portal','E-commerce Store','Portfolio Builder','Chat Application','Notification Service','Payment Gateway','Data Pipeline','Cloud Storage','Video Conferencing','DevOps Tool','Marketing Automation','HR Platform','ERP System','IoT Dashboard']
const actions = ['completed','created','updated','assigned','reviewed','deployed','archived','marked','commented on','started','finished','merged','approved','rejected','requested changes','submitted','closed','opened','fixed','added','removed','pushed','pulled','rebased','configured']
const targets = ['Login UI','Database schema','REST API','Dashboard','Settings page','Homepage','Auth module','Payment flow','Search feature','Notification system','OAuth integration','WebSocket server','CI/CD pipeline','Docker config','GraphQL schema','Testing suite','Documentation','Mobile responsive','Dark mode','Accessibility','Performance optimization','Security audit','Migration script','Caching layer','Error handling','Logging system','Email templates','SMS integration','File upload','Video streaming','Chat feature','Analytics tracking','User profile','Notifications','Landing page','Checkout flow','Admin panel','Report generator','Search filter','Map integration']
const techStacks = ['React','Vue','Angular','Node.js','Python','Go','Rust','TypeScript','PostgreSQL','MongoDB','Redis','Docker','Kubernetes','AWS','GCP','Azure']
const departments = ['Engineering','Design','Product','Marketing','Support','Sales','DevOps','QA','Research','Data']

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick<T>(arr: T[]): T { return arr[rand(0, arr.length - 1)] }
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]] } return a }
function dateOffset(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().split('T')[0] }
function timeAgo(min: number, max: number) { const m = rand(min, max); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago` }
function genId() { return Math.random().toString(36).slice(2, 9) }

const colors = ['#4F7CFF','#8A4DFF','#FF8A4C','#22C55E','#F59E0B','#EF4444','#FF6B9D','#4DD8FF','#A78BFA','#34D399','#F97316','#EC4899']

const userColors: string[] = []
const usedNames = new Set<string>()

function genUserName(): string {
  for (let i = 0; i < 50; i++) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`
    if (!usedNames.has(name)) { usedNames.add(name); return name }
  }
  return `${pick(firstNames)} ${pick(lastNames)}-${rand(1, 999)}`
}

export const fakeUsers: FakeUser[] = Array.from({ length: 55 }, (_, i) => {
  const name = genUserName()
  const c = pick(colors)
  userColors.push(c)
  const roles = ['Admin','Manager','Developer','Designer','Viewer']
  return {
    id: genId(), name, email: `${name.toLowerCase().replace(/\s+/g, '.')}@taskflow.dev`,
    avatar: name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase(),
    role: i === 0 ? 'Admin' : pick(roles), department: pick(departments),
    phone: `+1${rand(200,999)}${rand(100,999)}${rand(1000,9999)}`,
    joined: dateOffset(-rand(30, 730)), color: c,
    bio: pick(['Full-stack developer with 5+ years experience', 'UI/UX designer passionate about clean interfaces', 'Product manager focused on delivering value', 'DevOps engineer automating everything', 'Data scientist exploring ML solutions', 'Frontend specialist building performant apps']),
    tasksCompleted: rand(10, 200), rating: +(3.5 + Math.random() * 1.5).toFixed(1), timezone: pick(['UTC-8','UTC-5','UTC+0','UTC+1','UTC+2','UTC+3','UTC+5:30','UTC+8']),
  }
})

export const fakeProjects: FakeProject[] = projectNames.slice(0, 35).map((name) => {
  const owner = pick(fakeUsers)
  const status = pick(['In Progress','Completed','Pending','Archived'])
  const tech = shuffle(techStacks).slice(0, rand(2, 5))
  return {
    id: genId(), name,
    description: `A ${pick(['modern','sleek','responsive','scalable','fast','enterprise','cloud-native','real-time'])} ${pick(['web app','mobile app','platform','dashboard','solution','portal','suite'])} built with ${tech.slice(0, 2).join(', ')}`,
    status, priority: pick(['High','Medium','Low']), owner: owner.name, members: rand(2, 9),
    progress: status === 'Completed' ? 100 : rand(10, 95),
    deadline: dateOffset(rand(-20, 90)), tasks: rand(5, 45), completed: rand(0, 40),
    image: name.slice(0, 2).toUpperCase(), color: pick(colors), budget: `$${rand(10, 500)}K`,
    tech, lastActivity: timeAgo(1, 720),
  }
})

export const fakeActivities: FakeActivity[] = Array.from({ length: 500 }, () => {
  const user = pick(fakeUsers)
  return {
    id: genId(), user: user.name, userAvatar: user.avatar, userColor: user.color,
    action: pick(actions), target: pick(targets), time: timeAgo(1, 43200),
    type: pick(['completed','created','updated','urgent','warning','info']),
    color: pick(colors), details: Math.random() > 0.5 ? pick(['2 files changed', '3 comments', 'Hotfix applied', 'Breaking change', 'Performance improved']) : undefined,
  }
})

export const fakeMessages: FakeMessage[] = fakeUsers.slice(0, 30).map((u) => ({
  id: u.id, from: u.name, fromAvatar: u.avatar, fromColor: u.color,
  text: pick(['Hey! How are you?', 'The project is ready for review', 'Please check the latest updates', 'Can we schedule a meeting?', 'Looks great! 🎉', 'I finished the task early', 'When is the deadline exactly?', 'Great work team!', 'Let me know if you need help', 'The PR is open for review', 'Can you deploy this today?', 'I found a bug in the auth flow', 'The design looks clean!', 'Let us iterate on this', 'Perfect, thanks!', 'Added the missing tests', 'Ready for QA', 'Should we add more metrics?']),
  time: timeAgo(1, 1440), unread: Math.random() > 0.4, pinned: Math.random() > 0.85, attachments: Math.random() > 0.7 ? rand(0, 3) : 0, online: Math.random() > 0.5,
}))

export const fakeNotifications: FakeNotification[] = [
  { id: genId(), text: 'Task "Login UI" assigned to you', time: '2m ago', type: 'info', read: false, actionable: true, actionLabel: 'View' },
  { id: genId(), text: 'Deadline tomorrow: Dashboard redesign', time: '15m ago', type: 'warning', read: false, actionable: true, actionLabel: 'Remind' },
  { id: genId(), text: 'Sarah joined Engineering team', time: '1h ago', type: 'success', read: false, actionable: false },
  { id: genId(), text: 'Project "Finance App" completed', time: '2h ago', type: 'success', read: true, actionable: false },
  { id: genId(), text: 'You were mentioned in a comment by Ahmed', time: '3h ago', type: 'info', read: true, actionable: true, actionLabel: 'View' },
  { id: genId(), text: 'New message from Omar about API design', time: '5h ago', type: 'info', read: true, actionable: true, actionLabel: 'Reply' },
  { id: genId(), text: 'Urgent: Payment flow broken on production', time: '1d ago', type: 'danger', read: true, actionable: true, actionLabel: 'Investigate' },
  { id: genId(), text: 'API deployment v2.4.1 finished successfully', time: '2d ago', type: 'success', read: true, actionable: false },
  { id: genId(), text: 'Sprint planning tomorrow at 10 AM', time: '3h ago', type: 'warning', read: false, actionable: true, actionLabel: 'Add to Calendar' },
  { id: genId(), text: 'You have 4 pending review requests', time: '6h ago', type: 'info', read: false, actionable: true, actionLabel: 'Review' },
  { id: genId(), text: 'Database migration completed', time: '8h ago', type: 'success', read: true, actionable: false },
  { id: genId(), text: 'New feature request: Dark mode toggle', time: '1d ago', type: 'info', read: false, actionable: true, actionLabel: 'View' },
  { id: genId(), text: 'Server deployment green on staging', time: '12h ago', type: 'success', read: true, actionable: false },
  { id: genId(), text: 'Password changed successfully', time: '3d ago', type: 'info', read: true, actionable: false },
  { id: genId(), text: '2FA enabled for your account', time: '5d ago', type: 'success', read: true, actionable: false },
]

export const fakeEvents: FakeCalendarEvent[] = Array.from({ length: 30 }, () => ({
  id: genId(),
  title: pick(['Sprint Planning','Design Review','Client Call','Code Review','Daily Standup','Sprint Workshop','Production Deployment','Retrospective','Product Demo','Architecture Meeting','Kickoff Session','QA Review','Sprint Grooming','Tech Talk','Team Lunch']),
  date: dateOffset(rand(-7, 45)),
  start: `${rand(7, 17).toString().padStart(2, '0')}:${pick(['00','30'])}`,
  end: `${rand(8, 18).toString().padStart(2, '0')}:${pick(['00','30'])}`,
  color: pick(colors), recurring: Math.random() > 0.7,
  description: pick(['Weekly sync with the team', 'Reviewing latest designs', 'Quarterly planning session', 'Performance review', 'One-on-one meeting', 'Technical discussion', 'Bug triage session']),
  location: Math.random() > 0.5 ? pick(['Room A','Room B','Main Hall','Online - Zoom','Online - Meet','Conference Room']) : undefined,
}))

// Derived stats
export const projectStats = {
  totalProjects: fakeProjects.length,
  totalTasks: fakeProjects.reduce((a, p) => a + p.tasks, 0),
  completedTasks: fakeProjects.reduce((a, p) => a + p.completed, 0),
  activeProjects: fakeProjects.filter((p) => p.status === 'In Progress').length,
  memberCount: fakeUsers.length,
  overdueProjects: fakeProjects.filter((p) => p.status !== 'Completed' && new Date(p.deadline) < new Date()).length,
}
