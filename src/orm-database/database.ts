import { OneUser } from "../interfaces/database/User.interface"
import { delay } from './../utils/delay.js';

export class User {
  private static users: OneUser[] = []

  static async all() {
    // simulate waiting from real BD
    await delay(0.5)

    return this.users
  }
}