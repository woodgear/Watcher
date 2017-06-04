class Control {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    save() {
        const data = this.req.body;
        console.log('rece =>',data)
        this.res.json(data);
    }
}



module.exports = Control;
