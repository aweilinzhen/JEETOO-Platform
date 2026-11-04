import { useSyncExternalStore } from 'react'

export type DeveloperAccessStatus = 'not-applied' | 'pending' | 'rejected' | 'authorized'
export type DeveloperLoginStatus = 'logged_out' | 'logged_in'
export type MockAuthState = { loginStatus: DeveloperLoginStatus; accessStatus: DeveloperAccessStatus }

const STORAGE_KEY = 'jeetoo-developer-mock-auth'
const defaultState: MockAuthState = { loginStatus: 'logged_out', accessStatus: 'not-applied' }
let state = readSavedState()
const listeners = new Set<() => void>()

function readSavedState(): MockAuthState {
  if (typeof window === 'undefined') return defaultState
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<MockAuthState> | null
    return {
      loginStatus: saved?.loginStatus === 'logged_in' ? 'logged_in' : 'logged_out',
      accessStatus: ['not-applied', 'pending', 'rejected', 'authorized'].includes(saved?.accessStatus ?? '')
        ? saved!.accessStatus as DeveloperAccessStatus
        : 'not-applied',
    }
  } catch {
    return defaultState
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function getMockAuthState() {
  return state
}

export function useMockAuthState() {
  return useSyncExternalStore(subscribe, getMockAuthState, () => defaultState)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function updateState(next: MockAuthState) {
  state = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Keep the in-memory prototype state usable when browser storage is unavailable.
  }
  notify()
}

export function setMockLoginStatus(loginStatus: DeveloperLoginStatus) {
  updateState({ ...state, loginStatus })
}

export function setMockAccessStatus(accessStatus: DeveloperAccessStatus) {
  updateState({ ...state, accessStatus })
}

export function persistMockAccessStatus(accessStatus: DeveloperAccessStatus) {
  return persistMockAuthState({ ...state, accessStatus })
}

export function persistMockAuthState(nextState: MockAuthState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  } catch {
    return false
  }
  state = nextState
  notify()
  return true
}

export function resetMockAuthState() {
  return persistMockAuthState(defaultState)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    state = readSavedState()
    notify()
  })
}

export function getRestrictedResourcePath(resourcePath: string) {
  if (state.loginStatus !== 'logged_in') return '/developer/login'
  switch (state.accessStatus) {
    case 'authorized':
      return resourcePath
    case 'pending':
      return '/developer/application-status'
    case 'rejected':
    case 'not-applied':
      return '/developer/apply'
  }
}
