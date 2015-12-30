/* global describe, it, beforeEach, afterEach */
// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.
var chai = require('chai'),
    sinon = require('sinon'),
    mockery = require('mockery'),
    Expect = chai.expect,
    mocks = {
        fs: {
            readFile: sinon.stub()
        },
        os: {
            platform: sinon.stub()
        }
    },
    index;

describe('CGroup Stats', function () {
    beforeEach(function () {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Object.keys(mocks).forEach(function (mock) {
            Object.keys(mocks[mock]).forEach(function (key) {
                mocks[mock][key] = sinon.stub();
            });
        });
        mockery.registerMock('fs', mocks.fs);
        mockery.registerMock('os', mocks.os);

        index = require('../index');
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should get expected data', function (done) {
        mocks.os.platform.returns('linux');
        mocks.fs.readFile.withArgs('/sys/fs/cgroup/memory/memory.usage_in_bytes').yieldsAsync(null, '6258688\n');
        mocks.fs.readFile.withArgs('/sys/fs/cgroup/memory/memory.max_usage_in_bytes').yieldsAsync(null, '9043968\n');
        mocks.fs.readFile.withArgs('/sys/fs/cgroup/cpuacct/cpuacct.stat').yieldsAsync(null, 'user 8\nsystem 21\n');
        index(function (error, data) {
            Expect(data).to.deep.equal({
                cpuacct: {
                    stat: {
                        user: 8,
                        system: 21
                    }
                },
                memory: {
                    usage_in_bytes: 6258688,
                    max_usage_in_bytes: 9043968
                }
            });
            Expect(error).to.be.null;
            done();
        });
    });

    it('should fail gracefully when unable to read file', function (done) {
        mocks.os.platform.returns('linux');
        mocks.fs.readFile.yieldsAsync(new Error('Zomg failure'));
        index(function (error, data) {
            Expect(data).to.be.undefined;
            Expect(error.toString()).to.match(/Error: Unable to read [\w.]+ - Error: Zomg failure/);
            done();
        });
    });

    it('should fail gracefully when running on non-linux', function (done) {
        mocks.os.platform.returns('darwin');
        mocks.fs.readFile.yieldsAsync(null, 'OK');
        index(function (error, data) {
            Expect(data).to.be.undefined;
            Expect(error.toString()).to.equal('Error: Unable to read CGroup Stats on non-Linux OS - darwin');
            done();
        });
    });
});
