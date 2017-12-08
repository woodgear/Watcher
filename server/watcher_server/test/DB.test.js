const DB = require('../src/models/DB');
const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');
const uuid = require('uuid/v4');

function del(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}
describe('getModel', () => {
  describe('#get', () => {
    let sandbox = null;
    const mockDbPath = './mockId.sqlite';
    beforeEach(() => {
      del(mockDbPath);
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      del(mockDbPath);
      sandbox.restore();
    });

    it.only('should return ssequelize db instance initDb', async () => {
      sandbox.stub(DB.prototype, 'getDbPath').callsFake(() => mockDbPath);
      const db = await new DB('mockId').get();
      expect(fs.existsSync(mockDbPath)).to.be.true;
      const model = db.WindowsProgram;
      const event = {
        startTime: '2017-12-09 02:03:07.622879200 +08:00',
        endTime: '2017-12-09 03:03:07.622879200 +08:00',
        duration: 60 * 60,
        tile: '"main.rs - Watcher - Visual Studio Code',
        name: 'Code.exe',
        path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
      }
      await model.create(event);
      const res = await model.find({ where: { name: 'Code.exe' }, raw: true });
      expect(res).to.include({
        startTime: '2017-12-08 18:03:07.622 +00:00',
        endTime: '2017-12-08 19:03:07.622 +00:00',
        duration: 3600,
        tile: '"main.rs - Watcher - Visual Studio Code',
        name: 'Code.exe',
        path: 'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe',
      });
    });
  });

  describe('#createSqlite3DbFile', () => {
    const dbPath = `./${uuid()}.sqlite`;
    beforeEach(() => {
      fs.unlinkSync(dbPath);
    });
    afterEach(() => {
      fs.unlinkSync(dbPath);
    });
    it('should create a sqlite db', async () => {
      const db = await new DB('mockId').createSqlite3DbFile(dbPath);
      expect(fs.existsSync(dbPath)).to.be.true;
    });
  });

});