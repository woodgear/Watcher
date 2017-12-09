const fs = require('fs');
const path = require("path");

const Sequelize = require('sequelize');
const Sqlite3 = require('sqlite3').verbose();

const dbInstance = {};

class DB {
    constructor(id) {
        this.id = id;
        this._dbInstance = null;
    }

    async createSqlite3DbFile(DBpath) {
        const res = await new Promise((res, rej) => {
            const db = new Sqlite3.Database(DBpath, (e) => {
                if (e) {
                    rej(e)
                }
                db.close();
                res()
            });
        });
    }
    async get() {
        try {
            const dbPath = this.getDbPath();
            if (!fs.existsSync(dbPath)) {
                await this.createSqlite3DbFile(dbPath);
                dbInstance[this.id] = null;
            }

            if (!dbInstance[this.id]) {
                const db = await this.initDB();
                this._dbInstance = db;
                dbInstance[this.id] = this._dbInstance;
            }
            Object.assign(this, dbInstance[this.id].models);
            return this;
        } catch (error) {
            console.log(error);
            throw new Error(`could not get db instance of ${this.id}`, error)
        }
    }

    getDbPath() {
        return path.normalize(path.join(__dirname, '../', '../', 'data', `${this.id}.sqlite`));
    }
    async initDB() {
        const dbPath = this.getDbPath();

        const db = new Sequelize({
            operatorsAliases: false,
            database: this.id,
            dialect: 'sqlite',
            storage: dbPath,
            logging: false,
            freezeTableName: true,
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

async function getModel(id, name) {
    const db = await new DB(id).get();
    return db[name];
}

module.exports = { DB, getModel };