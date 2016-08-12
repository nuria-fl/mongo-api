var limitItems = function(req){
	var lim = 0;
	if (req.query.limit) {
		lim = req.query.limit;
	}
	return parseInt(lim);
};

module.exports = limitItems;