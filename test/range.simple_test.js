import assert from 'assert';
import create from '../src/range.simple';

describe('my test', function () {
    it('gives handle left offset from step', function () {
        const range = create({width: 500}, {width: 20}, 5);
        assert.equal(range.handleOffset(0), 0);
        assert.equal(range.handleOffset(1), 120);
        assert.equal(range.handleOffset(2), 240);
        assert.equal(range.handleOffset(3), 360);
        assert.equal(range.handleOffset(4), 480);
    });
    it('gives step from handle offset', function () {
        const range = create({width: 500}, {width: 20}, 5);

        assert.equal(range.stepFromOffset(-99), 0);

        assert.equal(range.stepFromOffset(0), 0);
        assert.equal(range.stepFromOffset(69), 0);

        assert.equal(range.stepFromOffset(71), 1);
        assert.equal(range.stepFromOffset(189), 1);

        assert.equal(range.stepFromOffset(190), 2);
        assert.equal(range.stepFromOffset(309), 2);

        assert.equal(range.stepFromOffset(311), 3);
        assert.equal(range.stepFromOffset(429), 3);

        assert.equal(range.stepFromOffset(431), 4);
        assert.equal(range.stepFromOffset(1200), 4);
    });
    it('gives handle position from offset', function () {
        const range = create({width: 500}, {width: 20}, 5);
        assert.equal(range.handlePositionFromOffset(0), 0);
        assert.equal(range.handlePositionFromOffset(100), 120);
        assert.equal(range.handlePositionFromOffset(300), 240);
        assert.equal(range.handlePositionFromOffset(350), 360);
        assert.equal(range.handlePositionFromOffset(490), 480);
    });
});
