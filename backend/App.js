const Koa = require('koa');
const Router = require('koa-router');
const db = require('./database');

async function initServer(config,db) {
const Database = await db.initDatabase(config);
const router = new Router();
}


