import { useState, useEffect, useRef, useCallback } from 'react'
import {
  collection, doc, getDocs, addDoc, updateDoc,
  query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:         '#F2F2F7',
  surface:    '#FFFFFF',
  surfaceAlt: '#F9F9FB',
  border:     'rgba(60,60,67,0.12)',
  primary:    '#007AFF',
  success:    '#34C759',
  warning:    '#FF9500',
  text:       '#1C1C1E',
  textSec:    '#6C6C70',
  textTer:    '#AEAEB2',
  shadow:     '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
  shadowSm:   '0 1px 2px rgba(0,0,0,0.06)',
  radius:     '14px',
  radiusSm:   '10px',
  font:       "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
}

// ─── PDCD Logo ────────────────────────────────────────────────────────────────
function PDCDLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={C.primary} />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fill="white" fontSize="13" fontWeight="700" fontFamily={C.font} letterSpacing="-0.5">
        PDCD
      </text>
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0
  return Math.round((tasks.filter(t => t.isComplete).length / tasks.length) * 100)
}

function getCurrentStage(tasks) {
  if (!tasks || tasks.length === 0) return '—'
  const sorted = [...tasks].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  const incomplete = sorted.find(t => !t.isComplete)
  if (!incomplete) return 'Complete ✓'
  return incomplete.stageName
}

function groupByStage(tasks) {
  const sorted = [...tasks].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  const order = []
  const map = {}
  sorted.forEach(t => {
    if (!map[t.stageName]) { map[t.stageName] = []; order.push(t.stageName) }
    map[t.stageName].push(t)
  })
  return order.map(s => ({ stage: s, tasks: map[s] }))
}

function timeAgo(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ─── UI Primitives ────────────────────────────────────────────────────────────
function ProgressBar({ pct, height = 6 }) {
  const color = pct === 100 ? C.success : pct > 50 ? C.primary : C.warning
  return (
    <div style={{ background: C.border, borderRadius: 99, height, overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
    </div>
  )
}

function StageChip({ label }) {
  const done = label === 'Complete ✓'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: done ? 'rgba(52,199,89,0.12)' : 'rgba(0,122,255,0.10)',
      color: done ? C.success : C.primary,
      fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
      <div style={{
        width: 28, height: 28, border: `3px solid ${C.border}`,
        borderTopColor: C.primary, borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  )
}

function EmptyState({ message, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,122,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 6v16M6 14h16" stroke={C.primary} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: C.text }}>{message}</p>
      {sub && <p style={{ margin: 0, fontSize: 14, color: C.textSec }}>{sub}</p>}
    </div>
  )
}

// ─── Task Row ─────────────────────────────────────────────────────────────────
function TaskRow({ task, projectId, onToggle }) {
  const [expanded, setExpanded] = useState(false)
  const [localNote, setLocalNote] = useState(task.notes || '')
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef(null)

  const handleNoteChange = (val) => {
    setLocalNote(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        await updateDoc(doc(db, 'projects', projectId, 'tasks', task.id), { notes: val })
      } catch (e) { console.error(e) }
      setSaving(false)
    }, 900)
  }

  return (
    <div style={{ background: C.surface }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px' }}>
        {/* Big tap-friendly checkbox */}
        <div
          onClick={() => onToggle(task.id, task.isComplete)}
          style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: task.isComplete ? 'none' : `2px solid ${C.border}`,
            background: task.isComplete ? C.success : 'transparent',
            transition: 'all 0.2s', cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {task.isComplete && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Task name */}
        <span
          onClick={() => setExpanded(e => !e)}
          style={{
            flex: 1, fontSize: 15, color: task.isComplete ? C.textTer : C.text,
            textDecoration: task.isComplete ? 'line-through' : 'none',
            transition: 'color 0.2s', lineHeight: 1.35, cursor: 'pointer',
          }}
        >
          {task.taskName}
        </span>

        {/* Note indicator + chevron */}
        <div onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
          {localNote && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.primary, opacity: 0.7 }} />}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', opacity: 0.35 }}>
            <path d="M4 6L8 10L12 6" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 14px 56px', animation: 'fadeSlide 0.18s ease' }}>
          <textarea
            value={localNote}
            onChange={e => handleNoteChange(e.target.value)}
            placeholder="Add a note…"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `1.5px solid ${localNote ? C.primary : C.border}`,
              borderRadius: C.radiusSm, padding: '10px 12px',
              fontSize: 14, color: C.text, fontFamily: C.font,
              background: C.surfaceAlt, resize: 'none', outline: 'none', lineHeight: 1.5,
            }}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = localNote ? C.primary : C.border}
          />
          {saving && <p style={{ fontSize: 11, color: C.textTer, margin: '4px 0 0' }}>Saving…</p>}
        </div>
      )}
    </div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, tasks, onPress }) {
  const pct = getProgress(tasks)
  const stage = getCurrentStage(tasks)
  const done = tasks.filter(t => t.isComplete).length

  return (
    <div
      onClick={onPress}
      style={{
        background: C.surface, borderRadius: C.radius, boxShadow: C.shadow,
        padding: '18px 18px 16px', cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent', marginBottom: 12,
        transition: 'transform 0.12s',
      }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.985)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
          <h3 style={{
            margin: 0, fontSize: 17, fontWeight: 600, color: C.text, letterSpacing: -0.3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {project.name}
          </h3>
          {project.address && <p style={{ margin: '2px 0 0', fontSize: 13, color: C.textSec }}>{project.address}</p>}
        </div>
        <StageChip label={stage} />
      </div>
      <ProgressBar pct={pct} height={5} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: C.textSec }}>{done} of {tasks.length} tasks done</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: pct === 100 ? C.success : C.primary }}>{pct}%</span>
      </div>
    </div>
  )
}

