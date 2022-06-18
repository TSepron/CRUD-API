import { createServer } from 'http'
import { URL } from 'url'
import 'dotenv/config'
import { STATUS_CODE } from './constants/status-codes.js'
import { parseUrlPathname } from './utils/parseUrlPathname.js'
import { User } from './orm-database/database.js'

const { PORT } = process.env

createServer(async (req, res) => {
  const { headers, method, url = '' } = req
  const { host } = headers

  const reqUrl = new URL(url, `http://${host}`)

  const urlPaths = parseUrlPathname(reqUrl)

  const handleGet = async () => {
    if (urlPaths.length === 2) {
      const users = await User.all()
      
      res.end(JSON.stringify(users))
    }

    if (urlPaths.length === 3) {
    }
  }

  const handlePost = async () => {
  }

  const handlePut = async () => {
  }

  const handleDelete = async () => {
  }

  res.setHeader('Content-Type', 'application/json');

  try {
    if (urlPaths[0] === 'api' && urlPaths[1] === 'users') {
      switch (method) {
        case 'GET':
          await handleGet()
          break
        case 'POST':
          await handlePost()
          break
        case 'PUT':
          await handlePut()
          break
        case 'DELETE':
          await handleDelete()
          break 
      }
    }
  } catch (err) {
    res.statusCode = STATUS_CODE.SERVER_ERROR
    res.end('Sorry on server error happened, try again later');
  }

  if (res.writableEnded)
    return 
  
  res.statusCode = STATUS_CODE.NOT_FOUND
  res.end('This endpoint doesn\'t exist!');
})
  .listen(PORT, () => {
    console.log(`Server start on PORT: ${PORT}`)
  })
  