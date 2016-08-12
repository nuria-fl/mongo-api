var pagination = function(req){
	var itemsToSkip = 0;
	if (req.query.page) {
		var page = req.query.page - 1;
		itemsToSkip = req.query.limit * page;
	}	
	return parseInt(itemsToSkip);
};

module.exports = pagination;