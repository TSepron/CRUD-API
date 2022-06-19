import 'dotenv/config'
import { server } from './server.js'

const { PORT } = process.env

server
  .listen(PORT, () => {
    console.log(`Server start on PORT: ${PORT}`)
  })
  