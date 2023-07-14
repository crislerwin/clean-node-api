import paths from './paths'
import schemas from './schemas'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores',
    version: '1.0',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }],
  paths,
  schemas,
  components,
}
