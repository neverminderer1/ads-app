'use strict';

var _ = require('lodash');
var fs   = require('fs');

var all = {
    env:    process.env.NODE_ENV || 'development',
    root:   process.cwd(),
    port: 	process.env.PORT || 8100,
    secrets: 		{
        session:  fs.readFileSync(__dirname + '/private.key')
    }
};

module.exports = _.merge(
    all,
    require('./' + all.env + '.js') || {});