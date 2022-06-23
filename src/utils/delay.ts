export function delay(seconds: number = 1) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}