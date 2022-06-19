import * as request from 'supertest'
import { server } from '../server'

type User = {
  username?: string;
  age?: number;
  hobbies?: string[]
}

describe('2-nd scenario server test', () => {
  const app = request(server)
  const newUser: User = {
    username: "Richard",
    age: 50
  }
  let id: string


  test(
    'POST api/users: expected answer is '
    + 'that can\'t create user and 400 status code',
    async () => {
      const response = await app
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(newUser))
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(400)
      expect(response.body.message)
        .toEqual('request body does not contain required fields')

      newUser.hobbies = []
    }
  )

  test(
    'GET api/users: expect to be '
    + '[] as JSON and 200 status code',
    async () => {
      const response = await app
        .get('/api/users')
        .set('Accept', 'application/json')
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(200)
      expect(response.body).toEqual([])
    }
  )

  test(
    'POST api/users: expect to be new'
    + 'user as JSON and 201 status code',
    async () => {
      const response = await app
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(newUser))
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(201)
      expect(typeof response.body.id).toBe('string')
      expect(response.body).toEqual(
        Object.assign(newUser, { id: response.body.id })
      )
      id = response.body.id
    }
  )

  test(
    'GET api/users/{userId}: expected answer is '
    + 'userId is invalid and 400 status code',
    async () => {
      const response = await app
        .get(`/api/users/${id.slice(5)}`)
        .set('Accept', 'application/json')
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(400)
      expect(response.body.message)
        .toEqual('userId is invalid')
    }
  )
})