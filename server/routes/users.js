var express = require('express');
var router = express.Router();
var Users = require('./../models/users');
require('./../util/util');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登入用户
router.post("/login",function (req,res,next) {
    let param = {
      userName:req.body.userName,
      userPwd:req.body.userPwd
    };
    Users.findOne(param,function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message
        })
      }else {
        if(doc){
          res.cookie("userId",doc.userId,{
            path:'/',
            maxAge:1000*60*60
          });
          res.cookie("userName",doc.userName,{
            path:'/',
            maxAge:1000*60*60
          });
          res.json({
            status:'0',
            msg:'',
            result:{
              userName:doc.userName
            }
          })
        }else {
          res.json({
            status:'1',
            msg:''
          })
        }
      }

    })
});


//登出用户
router.post("/logout",function (req,res,next) {
  res.cookie("userId",'',{
    path:'/',
    maxAge:-1
  });
  res.cookie("userName",'',{
    path:'/',
    maxAge:-1
  });
  res.json({
    status:'0',
    msg:'',
    result:''
  })
});

//登录检测
router.get("/checkedLogin",function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:{
        userName:req.cookies.userName,
      }
    })
  }else {
    res.json({
      status:'1',
      msg:"weidenglu"
    })
  }
});

//购物车数据
router.get("/cart",function (req,res,next) {
  if(req.cookies.userId){
    Users.findOne({'userId':req.cookies.userId},function (err,doc) {
      if(err){
        res.json({
          status:'0',
          msg:err.message,
        })
      }else {
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    })

  }
});
//删除购物车数据
router.post('/cartDel',function (req,res,next) {
  let productId = req.body.productId;
  Users.update({userId:req.cookies.userId},{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },function (err,doc) {
    if(err){
      res.json({
        status:'0',
        msg:err.message,
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
});
//编辑购物车数据
router.post('/cartEdit',function (req,res,next) {
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;
  Users.update({"userId":req.cookies.userId,"cartList.productId":productId},{"cartList.$.productNum":productNum,"cartList.$.checked":checked},function (err,doc) {
    if(err){
      res.json({
        status:'0',
        msg:err.message,
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
});
//购物车数据选择
router.post("/editCheckAll",function (req,res,next) {
  let userId = req.cookies.userId;
  let checkedAllFlag = req.body.checkedAllFlag;
  Users.findOne({userId:userId},function (err,user) {
    if(err){
      res.json({
        status:'0',
        msg:err.message,
      })
    }else {
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkedAllFlag;
        });
        user.save(function (err1,doc) {
          if(err){
            res.json({
              status:'0',
              msg:err1.message,
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
});
//用户地址获取
router.get("/addressList",function (req,res,next) {
  let userId = req.cookies.userId;
  Users.findOne({'userId':userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
});
//设置默认地址
router.post("/setDefault",function (req,res,next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  if(!addressId){
    return;
  }else{
    Users.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else {
        if(doc.addressList.length>0){
          let ads = doc.addressList;
          ads.forEach((item)=>{
            if(item.addressId==addressId){
              item.isDefault = true;
            }else {
              item.isDefault = false;
            }
          });
          doc.save(function (err1,doc1) {
            if(err1){
              res.json({
                status:'1',
                msg:err1.message,
                result:''
              })
            }else {
              res.json({
                status:'0',
                msg:'',
                result:''
              })
            }
          })
        }
      }
    })
  }
});
//删除地址接口
router.post("/deleteAddress",function (req,res,next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  Users.update({userId:userId},{$pull:{'addressList':{'addressId':addressId}}},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'delete Address suc'
      })
    }
  })
});
//生成订单
router.post("/payment",function (req,res,next) {
  let userId = req.cookies.userId;
  let orderTotal = req.body.orderTotal;
  let addressId = req.body.addressId;
  Users.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let address = '';
      let goodsList = [];
      doc.addressList.forEach((item)=>{
        if(addressId == item.addressId){

        }
      });
      doc.cartList.filter((item)=>{
        if(item.checked){
          goodsList.push(item)
        }
      });
      let platform = '622';
      let r1 = Math.floor(Math.random()*10);
      let r2 = Math.floor(Math.random()*10);

      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId = platform +r1+sysDate+r2;

      let order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate,
      };
      doc.orderList.push(order);
      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:orderTotal
            }
          })
        }
      })
    }
  })
});
//根据订单ID查询订单详情
router.get("/orderDetail",function (req,res,next) {
  let userId = req.cookies.userId;
  let orderId = req.param("orderId");
  Users.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc.orderList.length>0){
        let orderTotal = 0;
        doc.orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderTotal:orderTotal,
              orderId:orderId
            }
          })
        }else {
          res.json({
            status:'12001',
            msg:'无此订单',
            result:''
          })
        }
      }else {
        res.json({
          status:'12002',
          msg:'当前用户为创建订单',
          result:''
        })
      }
    }
  })
});

router.get("/getCartCount",function (req,res,next) {
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId;
    Users.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else {
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.forEach((item)=>{
          cartCount += item.productNum;
        });
        res.json({
          status:'0',
          msg:'',
          result:parseInt(cartCount)
        })
      }
    })
  }
})

module.exports = router;
