// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.
var path = require('path'),
    fs = require('fs'),
    os = require('os'),
    async = require('async'),
    object2dot = require('object2dot'),
    BASE_PATH = '/sys/fs/cgroup/';

/**
 * Parse the contents of the file we just read
 * @method parseFile
 * @param  {String}   key      What group.item to read
 * @param  {String}   data     Contents of the file
 * @param  {Function} callback Function to call when done (err, parsed object)
 */
function parseFile(key, data, callback) {
    var output = {};

    switch (key) {
        case 'cpuacct.stat':
            // Comes in as "user 10\nsystem 20\n"
            data.split('\n').forEach(function (line) {
                var split = line.split(' ');
                output[key + '.' + split[0]] = parseInt(split[1], 10);
            });
            break;

        case 'memory.usage_in_bytes':
        case 'memory.max_usage_in_bytes':
            output[key] = parseInt(data, 10);
            break;
    }

    callback(null, output);
}

/**
 * Read UTF-8 files from the base directory in the format of:
 *   $base/$group/$group.$item
 * @method readFile
 * @param  {String}   key      What group.item to read
 * @param  {Function} callback Function to call when done (err, parsed object)
 */
function readFile(key, callback) {
    var group = key.split('.')[0];
    fs.readFile(path.join(BASE_PATH, group, key), 'utf8', function (err, data) {
        if (err) {
            return callback(new Error('Unable to read ' + key + ' - ' + err.toString()));
        }

        parseFile(key, data.toString().trim(), callback);
    });
}

/**
 * Get usage information about the cgroup we are in
 * @method cgroup-stats
 * @param  {Function} [callback] Function to call when done (error, data)
 */
module.exports = function (callback) {
    var dataPoints = {
        'cpuacct.stat': '',
        'memory.usage_in_bytes': '',
        'memory.max_usage_in_bytes': ''
    };

    if (os.platform() !== 'linux') {
        return callback(new Error('Unable to read CGroup Stats on non-Linux OS - ' + os.platform()));
    }

    async.forEachOf(dataPoints, function (value, key, next) {
        readFile(key, function (err, data) {
            if (err) {
                return next(err);
            }

            Object.keys(data).forEach(function (index) {
                dataPoints[index] = data[index];
            });

            next();
        });
    }, function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null, object2dot.rebuild(dataPoints));
    });
};
