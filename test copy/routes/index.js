var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res,next) {
  res.render('index', { title: 'Express' });    // 到达此路径则渲染index文件，并传出title值供 index.html使用
});

var identity=null;
//面试官登录
router.route("/loginM").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render("loginM",{title:'HR Login'});
}).post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
	//get User info
	 //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
	var User = global.dbHandel.getModel('userM');  
	var uname = req.body.uname;				//获取post上来的 data数据中 uname的值
	User.findOne({name:uname},function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
		if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
			res.send(500);
			console.log(err);
		}else if(!doc){ 								//查询不到用户名匹配信息，则用户名不存在
			req.session.error = '用户名不存在';
			res.send(404);							//	状态码返回404
		//	res.redirect("/login");
		}else{ 
			if(req.body.upwd != doc.password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
				req.session.error = "密码错误";
				res.send(404);
			//	res.redirect("/login");
			}else{ 									//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				req.session.user = doc;
				identity = req.session.user;
				console.log(req.session.user);
				res.send(200);
			//	res.redirect("/home");
			}
		}
	});
});

/* 面试官注册 */
router.route("/registerM").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
	res.render("registerM",{title:'HR register'});
}).post(function(req,res){ 
	 //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
	var User = global.dbHandel.getModel('userM');
	var uname = req.body.uname;
	var upwd = req.body.upwd;
	User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式
		if(err){ 
			res.send(500);
			req.session.error =  '网络异常错误！';
			console.log(err);
		}else if(doc){ 
			req.session.error = '此面试官账号已存在！';
			res.send(500);
		}else{ 
			User.create({ 							// 创建一组user对象置入model
				name: uname,
				password: upwd,
				indentity: "HR"
			},function(err,doc){ 
				 if (err) {
                        res.send(500);
                        console.log(err);
                    } else {
                        req.session.error = '面试官账号创建成功！';
                        res.send(200);
                    }
                  });
		}
	});
});

//面试官界面
router.get("/homeM",function(req,res, next){ 
	if(!req.session.user){ 					
		req.session.error = "面试官未登录"
		res.redirect("/loginM");				
	}
	res.render("homeM",{title:'Home'});         //已登录则渲染home页面
	// next();
});
//跳转历史记录
router.get("/homeM/historyrepositories", function (req, res, next) {
	if (!req.session.user) {
		req.session.error = "面试官未登录"
		res.redirect("/loginM");
	}
	res.render("historyrepositories", { title: '历史记录' });         //已登录则渲染home页面
	// next();
});

//跳转邀请
router.get("/homeM/repositoriesM", function (req, res, next) {
	if (!req.session.user) {
		req.session.error = "面试官未登录"
		res.redirect("/loginM");
	}
	res.render("repositoriesM", { title: '邀请' });         //已登录则渲染home页面
	// next();
});

//邀请出题
router.get("/homeM/doItemM", function (req, res, next) {
	if (!req.session.user) {
		req.session.error = "面试官未登录"
		res.redirect("/loginM");
	}
	res.render("doItemM", { title: '题库' });         //已登录则渲染home页面
	// next();
});

//增加题目，邀请人答题
router.get("/homeM/add", function (req, res, next) {
	if (!req.session.user) {
		req.session.error = "面试官未登录"
		res.redirect("/loginM");
	}
	res.render("add", { title: 'Home' });         //已登录则渲染home页面
	var db = global.dbHandel.getModel('items');
	db.create({ 							// 创建一组item对象置入items
		index: db.find().count() + 1,
		title: req.body.title,
		question: req.body.question,
		exampleIn: req.body.question,
		exampleOut: req.body.exampleOut,
		answer: req.body.answer
	}, function (err, doc) {
		if (err) {
			res.send(500);
			console.log(err);
		} else {
			req.session.error = '题目添加成功！';
			res.send(200);
		}
	});
});

//修改题目
router.get("/homeM/revise", function (req, res, next) {
	if (!req.session.user) {
		req.session.error = "面试官未登录"
		res.redirect("/loginM");
	}
	res.render("revise", { title: 'Home' });         //已登录则渲染home页面
	// next();
});

//---------------------------------------------面试者↓-----------------------------------



/* 面试者登录 */
router.route("/login").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render("login",{title:'User Login'});
}).post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
	//get User info
	 //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
	var User = global.dbHandel.getModel('user');  
	var uname = req.body.uname;				//获取post上来的 data数据中 uname的值
	console.log(req.query);
	console.log(req.body);
	User.findOne({name:uname},function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
		if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
			res.send(500);
			console.log(err);
		}else if(!doc){ 								//查询不到用户名匹配信息，则用户名不存在
			req.session.error = '用户名不存在';
			res.send(404);							//	状态码返回404
		//	res.redirect("/login");
		}else{ 
			if(req.body.upwd != doc.password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
				req.session.error = "密码错误";
				res.send(404);
			//	res.redirect("/login");
			}else{ 									//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				req.session.user = doc;
				res.send(200);
			//	res.redirect("/home");
			}
		}
	});
});

/* 面试者注册 */
router.route("/register").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
	res.render("register",{title:'User register'});
}).post(function(req,res){ 
	 //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
	var User = global.dbHandel.getModel('user');
	var uname = req.body.uname;
	var upwd = req.body.upwd;
	User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式
		if(err){ 
			res.send(500);
			req.session.error =  '网络异常错误！';
			console.log(err);
		}else if(doc){ 
			req.session.error = '用户名已存在！';
			res.send(500);
		}else{ 
			User.create({ 							// 创建一组user对象置入model
				name: uname,
				password: upwd
			},function(err,doc){ 
				 if (err) {
                        res.send(500);
                        console.log(err);
                    } else {
                        req.session.error = '用户名创建成功！';
                        res.send(200);
                    }
                  });
		}
	});
});
var queryId;
/* GET home page. */
router.get("/home",function(req,res, next){ 
	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录"
		res.redirect("/login");				//未登录则重定向到 /login 路径
	}
	queryId = req.query;
	console.log(queryId);
	
	res.render("home",{title:'Home'});         //已登录则渲染home页面
	// next();
});

/* GET 登出 page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.session.useer = null;
	req.session.error = null;
	res.redirect("/");
});

//提交代码界面
router.get("/home/submit", function(req, res, next){
	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录"
		res.redirect("/login");				//未登录则重定向到 /login 路径
	}
	res.render("submit", {title:"submit items"});

});

//题库界面
router.get("/home/repositories", function(req, res, next){
	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录"
		res.redirect("/login");				//未登录则重定向到 /login 路径
	}
	res.render("repositories", {title:"submit items"});

});

//练习题
router.get("/home/item_i", function (req, res, next) {
	if (!req.session.user) { 					//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录"
		res.redirect("/login");				//未登录则重定向到 /login 路径
	}
	res.render("item_i", { title: "do items" });

});


//做面试题题界面doItem
router.get("/home/doItem", function (req, res, next) {
	if (!req.session.user) { 					//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录"
		res.redirect("/login");				//未登录则重定向到 /login 路径
	}
	res.render("doItem", { title: "do hr's items" });

});


module.exports = router;
