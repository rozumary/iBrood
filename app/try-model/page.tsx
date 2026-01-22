"use client"

import Link from "next/link"

import { useState, useEffect } from "react"

const roles = [
  { value: "beekeeper", label: "Beekeeper" },
  { value: "researcher", label: "Researcher" },
  { value: "student", label: "Student" },
]
const purposes = [
  { value: "full-access", label: "System Access", roles: ["beekeeper"] },
  { value: "testing", label: "Testing model", roles: ["researcher"] },
  { value: "research", label: "Research", roles: ["researcher"] },
  { value: "demo", label: "Demo", roles: ["researcher"] },
  { value: "testing-student", label: "Testing model", roles: ["student"] },
  { value: "research-student", label: "Research", roles: ["student"] },
  { value: "demo-student", label: "Demo", roles: ["student"] },
]

export default function TryModelPage() {
  const [name, setName] = useState("")
  const [alias, setAlias] = useState("")
  const [role, setRole] = useState(roles[0].value)
  const [purpose, setPurpose] = useState("full-access")
  const [studentId, setStudentId] = useState("")
  const [sessionStarted, setSessionStarted] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const [isFormReady, setIsFormReady] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsFormReady(true), 100)
  }, [])

  const availablePurposes = purposes.filter(p => p.roles.includes(role))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDuplicateWarning("")
    
    if (role === 'beekeeper' && !name.trim()) {
      setDuplicateWarning("Please enter your name.")
      return
    }
    
    if ((role === 'researcher' || role === 'student') && !alias.trim()) {
      setDuplicateWarning("Please enter your display name.")
      return
    }
    
    if (role === 'student' && !studentId.trim()) {
      setDuplicateWarning("Please enter your Student ID.")
      return
    }
    
    setShowReminder(true)
    setTimeout(() => {
      setShowReminder(false)
      setIsLoading(true)
      
      setTimeout(() => {
        const userName = role === 'beekeeper' ? name : (alias || role)
        const idPart = role === 'student' ? studentId : (role === 'researcher' && studentId ? studentId : userName)
        const userId = `${idPart}_${role}_${purpose}`.toLowerCase().replace(/[^a-z0-9_]/g, '_')
        
        localStorage.setItem('ibrood_current_user', JSON.stringify({
          name: role === 'beekeeper' ? name : (alias || (role.charAt(0).toUpperCase() + role.slice(1))),
          role,
          purpose,
          farmName: role === 'beekeeper' ? alias : undefined,
          studentId: (role === 'researcher' || role === 'student') ? studentId : undefined,
          userId
        }))
        
        if (role === "beekeeper") {
          window.location.href = "/beekeeper-mode"
        } else {
          window.location.href = "/research-mode"
        }
      }, 1500)
    }, 2500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center md:justify-center bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      {!isFormReady && (
        <div className="fixed inset-0 bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900 z-40" />
      )}
      {showReminder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Remember Your Credentials</h3>
              <p className="text-amber-700 dark:text-amber-300 mb-4">Make sure to remember your login details to access your session history and data later.</p>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Your credentials:</p>
                <p className="mt-1">{role === 'beekeeper' ? `Name: ${name}` : role === 'student' ? `Student ID: ${studentId}` : `Researcher ID: ${studentId || 'Not provided'}`}</p>
                <p>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9998]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-900 dark:text-amber-100 font-semibold">Starting your session...</p>
          </div>
        </div>
      )}
      
      <div className={`bg-white/90 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-8 md:p-10 max-w-xs md:max-w-lg w-full text-center mx-auto mt-16 md:mt-0 transition-opacity duration-300 ${isFormReady ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-amber-900 dark:text-amber-100">Explore Model</h1>
        <p className="mb-6 text-amber-700/80 dark:text-amber-300/80 text-base md:text-lg">Initialize your session to explore the model. No account or sign-up required.</p>
        {duplicateWarning && (
          <div className="mb-4 p-3 bg-amber-100 text-amber-800 rounded-lg border border-amber-300 text-sm text-left">
            {duplicateWarning}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {role === 'beekeeper' && (
            <div>
              <label className="block text-amber-900 dark:text-amber-100 font-medium mb-1 text-base md:text-lg">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Juan Dela Cruz"
                className="w-full px-4 py-2.5 md:px-5 md:py-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100 text-base md:text-lg"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-amber-900 dark:text-amber-100 font-medium mb-1 text-base md:text-lg">
              {role === 'beekeeper' ? 'Bee Farm Name' : 'Display Name'}
              {(role === 'researcher' || role === 'student') && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="text"
              value={alias}
              onChange={e => setAlias(e.target.value)}
              placeholder={role === 'beekeeper' ? 'e.g. Lucido Bee Farm' : 'e.g. Juan Dela Cruz'}
              className="w-full px-4 py-2.5 md:px-5 md:py-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100 text-base md:text-lg"
              required={role === 'researcher' || role === 'student'}
            />
          </div>
          <div>
            <label className="block text-amber-900 dark:text-amber-100 font-medium mb-1 text-base md:text-lg">Role</label>
            <select
              value={role}
              onChange={e => {
                setRole(e.target.value)
                if (e.target.value === 'beekeeper') {
                  setPurpose('full-access')
                } else if (e.target.value === 'student') {
                  setPurpose('testing-student')
                } else {
                  setPurpose('testing')
                }
              }}
              className="w-full px-4 py-2.5 md:px-5 md:py-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100 text-base md:text-lg"
            >
              {roles.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {(role === 'researcher' || role === 'student') && (
            <div>
              <label className="block text-amber-900 dark:text-amber-100 font-medium mb-1 text-base md:text-lg">
                {role === 'student' ? 'Student ID' : 'Researcher ID'} 
                {role === 'student' && <span className="text-red-500"> *</span>}
                {role === 'researcher' && <span className="text-amber-400 text-xs"> (optional)</span>}
              </label>
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder={role === 'student' ? 'e.g. 2021-12345' : 'e.g. RES-2024-001'}
                className="w-full px-4 py-2.5 md:px-5 md:py-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100 text-base md:text-lg"
                required={role === 'student'}
              />
            </div>
          )}
          <div>
            <label className="block text-amber-900 dark:text-amber-100 font-medium mb-1 text-base md:text-lg">Purpose</label>
            <select
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className="w-full px-4 py-2.5 md:px-5 md:py-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100 text-base md:text-lg"
            >
              {availablePurposes.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-[#FFA95C] text-white font-semibold py-2.5 md:py-3 rounded-xl hover:bg-[#FFA95C]/80 transition-all text-base md:text-lg shadow-lg">Explore Model</button>
        </form>
      </div>
    </div>
  )
}
