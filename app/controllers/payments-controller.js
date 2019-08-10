const PaymentAggregator = require('../aggregators/payment-aggregator');
const aggregator = new PaymentAggregator();

module.exports.getPayments = function (req, res) {
    aggregator.getUsersPayment(req.query.season)
    .then(payments => {
        console.log('Serving request: ' + req.url + ' to user ' + req.jwtPayload.email);
        res.send(payments);
    })
    .catch(err => {
        console.log(err);
        res.send({
            status: 'error',
            message: error
        });
    })
}