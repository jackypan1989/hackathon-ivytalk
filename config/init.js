
module.exports = function () {
	/**
	 * MongoDB init
	 */
	require('../config/db');

	/**
	 * load sentiment data
	 */
	require('../services/sentiment').load();	
};
