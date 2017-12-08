class BaseReporter {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.id = req.headers.id;
        this.name = req.headers.name || '';
    }
}
module.exports = BaseReporter;