import * as request from 'supertest'
import { server } from '../server'


describe('3-rd scenario server test', () => {
  const app = request(server)
  const newUser = {
    username: "Jack",
    age: 26,
    hobbies: ["rs school", "20 hours per week on node"]
  }
  let id: string


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
    'PUT api/users/{userId}: expected answer is '
    + 'userId is invalid and 400 status code',
    async () => {
      const response = await app
        .put(`/api/users/${id.slice(0, 4)}`)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(newUser))
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(400)
      expect(response.body.message)
        .toEqual('userId is invalid')
    }
  )

  test(
    'DELETE api/users/{userId}: expect to '
    + '404 status code',
    async () => {
      const fakeId = id[id.length - 1] + id.slice(1, -1) + id[0]
      
      const response = await app
        .delete(`/api/users/${fakeId}`)
        .set('Accept', 'application/json')
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(404)
      expect(response.body.message)
        .toEqual(`record with id === ${fakeId} doesn't exist`)
    }
  )
})