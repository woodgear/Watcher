const BaseReporter = require('./baseReporter');
const SAVE_DURATION = 5;//the max time to save db;
const lastEvent = {};
class WindowsProgram extends BaseReporter {
    async create() {
        try {
            this._create();
        } catch (error) {
            console.log(error);
            this.res.sendStatus(500);
        }
    }
    async _create() {
        const body = this.req.body;
        console.log(this.id,this.name);
        console.log(body);
        this.res.sendStatus(200);
    }
}
module.exports = WindowsProgram;