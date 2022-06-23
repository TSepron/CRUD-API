import { createServer } from 'http'
import { URL } from 'url'
import { STATUS_CODE } from './constants/status-codes.js'
import { parseUrlPathname } from './utils/parseUrlPathname.js'
import { User } from './orm-database/database.js'
import { isUuid } from './utils/isUuid.js';

export const server = createServer(async (req, res) => {
  const { headers, method, url = '' } = req
  const { host } = headers

  const reqUrl = new URL(url, `http://${host}`)

  const urlPaths = parseUrlPathname(reqUrl)


  const handleGet = async () => {
    // GET /api/users
    if (urlPaths.length === 2) {
      const users = await User.all()

      res.end(JSON.stringify(users))
    }

    // GET /api/users/${userId}
    if (urlPaths.length === 3) {
      const userId = urlPaths[2]

      if (!isUuid(userId)) {
        res.statusCode = STATUS_CODE.BAD_REQUEST
        res.end(JSON.stringify({
          message: 'userId is invalid'
        }))
      }

      const user = await User.find(userId)

      if (user == null) {
        res.statusCode = STATUS_CODE.NOT_FOUND
        res.end(JSON.stringify({
          message: `record with id === ${userId} doesn't exist`
        }))
      }

      if (res.writableEnded)
        return

      res.end(JSON.stringify(user))
    }
  }


  const handlePost = async (body: string) => {
    // POST api/users
    if (urlPaths.length === 2) {
      try {
        const user = JSON.parse(body)
        const newUser = await User.create(user)

        res.statusCode = STATUS_CODE.CREATED
        res.end(JSON.stringify(newUser))
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.endsWith('field required')) {
            res.statusCode = STATUS_CODE.BAD_REQUEST
            res.end(JSON.stringify({
              message: 'request body does not contain required fields'
            }))
          } else {
            throw err
          }
        }
      }
    }
  }

  const handlePut = async (body: string) => {
    // PUT api/users/{userId}
    if (urlPaths.length === 3) {
      const userId = urlPaths[2]
      const user = JSON.parse(body)

      if (!isUuid(userId)) {
        res.statusCode = STATUS_CODE.BAD_REQUEST
        res.end(JSON.stringify({
          message: 'userId is invalid'
        }))
      }

      try {
        const updatedUser = await User.update(userId, user)

        if (updatedUser == null) {
          res.statusCode = STATUS_CODE.NOT_FOUND
          res.end(JSON.stringify({
            message: `record with id === ${userId} doesn't exist`
          }))
        }

        if (res.writableEnded)
          return

        res.end(JSON.stringify(updatedUser))
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.endsWith('field required')) {
            res.statusCode = STATUS_CODE.BAD_REQUEST
            res.end(JSON.stringify({
              message: 'request body does not contain required fields'
            }))
          } else {
            throw err
          }
        }
      }
    }
  }


  const handleDelete = async () => {
    // DELETE  api/users/{userId}
    if (urlPaths.length === 3) {
      const userId = urlPaths[2]

      if (!isUuid(userId)) {
        res.statusCode = STATUS_CODE.BAD_REQUEST
        res.end(JSON.stringify({
          message: 'userId is invalid'
        }))
      }

      const deletedUser = await User.delete(userId)

      if (deletedUser == null) {
        res.statusCode = STATUS_CODE.NOT_FOUND
        res.end(JSON.stringify({
          message: `record with id === ${userId} doesn't exist`
        }))
      }

      if (res.writableEnded)
        return

      res.statusCode = STATUS_CODE.NO_CONTENT
      res.end(JSON.stringify(deletedUser))
    }
  }


  res.setHeader('Content-Type', 'application/json');

  try {
    if (urlPaths[0] === 'api' && urlPaths[1] === 'users') {
      let body = ''

      switch (method) {
        case 'GET':
          await handleGet()
          break
        case 'POST':
          for await (const chunk of req) {
            body += chunk.toString()
          }
          await handlePost(body)
          break
        case 'PUT':
          for await (const chunk of req) {
            body += chunk.toString()
          }
          await handlePut(body)
          break
        case 'DELETE':
          await handleDelete()
          break
      }
    }
  } catch (err) {
    res.statusCode = STATUS_CODE.SERVER_ERROR
    res.end(JSON.stringify({
      message: 'Sorry on server error happened, try again later'
    }))
  }

  if (res.writableEnded)
    return

  res.statusCode = STATUS_CODE.NOT_FOUND
  res.end(JSON.stringify({
    message: 'This endpoint doesn\'t exist!'
  }))
})
