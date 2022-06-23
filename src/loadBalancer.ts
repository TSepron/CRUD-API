import 'dotenv/config'
import cluster from 'cluster'
import * as http from 'http'
import { server } from './server.js'
import { randomPorts } from './utils/getRandomPorts.js'

const allAvailablePorts = randomPorts
const portsAndAmountOfRequests: {
  [key: string]: number
} = allAvailablePorts.reduce(
  (acc, curr) => (acc[curr] = 0, acc), 
  {}
)

const findPortWithLowestRequestsCount = () => {
  let minAmountOfRequests = Infinity

  const port = Object.entries(portsAndAmountOfRequests)
    .reduce((minPort, [port, amountOfRequests]) => {
      if (amountOfRequests < minAmountOfRequests) {
        minAmountOfRequests = amountOfRequests
        minPort = port
      }

      return minPort
    }, allAvailablePorts[0])

  return allAvailablePorts.filter(p => p !== port)[0]
}



const getBody = async (req: http.IncomingMessage) => {
  let body = ''
  for await (const chunk of req) {
    body += chunk.toString()
  }
  return body
}

const { PORT: PRIMARY_PORT } = process.env

if (cluster.isPrimary) {
  console.log('PORTS:')
  console.log(allAvailablePorts)

  http.createServer(async function loadBalancer(req, res) {
    const { headers, method, url = '' } = req
    const { host } = headers

    const reqUrl = new URL(url, `http://${host}`)
    const portToUse: string = findPortWithLowestRequestsCount()
    reqUrl.port = portToUse

    portsAndAmountOfRequests[portToUse]++
    const { href } = reqUrl
    
    const body = await getBody(req)

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }

    const response = await new Promise(resolve => {
      const request = http.request(href, options, response => {
        
        let data = ''
        response.on('data', _data => data += _data)
        response.on('end', () => resolve(data))
      })
      request.write(body)
      request.end()
    })


    res.setHeader('Content-Type', 'application/json');
    res.end(response)
  })
    .listen(PRIMARY_PORT, () => {
      console.log(`Load Balancer Server start on PORT: ${PRIMARY_PORT}`)
    })


  for (const port of allAvailablePorts) {
    const worker = cluster.fork()
    worker.on('message', function (_) {
      worker.send(port)
    })
  }

} else if (cluster.isWorker) {
    process?.send?.(null)
    let isWorkerServerStarted = false

    process.on('message', port => {
      if (isWorkerServerStarted) 
        return 

      server
        .listen(port, () => {
          console.log(`--Worker ${process.pid} started on port ${port}`)
        })
      
      isWorkerServerStarted = true
    })
}