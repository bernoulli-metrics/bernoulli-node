var nock = require('nock');
var bernoulli = require ('./index.js');

exports.test_get_experiments_no_client_id = function(test, assert) {
    var threwException = false;
    try {
        bernoulli.getExperiments({
            userId: '1',
            experimentIds: ['first']
        });
    } catch (e) {
        threwException = true;
    }

    assert.equal(true, threwException);
    test.finish();
};

exports.test_get_experiments_success = function(test, assert) {
    nock('https://bernoulli.herokuapp.com')
        .filteringPath(function(path) {
            return '/';
        })
        .get('/')
        .reply(200, {
            status: 'ok',
            value: [{
                id: 1,
                name: 'test experiment'
            }]
        });

    bernoulli.getExperiments({
        clientId: 1,
        userId: '1',
        experimentIds: ['first']
    }, function(experiments) {
        assert.equal(experiments.length, 1);
        assert.equal(experiments[0]['name'], 'test experiment');
        test.finish();
    });
};

exports.test_get_experiments_failure = function(test, assert) {
    nock('https://bernoulli.herokuapp.com')
        .filteringPath(function(path) {
            return '/';
        })
        .get('/')
        .reply(200, {
            status: 'error',
            message: 'Invalid experimentId'
        });

    bernoulli.getExperiments({
        clientId: 1,
        userId: '1',
        experimentIds: ['first']
    }, function(experiments) {
    }, function(message) {
        assert.equal(message, 'Invalid experimentId');
        test.finish();
    });
};

exports.test_goal_attained = function(test, assert) {
    nock('https://bernoulli.herokuapp.com')
        .post('/client/api/experiments/')
        .reply(200, {
            status:  'ok',
            value: true
        });

    bernoulli.goalAttained({
        clientId: 1,
        userId: '1',
        experimentId: 'first'
    }, function(success) {
        assert.equal(success, true);
        test.finish();
    });
};