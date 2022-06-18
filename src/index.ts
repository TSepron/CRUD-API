import { createServer } from 'http'
import { URL } from 'url'
import 'dotenv/config'
import { parseUrlPathname } from './parseUrlPathname.js'

const { PORT } = process.env

createServer((req, res) => {
  const { headers, method, url = '' } = req
  const { host } = headers

  console.log(method)
  const reqUrl = new URL(url, `http://${host}`)

  const urlPaths = parseUrlPathname(reqUrl)
  console.log(urlPaths)
  
  res.end("Hello");
})
  .listen(PORT, () => {
    console.log(`Server start on PORT: ${PORT}`)
  })
  