// ─── Name Gate ────────────────────────────────────────────────────────────────
function NameGate({ onConfirm }) {
  const [name, setName] = useState('')
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: C.bg, fontFamily: C.font, padding: 32,
    }}>
      <PDCDLogo size={56} />
      <h1 style={{ margin: '20px 0 6px', fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
        PDCD Homes
      </h1>
      <p style={{ margin: '0 0 36px', fontSize: 15, color: C.textSec }}>Construction Tracker</p>
      <div style={{ width: '100%', maxWidth: 320 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.textSec, display: 'block', marginBottom: 8 }}>
          YOUR NAME
        </label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onConfirm(name.trim())}
          placeholder="e.g. John Smith" autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            border: `1.5px solid ${C.border}`, borderRadius: C.radiusSm,
            padding: '14px 16px', fontSize: 16, fontFamily: C.font,
            background: C.surface, color: C.text, outline: 'none', marginBottom: 14,
          }}
          onFocus={e => e.target.style.borderColor = C.primary}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        <button
          onClick={() => name.trim() && onConfirm(name.trim())}
          style={{
            width: '100%', padding: '14px', borderRadius: C.radiusSm,
            background: name.trim() ? C.primary : C.border,
            color: 'white', fontFamily: C.font, fontSize: 16, fontWeight: 600,
            border: 'none', cursor: name.trim() ? 'pointer' : 'default', transition: 'background 0.2s',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [supervisor, setSupervisor] = useState(() => localStorage.getItem('pdcd_supervisor') || '')
  const [view, setView] = useState('dashboard')
  const [projects, setProjects] = useState([])
  const [allTasks, setAllTasks] = useState({})
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectTasks, setProjectTasks] = useState([])
  const [projectNotes, setProjectNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [taskLoading, setTaskLoading] = useState(false)
  const [savingNote, setSavingNote] = useState(false)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')))
      const projs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setProjects(projs)

      const taskMap = {}
      await Promise.all(projs.map(async p => {
        const tSnap = await getDocs(query(collection(db, 'projects', p.id, 'tasks'), orderBy('sortOrder', 'asc')))
        taskMap[p.id] = tSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      }))
      setAllTasks(taskMap)
    } catch (err) {
      console.error('loadDashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (supervisor) loadDashboard() }, [supervisor, loadDashboard])

  const loadProject = useCallback(async (project) => {
    setTaskLoading(true)
    setSelectedProject(project)
    setView('project')
    setProjectTasks([])
    setProjectNotes([])
    try {
      const [tSnap, nSnap] = await Promise.all([
        getDocs(query(collection(db, 'projects', project.id, 'tasks'), orderBy('sortOrder', 'asc'))),
        getDocs(query(collection(db, 'projects', project.id, 'projectNotes'), orderBy('createdAt', 'desc'))),
      ])
      setProjectTasks(tSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setProjectNotes(nSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('loadProject:', err)
    } finally {
      setTaskLoading(false)
    }
  }, [])

  const handleToggle = useCallback(async (taskId, current) => {
    setProjectTasks(prev => prev.map(t => t.id === taskId ? { ...t, isComplete: !current } : t))
    setAllTasks(prev => {
      if (!selectedProject) return prev
      return {
        ...prev,
        [selectedProject.id]: (prev[selectedProject.id] || []).map(t =>
          t.id === taskId ? { ...t, isComplete: !current } : t
        )
      }
    })
    try {
      await updateDoc(doc(db, 'projects', selectedProject.id, 'tasks', taskId), { isComplete: !current })
    } catch (err) {
      console.error('toggle:', err)
      setProjectTasks(prev => prev.map(t => t.id === taskId ? { ...t, isComplete: current } : t))
    }
  }, [selectedProject])

  const handleAddNote = useCallback(async () => {
    if (!newNote.trim()) return
    setSavingNote(true)
    try {
      const ref = await addDoc(collection(db, 'projects', selectedProject.id, 'projectNotes'), {
        content: newNote.trim(), author: supervisor, createdAt: serverTimestamp()
      })
      setProjectNotes(prev => [{ id: ref.id, content: newNote.trim(), author: supervisor, createdAt: { toDate: () => new Date() } }, ...prev])
      setNewNote('')
    } catch (err) {
      console.error('addNote:', err)
    } finally {
      setSavingNote(false)
    }
  }, [newNote, selectedProject, supervisor])

  const handleBack = () => {
    setView('dashboard')
    setSelectedProject(null)
    setProjectTasks([])
    setProjectNotes([])
    loadDashboard()
  }

  if (!supervisor) return <NameGate onConfirm={name => { localStorage.setItem('pdcd_supervisor', name); setSupervisor(name) }} />

  // ─── Project View ───
  if (view === 'project' && selectedProject) {
    const pct = getProgress(projectTasks)
    const stage = getCurrentStage(projectTasks)
    const grouped = groupByStage(projectTasks)

    return (
      <div style={{ fontFamily: C.font, background: C.bg, minHeight: '100dvh' }}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeSlide { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
          * { -webkit-font-smoothing: antialiased; } textarea, input { -webkit-appearance: none; }
        `}</style>

        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(242,242,247,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${C.border}`, padding: '12px 16px 10px',
        }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <button onClick={handleBack} style={{
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              color: C.primary, fontSize: 15, fontFamily: C.font, padding: '4px 0', marginBottom: 10,
              WebkitTapHighlightColor: 'transparent',
            }}>
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                <path d="M8 1L1 8L8 15" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Projects
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, paddingRight: 10 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.4 }}>{selectedProject.name}</h1>
                {selectedProject.address && <p style={{ margin: '3px 0 0', fontSize: 13, color: C.textSec }}>{selectedProject.address}</p>}
              </div>
              <StageChip label={stage} />
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.textSec }}>{projectTasks.filter(t => t.isComplete).length} of {projectTasks.length} tasks</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: pct === 100 ? C.success : C.primary }}>{pct}%</span>
              </div>
              <ProgressBar pct={pct} height={6} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 0 100px' }}>
          {taskLoading ? <Spinner /> : (
            <>
              {grouped.length === 0 && <EmptyState message="No tasks yet" sub="A director will set up tasks for this project." />}

              {grouped.map(({ stage, tasks }) => (
                <div key={stage} style={{ marginBottom: 8 }}>
                  <div style={{ padding: '10px 16px 7px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: C.textSec, textTransform: 'uppercase' }}>{stage}</span>
                    <span style={{ fontSize: 12, color: C.textTer }}>{tasks.filter(t => t.isComplete).length}/{tasks.length}</span>
                  </div>
                  <div style={{ background: C.surface, borderRadius: C.radius, overflow: 'hidden', boxShadow: C.shadowSm, marginLeft: 16, marginRight: 16 }}>
                    {tasks.map((task, i) => (
                      <div key={task.id} style={{ borderBottom: i < tasks.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                        <TaskRow task={task} projectId={selectedProject.id} onToggle={handleToggle} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Site Notes */}
              <div style={{ margin: '24px 16px 0' }}>
                <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: -0.3 }}>Site Notes</h2>
                <div style={{ background: C.surface, borderRadius: C.radius, boxShadow: C.shadowSm, padding: 14, marginBottom: 12 }}>
                  <textarea
                    value={newNote} onChange={e => setNewNote(e.target.value)}
                    placeholder={`Add a site note as ${supervisor}…`} rows={3}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      border: `1.5px solid ${newNote ? C.primary : C.border}`,
                      borderRadius: C.radiusSm, padding: '10px 12px',
                      fontSize: 15, fontFamily: C.font, color: C.text,
                      background: C.surfaceAlt, resize: 'none', outline: 'none', lineHeight: 1.5, marginBottom: 10,
                    }}
                    onFocus={e => e.target.style.borderColor = C.primary}
                    onBlur={e => e.target.style.borderColor = newNote ? C.primary : C.border}
                  />
                  <button
                    onClick={handleAddNote} disabled={!newNote.trim() || savingNote}
                    style={{
                      width: '100%', padding: '10px', borderRadius: C.radiusSm,
                      background: newNote.trim() && !savingNote ? C.primary : C.border,
                      color: 'white', fontFamily: C.font, fontSize: 14, fontWeight: 600,
                      border: 'none', cursor: newNote.trim() && !savingNote ? 'pointer' : 'default', transition: 'background 0.2s',
                    }}
                  >
                    {savingNote ? 'Saving…' : 'Post Note'}
                  </button>
                </div>
                {projectNotes.length === 0 ? (
                  <p style={{ textAlign: 'center', fontSize: 14, color: C.textTer, padding: '16px 0' }}>No site notes yet.</p>
                ) : projectNotes.map(note => (
                  <div key={note.id} style={{ background: C.surface, borderRadius: C.radiusSm, boxShadow: C.shadowSm, padding: '12px 14px', marginBottom: 8 }}>
                    <p style={{ margin: '0 0 6px', fontSize: 14, color: C.text, lineHeight: 1.5 }}>{note.content}</p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.primary, background: 'rgba(0,122,255,0.08)', padding: '2px 7px', borderRadius: 99 }}>
                        {note.author || 'Supervisor'}
                      </span>
                      <span style={{ fontSize: 11, color: C.textTer }}>{timeAgo(note.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ─── Dashboard ───
  const totalTasks = Object.values(allTasks).flat()
  const doneTasks = totalTasks.filter(t => t.isComplete)
  const completeProjects = projects.filter(p => {
    const pts = allTasks[p.id] || []
    return pts.length > 0 && pts.every(t => t.isComplete)
  })

  return (
    <div style={{ fontFamily: C.font, background: C.bg, minHeight: '100dvh' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>

      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(242,242,247,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.border}`, padding: '14px 16px 12px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <PDCDLogo size={36} />
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: C.text, letterSpacing: -0.4 }}>PDCD Homes</h1>
            <p style={{ margin: 0, fontSize: 12, color: C.textSec }}>Construction Tracker</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontWeight: 600, color: C.text, fontSize: 13 }}>{supervisor}</span>
            <button
              onClick={() => { localStorage.removeItem('pdcd_supervisor'); setSupervisor('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textTer, fontSize: 11, padding: 0, fontFamily: C.font }}
            >
              Switch
            </button>
          </div>
        </div>
      </div>

      {!loading && projects.length > 0 && (
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', padding: '12px 16px' }}>
            {[
              { label: 'Projects', val: projects.length },
              { label: 'Complete', val: completeProjects.length },
              { label: 'Tasks Done', val: `${doneTasks.length}/${totalTasks.length}` },
            ].map((stat, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>{stat.val}</div>
                <div style={{ fontSize: 11, color: C.textSec, letterSpacing: 0.2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px' }}>
        {loading ? <Spinner /> : projects.length === 0 ? (
          <EmptyState message="No projects yet" sub="A director will add projects to the dashboard." />
        ) : (
          <>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: C.textSec, fontWeight: 500 }}>
              {projects.length} active {projects.length === 1 ? 'project' : 'projects'}
            </p>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} tasks={allTasks[project.id] || []} onPress={() => loadProject(project)} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
