import { ref } from 'vue'

export function useRadialMenu() {
  const isOpen = ref(false)

  let timer: ReturnType<typeof setTimeout> | undefined

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const startLongPress = () => {
    cancelLongPress()

    timer = setTimeout(() => {
      open()
    }, 600)
  }

  const cancelLongPress = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  return {
    isOpen,
    open,
    close,
    startLongPress,
    cancelLongPress
  }
}