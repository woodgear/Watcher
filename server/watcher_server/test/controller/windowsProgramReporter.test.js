const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const { DB } = require('../../src/models/DB');
const wpModel = require('../../src/models/WindowsProgramModel')
const Controller = require('../../src/controller/windowsProgramReportContrller');
function del(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
describe('WindowsReport', () => {
    let sandbox = null;
    const mockDbPath = path.join(__dirname, './mockId.sqlite');

    describe('#expandLastEvent', () => {
        const mockReq = {
            headers: { id: 'mockId', name: 'virtual-kaka' },
            body: ''
        }
        const mockRes = {}
        const Cases = [
            {
                last: {
                    startTime: '2017-12-09 02:03:07.622879200 +08:00',
                    endTime: '2017-12-09 02:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                },
                new: {
                    startTime: '2017-12-09 02:03:07.622879200 +08:00',
                    endTime: '2017-12-09 04:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                }, expect: {
                    startTime: '2017-12-09 02:03:07.622879200 +08:00',
                    endTime: '2017-12-09 04:03:07.622879200 +08:00',
                    duration: 60 * 60 * 2,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                },
            }];
        Cases.forEach((c) => {
            const res = new Controller(mockReq, mockRes).expandLastEvent(c.last, c.new);
            it('should ok', () => {
                expect(res).to.be.deep.equal(c.expect);

            });
        })
    });

    describe('#isSameEvent', () => {
        const mockReq = {
            headers: { id: 'mockId', name: 'virtual-kaka' },
            body: ''
        }
        const mockRes = {}
        const Cases = [
            {
                last: null,
                new: {
                    startTime: '2017-12-09 02:03:07.622879200 +08:00',
                    endTime: '2017-12-09 02:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                }, expect: false,
            },
            {
                last: {
                    startTime: '2017-12-09 02:03:07.622879200 +08:00',
                    endTime: '2017-12-09 02:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                },
                new: {
                    startTime: '2017-12-09 02:03:07.622879200 +08:00',
                    endTime: '2017-12-09 02:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                }, expect: true,
            },
            {
                last: {
                    startTime: '2017-12-09 02:03:07.622879200 +08:00',
                    endTime: '2017-12-09 04:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                },
                new: {
                    startTime: '2017-12-09 05:03:07.622879200 +08:00',
                    endTime: '2017-12-09 05:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                }, expect: false,
            },
            {
                last: {
                    startTime: '2017-12-09 05:03:07.622879200 +08:00',
                    endTime: '2017-12-09 05:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"main.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                },
                new: {
                    startTime: '2017-12-09 05:03:07.622879200 +08:00',
                    endTime: '2017-12-09 05:03:07.622879200 +08:00',
                    duration: 0,
                    title: '"min.rs - Watcher - Visual Studio Code',
                    name: 'Code.exe',
                    path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
                }, expect: false,
            },

        ];
        Cases.forEach((c) => {
            const res = new Controller(mockReq, mockRes).isSameEvent(c.last, c.new);
            it('should ok', () => {
                expect(res).to.be.equal(c.expect);

            });
        })
    });

    describe("create", () => {
        beforeEach(() => {
            del(mockDbPath);
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            // del(mockDbPath);
            sandbox.restore();
        });

        it('should ok', async () => {

            const events = [
                {
                    now: '2017-12-09 02:03:07.622879200 +08:00',
                    title: 'main.rs',
                    name: 'Code.exe',
                    path: 'test',
                },
                {
                    now: '2017-12-09 02:03:08.622879200 +08:00',
                    title: 'main.rs',
                    name: 'Code.exe',
                    path: 'test',
                },
                {
                    now: '2017-12-09 02:03:08.622879200 +08:00',
                    title: 'main.rs',
                    name: 'Code.exe',
                    path: 'test',
                },//event1
                {
                    now: '2017-12-09 03:04:07.622879200 +08:00',
                    title: 'main.rs',
                    name: 'Code.exe',
                    path: 'test',
                },
                {
                    now: '2017-12-09 03:04:10.622879200 +08:00',
                    title: 'main.rs',
                    name: 'Code.exe',
                    path: 'test',
                },//event2
                {
                    now: '2017-12-09 11:04:10.622879200 +08:00',
                    title: 'main.rs',
                    name: 'Code.exe',
                    path: 'test',
                },
                {
                    now: '2017-12-09 11:04:15.622879200 +08:00',
                    title: 'main.rs',
                    name: 'Code.exe',
                    path: 'test',
                },//event3
            ];
            const mockRes = {
                sendStatus: (status) => {
                    console.log('send status ', status);
                }
            }

            sandbox.stub(DB.prototype, 'getDbPath').callsFake(() => mockDbPath);
            for (data of events) {
                const mockReq = {
                    headers: { id: 'mockId', name: 'virtual-kaka' },
                    body: data
                }
                const con = new Controller(mockReq, mockRes);
                await con.create();
            }

            const wp = new wpModel('mockId');
            const all = await wp.getAll();
            expect(all).to.be.deep.equal([{
                startTime: 'Sat Dec 09 2017 02:03:07 GMT+0800',
                endTime: 'Sat Dec 09 2017 02:03:08 GMT+0800',
                duration: 1,
                tile: 'main.rs',
                name: 'Code.exe',
                path: 'test'
            },
            {
                startTime: 'Sat Dec 09 2017 03:04:07 GMT+0800',
                endTime: 'Sat Dec 09 2017 03:04:10 GMT+0800',
                duration: 3,
                tile: 'main.rs',
                name: 'Code.exe',
                path: 'test'
            },
            {
                startTime: 'Sat Dec 09 2017 11:04:10 GMT+0800',
                endTime: 'Sat Dec 09 2017 11:04:15 GMT+0800',
                duration: 5,
                tile: 'main.rs',
                name: 'Code.exe',
                path: 'test'
            }])
            const pickRes = await wp.getRange('2017-12-09 02:03:07.622879200 +08:00', '2017-12-09 03:04:10.622879200 +08:00');
            expect(pickRes).to.be.deep.equal([{
                startTime: 'Sat Dec 09 2017 02:03:07 GMT+0800',
                endTime: 'Sat Dec 09 2017 02:03:08 GMT+0800',
                duration: 1,
                tile: 'main.rs',
                name: 'Code.exe',
                path: 'test'
            },
            {
                startTime: 'Sat Dec 09 2017 03:04:07 GMT+0800',
                endTime: 'Sat Dec 09 2017 03:04:10 GMT+0800',
                duration: 3,
                tile: 'main.rs',
                name: 'Code.exe',
                path: 'test'
            }]);
        });
    })
});