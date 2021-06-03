module.exports = { 
	user:{ 
		name:{type:String,required:true},
		password: { type: String, required: true },
		identity: { type: String, required: false }
	},
	userM:{
		name:{type:String,required:true},
		password: { type: String, required: true },
		identity: { type: String, required: false }

	}
};