const { timeDiff } = require('../../src/util/util');
const expect = require('chai').expect;

describe('timeDiff', () => {
    const cases = [
        { l: '2017-12-09 04:03:07.622879200 +08:00', r: '2017-12-09 03:03:07.622879200 +08:00', expect: 60 * 60 },
    ];
    cases.forEach((c) => {
        it('should ok ', () => {
            let res = timeDiff(c.l, c.r);
            expect(res).to.be.equal(c.expect);
        })
    })
});