import  * as request from 'supertest'
import { server } from '../server'

describe('1-st scenario server test', () => {
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
      +'user as JSON and 201 status code', 
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
    'GET api/users/{userId}: expect to be created'
    + 'user as JSON and 200 status code', 
    async () => {
      const response = await app
        .get(`/api/users/${id}`)
        .set('Accept', 'application/json')
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(200)
      expect(response.body).toEqual(newUser)
    }
  )

  test(
    'PUT api/users/{userId}: expect to be updated'
    + 'user with same id as JSON and 200 status code',
    async () => {
      const response = await app
        .put(`/api/users/${id}`)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(newUser))
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(200)
      expect(response.body.id).toEqual(id)
      Object.assign(newUser, response.body)
    }
  )

  test(
    'DELETE api/users/{userId}: expect to '
    + '204 status code',
    async () => {
      const response = await app
        .delete(`/api/users/${id}`)
        .set('Accept', 'application/json')
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(204)
    }
  )

  test(
    'GET api/users/{userId}: expected answer is '
    + 'that there is no such object and status code 404',
    async () => {
      const response = await app
        .get(`/api/users/${id}`)
        .set('Accept', 'application/json')
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.status).toEqual(404)
      expect(response.body.message)
        .toEqual(`record with id === ${id} doesn't exist`)
    }
  )
})
