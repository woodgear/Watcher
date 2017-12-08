const fs = require('fs');
const path = require("path");

const Sequelize = require('sequelize');
const Sqlite3 = require('sqlite3');

const dbInstance = {};

class DB {
    constructor(id, path) {
        this.id = id;
        this._dbInstance = null;
    }

    async createSqlite3DbFile(DBpath) {
        return new Promise((res, rej) => {
            const db = new Sqlite3.Database(DBpath, (e) => {
                if (e) {
                    rej(e)
                }
                res(e)
            })
            db.close();
        })
    }
    async get() {
        if (!dbInstance[this.id]) {
            const db = await this.initDB();
            this._dbInstance = db;
            dbInstance[this.id] = this._dbInstance;
        }
        Object.assign(this, this._dbInstance.models);
        return this;
    }

    getDbPath() {
        return path.normalize(path.join(__dirname, '../', '../', 'data', `${this.id}.sqlite`));
    }
    async initDB() {
        const dbPath = this.getDbPath();
        if (!fs.existsSync(dbPath)) {
            await this.createSqlite3DbFile(dbPath);
        }
        const db = new Sequelize({
            operatorsAliases: false,
            database: this.id,
            dialect: 'sqlite',
            storage: dbPath
        });
        const schemaDir = path.join(__dirname, 'schemas');
        fs.readdirSync(schemaDir).forEach((filename) => {
            const modelPath = path.join(schemaDir, filename)
            db.import(modelPath);
        });
        await db.sync();
        return db;
    }
}

module.exports = DB;