'use strict'

const Koa = require('koa')
const KoaRouter = require('koa-router')
const koaLogger = require('koa-bunyan-logger')
const koaBody = require('koa-bodyparser')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')

const schema = require('./graphql/schema')

const app = new Koa()
const router = new KoaRouter()
const PORT = 3000

router.post('/graphql', graphqlKoa({
  tracing: process.env.NODE_ENV === 'production',
  cacheControl: true,
  schema
}))

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

app.use(koaBody())
app.use(koaLogger())
app.use(koaLogger.requestIdContext())
app.use(koaLogger.requestLogger())
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT)
