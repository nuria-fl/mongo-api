var filter = function(req){
	var oFilter = {};

	if (req.query.show) {
		var toShow = req.query.show.split(',');
		toShow.forEach(function(elem){
			oFilter[elem] = 1;
		});
	}			
	if(req.query.hide){
		var toHide = req.query.hide.split(',');	
		toHide.forEach(function(elem){
			oFilter[elem] = 0;
		});
	}
	return oFilter;
}

module.exports = filter;