var request = require('request');

var BASE_URL = "https://bernoulli.herokuapp.com/client/api/experiments/";

var getExperiments = function(options, successCallback, failureCallback) {
    if (!options.clientId) {
        throw new Error("clientId option not passed in");
    }

    var experimentIds = options.experimentIds;
    if (experimentIds != null && Array.isArray(experimentIds)) {
        experimentIds = experimentIds.join(',');
    }

    request({
        url: BASE_URL,
        json: true,
        qs: {
            clientId: options.clientId,
            experimentIds: experimentIds,
            userId: options.userId,
            bucketIfNecessary: options.bucketIfNecessary || true,
            segmentData: options.segmentData
        }
    }, function(error, response, body) {
        if (body['status'] == 'ok') {
            successCallback(body['value']);
        } else {
            failureCallback(body['message']);
        }
    });
};

var goalAttained = function(options, callback) {
    request.post({
        url: BASE_URL,
        json: true,
        form: {
            clientId: options.clientId,
            experimentId: options.experimentId,
            userId: options.userId
        }
    }, function(error, response, body) {
        callback(body['status'] == 'ok');
    })
};

exports.getExperiments = getExperiments;
exports.goalAttained = goalAttained;
