"use client"

import * as React from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type ToastAction =
  | { type: "ADD"; toast: Toast }
  | { type: "REMOVE"; id: string }
  | { type: "DISMISS_ALL" }

interface ToastState {
  toasts: Toast[]
}

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD":
      return { toasts: [...state.toasts, action.toast] }
    case "REMOVE":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) }
    case "DISMISS_ALL":
      return { toasts: [] }
  }
}

let toastCount = 0

const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(action: ToastAction) {
  memoryState = toastReducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
}: Omit<Toast, "id">) {
  const id = String(toastCount++)

  dispatch({
    type: "ADD",
    toast: { id, title, description, variant, duration },
  })

  if (duration > 0) {
    setTimeout(() => {
      dispatch({ type: "REMOVE", id })
    }, duration)
  }

  return {
    id,
    dismiss: () => dispatch({ type: "REMOVE", id }),
  }
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (id: string) => dispatch({ type: "REMOVE", id }),
    dismissAll: () => dispatch({ type: "DISMISS_ALL" }),
  }
}

export { useToast, toast }
