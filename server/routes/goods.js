let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let Goods = require('../models/goods');


mongoose.connect('mongodb://127.0.0.1/dumall-goods');

mongoose.connection.on("connected",function () {
  console.log("MongoDB连接成功")
});
mongoose.connection.on("error",function () {
  console.log("MongoDB连接失败")
});
mongoose.connection.on("disconnected",function () {
  console.log("MongoDB断开")
});

//查询商品
router.get("/list",function (req,res,next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let priceLevel = req.param("priceLevel");
  let sort = parseInt(req.param("sort"));
  let skip = (page-1)*pageSize;
  let params = {};
  if(priceLevel != 'all'){
    switch (priceLevel){
      case '0':priceGt = 0;priceLte = 100;break;
      case '1':priceGt = 100;priceLte = 500;break;
      case '2':priceGt = 500;priceLte = 1000;break;
      case '3':priceGt = 1000;priceLte = 2000;break;
    }
  }else{
    priceGt = 0;
    priceLte = 100000000;
  }
  params = {
    'salePrice':{
      $gt:priceGt,
      $lte:priceLte
    }
  };

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});

  goodsModel.exec(function (err,doc) {
    if (err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }

      })
    }
  })
});

//加入到购物车
router.post("/addCart" , function (req,res,next) {
  let userId = '100000077';
  let productId = req.body.productId;
  let User = require('../models/users');
  User.findOne({userId:userId},function (err,userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else {
      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if(item.productId == productId){
            goodsItem = item;
            item.productNum++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err3,doc3){
            if(err3){
              res.json({
                status:'1',
                msg:err3.message
              })
            }else {
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              })
            }
          })
        }else {
          Goods.findOne({productId:productId},function (err1,doc) {
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              })
            }else {
              if(doc){
                doc.productNum =1;
                doc.checked = true;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2){
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else {
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            }
          })
        }

      }
    }
  })
});

module.exports = router;
