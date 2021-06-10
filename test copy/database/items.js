
module.exports = {
	item: {
		userId:{ type: String, required: true},
		hrId:{ type: String, required: true},
		title: { type: String, required: true},
		question: { type: String, required: true },
		answer: {type: String, require:true},
		ifUsed:{ type: String, required: true}
	}
}; 