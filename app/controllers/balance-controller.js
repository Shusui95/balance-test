const BalanceAggregator = require('../aggregators/balance-aggregator');
const aggregator = new BalanceAggregator();

module.exports.getBalances = function (req, res) {
    aggregator.getUsersBalance()
    .then(balances => {
        console.log('Serving request: ' + req.url);
        res.send(balances);
    })
    .catch(err => {
        console.log(err);
        res.send({
            status: 'error',
            message: error
        });
    })
};