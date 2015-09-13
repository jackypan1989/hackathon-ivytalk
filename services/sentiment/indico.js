var indico = require('indico.io');
indico.apiKey = 'd9c003c0cc29ea72e2931819000803aa';

function transform (res) {
	if (res === 0) return 0;
	return (res - 0.3) * 3;
}

exports.getScore = function (sentence, cb) {
	indico.sentiment(sentence)
  		.then(function (res) {
    		cb(null, transform(res));
  		}).catch(function (err) {
    		cb(err);
  		});
};