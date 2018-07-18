import fs from 'fs'
import setupSocketIO from './websockets'

const isDev = process.env.NODE_ENV !== 'production'

let server
const serverHandler = (req, res) => {
  res.writeHead(404)
  res.end()
}

if (isDev) {
  // eslint-disable-next-line
  server = require('https').Server(
    {
      key: fs.readFileSync('./certs/server.key'),
      cert: fs.readFileSync('./certs/server.crt'),
    },
    serverHandler,
  )
} else {
  // eslint-disable-next-line
  server = require('http').Server(serverHandler)
}

setupSocketIO(server)

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  const MODE = isDev ? 'Development' : 'Production'
  console.log(`${MODE}: Server running on localhost:${PORT}`)
})
