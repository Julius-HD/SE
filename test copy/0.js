var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
var Fiber = require('fibers');

global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/nodedb");

// var arr= new Array();
// // arr.push(1);
let arr=[];
var items = global.dbHandel.getModel('item');
t=items.find({}, function(err, doc){
    if(err){
        console.log('err')
    }
    else if (doc){
        // console.log(doc)
        arr.push(doc)

    }
})
console.log(t)
// for (var i in items.find())
// {
//     console.log(i);
// }
// console.log(arr.length);

let result = []; //存放查询结果
sqlFiber=Fiber.current;
items.find({userId:'null'}, (err, doc) => {
            if (err) {
                console.log(err);
                res.json({ code: -1, msg: '查询失败'});
                return;
            } else {
                doc.map((item) => {
                    items.findOne({phone:item.phone},'name IDcard bank bankCard bank_area bank_name', (err, bankInfo) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let obj = {};
                            Object.assign(obj, JSON.parse(JSON.stringify(item)), JSON.parse(JSON.stringify(bankInfo)));
                            result.push(obj);
                            console.log(result.length);
                        }
                    })
                });
                Fiber.yield();
                console.log('***')
                return;}
            }
)


Fiber(function () {
    var httpFiber = Fiber.current;
    var html = "";
    http.get("http://www.baidu.com", function (res) {
        var dataFiber = Fiber.current;
        res.on("data", function (data) {
            html += data;
        });
        res.on("end", function (data) {
            httpFiber.run();
        });
    });
    Fiber.yield();
    console.log(html);
}).run();