import { cpus } from 'os'

// 1024—49151 user ports on PC
function randomIntFromInterval(
  min: number, 
  max: number
) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomPorts(amount: number) {
  const randomPorts = new Array(amount).fill(0)

  for (const i in randomPorts) {
    let iterationCount = 0

    while (true) {
      if (iterationCount > 10) 
        throw new Error('something bad happened while getRandomPorts')

      const randomPort = randomIntFromInterval(1024, 49151)
      if (
        randomPorts.includes(randomPort) 
        || randomPort === Number(process.env.PORT)
      ) {
        iterationCount++
        continue
      }

      randomPorts[i] = randomPort
      break
    }
  }


  return randomPorts
}

export const randomPorts = getRandomPorts(cpus().length)
