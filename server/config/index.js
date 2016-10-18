'use strict';

var _ = require('lodash');

var all = {
    env:    process.env.NODE_ENV || 'development',
    root:   process.cwd(),
    port: 	process.env.PORT || 8100
};

module.exports = _.merge(
    all,
    require('./' + all.env + '.js') || {});