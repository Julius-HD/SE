var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");
var items = require("./items");

for(var m in models){ 
	mongoose.model(m,new Schema(models[m]));
}
for (var m in items){
	mongoose.model(m,new Schema(items[m]));
}

itdb.create({ 							// 创建一组item对象置入items
    userId:"null",
    hrId:"null",
    title: "req.body.nt",
    question: "req.body.nq",
    answer: "req.body.na",
    ifUsed:0
})
module.exports = { 
	getModel: function(type){ 
		return _getModel(type);
	}
};

var _getModel = function(type){ 
	return mongoose.model(type);
};