import { v4 as uuidv4 } from 'uuid';
import { OneUser, PotentialUser } from "../interfaces/database/User.interface"
import { delay } from './../utils/delay.js';

export class User implements OneUser {
  private static users: OneUser[] = []

  id: string
  username: string 
  age: number
  hobbies: string[]
  
  constructor({ username, age, hobbies }: PotentialUser) {
    this.id = uuidv4()
    this.username = username,
    this.age = age
    this.hobbies = hobbies
  }

  private static validatePotentialUser(user: PotentialUser) {
    if (!user.username)
      throw new Error('username field required')

    if (!user.age)
      throw new Error('age field required')

    if (!user.hobbies || !Array.isArray(user.hobbies))
      throw new Error('hobbies field required')
  }

  static async all() {
    // simulate waiting from real BD
    await delay(Math.random())

    return this.users
  }

  static async find(userId: string) {
    // simulate waiting from real BD
    await delay(Math.random())

    return this.users.find(user => user.id === userId)
  }

  static async create(user: PotentialUser) {
    this.validatePotentialUser(user)

    // simulate waiting from real BD
    await delay(Math.random())

    const newUser = new this(user)
    this.users.push(newUser)

    return newUser
  }

  static async update(userId: string, updatedUser: PotentialUser) {
    const foundUser = await this.find(userId)

    if (foundUser == null)
      return foundUser

    this.validatePotentialUser(updatedUser)

    Object.assign(foundUser, updatedUser)

    return foundUser
  }
}