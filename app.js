var express = require('express');
var app = express();

app.listen(3000, function () {
    console.log("开启3000端口");
})

var Promise = require("bluebird");
var fs = require("fs");
//方法Promise化
var readFileAsync = Promise.promisify(fs.readFile);

//.spread([Function fulfilledHandler] [, Function rejectedHandler ]) -> Promise
//用法:将结果集拆分
//example
Promise.delay(0).then(function () {
    return [
        readFileAsync('1.txt', 'utf-8'),
        readFileAsync('2.txt', 'utf-8'),
        readFileAsync('3.txt', 'utf-8')
    ];
}).spread(function (file1, file2, file3) {
    console.log(file1);
    console.log(file2);
    console.log(file3);
})

//.finally(Function handler) -> Promise
//类似try..catch..finally中finally的作用
//example
Promise.delay(0).then(function () {
    return [
        readFileAsync('1.txt', 'utf-8'),
        readFileAsync('2.txt', 'utf-8'),
        readFileAsync('4.txt', 'utf-8')
    ];
}).spread(function (file1, file2, file3) {
    console.log(file1);
    console.log(file2);
    console.log(file3);
}).catch(function (e) {
    console.log(e);
}).finally(function () {
    //抛错最后仍执行finally中的内容；
    console.log(4)
})

//Promise.join(Promise|Thenable|value promises..., Function handler) -> Promise
//将几个promise化的函数join起来，用法有点类似spread
//example
var join = Promise.join;
join(readFileAsync('1.txt', 'utf-8'),
    readFileAsync('2.txt', 'utf-8'),
    readFileAsync('3.txt', 'utf-8'), function (file1, file2, file3) {
        return parseInt(file1) + parseInt(file2) + parseInt(file3);
    }).then(function (content) {
        console.log("SUM结果:" + content);
    })

//Synchronous inspection 同步检测
//example
var rf1 = readFileAsync('1.txt', 'utf-8');
var rf2 = readFileAsync('2.txt', 'utf-8');
var rf3 = readFileAsync('3.txt', 'utf-8');
var join = Promise.join;
join(rf1, rf2, rf3, function (file1, file2, file3) {
    return parseInt(file1) + parseInt(file2) + parseInt(file3);
}).then(function (content) {
    console.log("SUM结果:" + content);
}).finally(function () {
    //.isFulfilled() -> boolean
    //检测是否完成
    console.log("success:" + rf1.isFulfilled());
    //.isRejected() -> boolean
    //检测是否失败
    console.log("fail:" + rf1.isRejected());
    //.isPending() -> boolean
    //检测是否进行中
    console.log("Pending:" + rf1.isRejected());
    //.value() -> dynamic
    //成功的结果,一般使用时先判定是否完成
    if (rf1.isFulfilled()) {
        console.log(rf1.value());
    }
    //.reason() -> dynamic
    //失败原因，同样使用时先判定是否失败
    if (rf1.isRejected()) {
        console.log(rf1.reason());
    }
})

//.all() -> Promise
//参数为数组，并且里面的已promise化，全部成功返回的也为数组
//example
var rfAll1 = readFileAsync('1.txt', 'utf-8');
var rfAll2 = readFileAsync('2.txt', 'utf-8');
var rfAll3 = readFileAsync('3.txt', 'utf-8');
var files = [rfAll1, rfAll2, rfAll3];
Promise.all(files).then(function (s) { console.log("all:" + s) });

//.props() -> Promise
//类似于.all(),不过参数为object，全部成功返回值也为object
//example
Promise.props({
    rfProp1: readFileAsync('1.txt', 'utf-8'),
    rfProp2: readFileAsync('2.txt', 'utf-8'),
    rfProp3: readFileAsync('3.txt', 'utf-8')
}).then(function(content){
    console.log(JSON.stringify(content));
})

//.settle() -> Promise
//基本等同于.all();
//example
var rfsettle1 = readFileAsync('1.txt', 'utf-8');
var rfsettle2 = readFileAsync('2.txt', 'utf-8');
var rfsettle3 = readFileAsync('3.txt', 'utf-8');
var files = [rfsettle1, rfsettle2, rfsettle3];
Promise.all(files).then(function (s) { console.log("settle:" + s) });

//.some(int count) -> Promise
//第一个参数为数组，第二个为个数,指的返回值最先返回成功的值
//example
var rfsome1 = readFileAsync('1.txt', 'utf-8');
var rfsome2 = readFileAsync('2.txt', 'utf-8');
var rfsome3 = readFileAsync('3.txt', 'utf-8');
var files = [rfsome1, rfsome2, rfsome3];
Promise.some(files,2).spread(function(first,second){
    console.log("some:" + first);
    console.log("some:" + second);
})

//.map(Function mapper [, Object options]) -> Promise
//参数为数组,不需要promise化，只要map里面的函数promise化就行。 有点类似于数组的map方法
//example
var files = ['1.txt','2.txt','3.txt'];
Promise.map(files,function(file){
    return readFileAsync(file,'utf-8');
}).then(function(content){
    console.log("map:" + content) ;
})

//.reduce(Function reducer [, dynamic initialValue]) -> Promise
//概念有点像数组的reduce方法.   total为返回的组装值，fileName为item,0为初始值
//example
Promise.reduce(["1.txt", "2.txt", "3.txt"], function(total, fileName) {
    return readFileAsync(fileName, "utf8").then(function(contents) {
        return total + parseInt(contents, 10);
    });
}, 0).then(function(total) {
    console.log("reduce:" + total)
});
