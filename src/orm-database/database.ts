import { v4 as uuidv4 } from 'uuid';
import { OneUser, PotentialUser } from "../interfaces/database/User.interface"
import { delay } from './../utils/delay.js';

export class User {
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
      throw new Error('username filed required')

    if (!user.age)
      throw new Error('age filed required')

    if (!user.hobbies || !Array.isArray(user.hobbies))
      throw new Error('hobbies filed required')
  }

  static async all() {
    // simulate waiting from real BD
    await delay(Math.random())

    return this.users
  }

  static async create(user: PotentialUser): Promise<OneUser> {
    this.validatePotentialUser(user)
    
    await delay(Math.random())

    const newUser = new this(user)
    this.users.push(newUser)
    
    return newUser
  }
}