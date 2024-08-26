import { useState } from 'react'

function parseToValue<T>(key: string, value: string | null): T {
  if (!value) {
    return undefined as T
  }

  const { __data, __exp } = JSON.parse(value)
  if (__exp !== -1 && new Date().getTime() - __exp >= 0) {
    localStorage.removeItem(key)
    return undefined as T
  }

  return __data as T
}

export const useLocalStorage = <T>(key: string, initialValue?: T): [T, <Z>(value: Z, exp?: number) => void, () => void] => {
  if (typeof window === 'undefined') {
    const fn = () => { }
    return [initialValue as T, fn, fn]
  }

  if (initialValue && (localStorage.getItem(key) === undefined || localStorage.getItem(key) === '' || localStorage.getItem(key) === null)) {
    localStorage.setItem(key, JSON.stringify({ __data: initialValue, __exp: -1 }))
  }

  const [localStorageState, setLocalStorageState] = useState(localStorage.getItem(key))

  const setLocalStorage = <T>(value: T, exp: number = -1) => {
    if (!value) {
      return
    }

    if (typeof exp === 'number' && exp !== -1) {
      exp = new Date().getTime() + exp
    }

    const data = JSON.stringify({ __data: value, __exp: exp })
    setLocalStorageState(data)
    return localStorage.setItem(key, data)
  }

  const removeLocalStorage = () => {
    setLocalStorageState(null)
    localStorage.removeItem(key)
  }

  return [parseToValue(key, localStorageState), setLocalStorage, removeLocalStorage]
}
