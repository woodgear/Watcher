const BaseReporter = require('./baseReporter');
const { DB } = require('../models/DB');
const WpModel = require('../models/WindowsProgramModel');
const { timeDiff, strEqual } = require('../util/util');
class WindowsProgram extends BaseReporter {
    async create() {
        try {
            const res = await this._create();
            this.res.sendStatus(200);

        } catch (error) {
            console.log(error);
            this.res.sendStatus(500);
        }
    }
    async get() {
        try {
            console.log('getAll',this.id);
            const model = new WpModel(this.id);
            const data = await model.getAll();
            this.res.json(data)
        } catch (error) {
            console.log(error);
            this.res.sendStatus(500);
        }
    }

    isSameEvent(lastEvent, event) {
        if (!lastEvent) {
            return false;
        }
        if (strEqual(lastEvent.name, event.name) && strEqual(lastEvent.title, event.title) && timeDiff(event.startTime, lastEvent.endTime) <= 5) {
            return true;
        }
        return false;
    }
    expandLastEvent(lastEvent, event) {
        const newEvent = lastEvent;
        newEvent.endTime = event.endTime;
        newEvent.duration = timeDiff(newEvent.endTime, newEvent.startTime);
        return newEvent;
    }
    buildNewEvent(event) {
        return {
            startTime: event.now,
            endTime: event.now,
            duration: 0,
            tile: event.title,
            name: event.name,
            path: event.path,
        }
    }

    async updateLastEvent(event) {
        const db = await new DB(this.id).get();
        const model = db.WindowsProgram;
        const lastEvent = await model.findOne({ order: [['createdAt', 'DESC']] });
        if (lastEvent) {
            await lastEvent.update(event)
        } else {
            throw new Error('could not update while lastevent is null')
        }
    }

    async getLastEvent() {
        const db = await new DB(this.id).get();
        const model = db.WindowsProgram;
        const event = await model.findOne({ order: [['createdAt', 'DESC']], raw: true });
        return event;
    }

    async ceateNewEvent(event) {
        const db = await new DB(this.id).get();
        const model = db.WindowsProgram;
        await model.create(event);
    }

    async _create() {
        const newEvent = this.buildNewEvent(this.req.body);
        console.log(newEvent);
        const lastEvent = await this.getLastEvent();
        if (this.isSameEvent(lastEvent, newEvent)) {
            const updatedLastEvent = this.expandLastEvent(lastEvent, newEvent);
            await this.updateLastEvent(updatedLastEvent);
        } else {
            await this.ceateNewEvent(newEvent);
        }
    }
}
module.exports = WindowsProgram;