const { getModel } = require('./DB');
const Op = require('sequelize').Op;
const moment = require('moment');
class WindowsProgramModel {
    constructor(id) {
        this.id = id;
    }
    static format(arr) {
        return arr.map((x) => {
            const item = x;
            item.startTime = moment(new Date(item.startTime)).toLocaleString();
            item.endTime = moment(new Date(item.endTime)).toLocaleString();
            delete item.createdAt;
            delete item.updatedAt;
            delete item.id;
            return item;
        });
    }
    async create(data) {
        const model = await getModel(this.id, 'WindowsProgram');
    }
    async updateLast(event) {

    }
    async getLast() {

    }
    async getAll() {
        const model = await getModel(this.id, 'WindowsProgram');
        const res = await model.findAll({ raw: true });
        return WindowsProgramModel.format(res);
    }
    async getRange(leftDate, rightDate) {
        console.log(leftDate, rightDate);
        const left = new Date(leftDate);
        const right = new Date(rightDate);

        console.log(left, right);
        const model = await getModel(this.id, 'WindowsProgram');
        const res = await model.findAll({
            where: {
                startTime: {
                    [Op.gte]: left
                },
                endTime: {
                    [Op.lte]: right
                }
            },
            raw: true,
        });
        return WindowsProgramModel.format(res);
    }
}

module.exports = WindowsProgramModel;