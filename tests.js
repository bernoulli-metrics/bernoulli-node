var nock = require('nock');
var bernoulli = require ('./index.js');

exports.test_no_client_id = function(test, assert) {
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

exports.test_calls_success = function(test, assert) {
    nock('http://localhost:5000')
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

exports.test_calls_failure = function(test, assert) {
    nock('http://localhost:5000')
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

//bernoulli.getExperiments({
//        clientId: 1,
//        experimentIds: ['signup'],
//        userId: 'user59'
//    },
//    function(experiments) {
//        console.log(experiments);
//        bernoulli.goalAttained({
//            clientId: 1,
//            experimentId: 'signup',
//            userId: 'user59'
//        }, function(success) {
//            console.log(success);
//        });
//    },
//
//    function(errorMessage) {
//        console.log(errorMessage);
//    });
//
//
