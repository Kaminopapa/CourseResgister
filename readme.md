# Project 7
这个Project分成两个部分，一个是用户端（react),一个是server site(express,mongodb)

用户端有两个部分：
1.  学生端
    1.  学生可以购买课程
    2.  有自己的profile
    3.  已购买的教程
2.  教师端
    1.  上传教程
    2.  有自己的profile
    3.  已上传的教程
Server site
install mongoose express dotenv nodemon bcrypt

mongo atlas
user: project5
password: project5password
conncetkey:mongodb+srv://project5:<password>@cluster0.n7eks.mongodb.net/?retryWrites=true&w=majority

# Joi validation
The most powerful schema description language and data validator for JS
确认你的信息是否正确的工具
可以客制化error message给使用者
npm install joi
```js
const Joi = require("joi");

//Validation function
//Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid("student", "instructor"),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

```
```js
//auth.js
//register route
router.post("/register", (req, res) => {
  console.log("Register!!!");
  console.log(registerValidation(req.body));
});
```

# JWT
npm install jsonwebtoken passport passport-jwt passport-local
Jason Web Token
User login 后 会发送请求到Server,每次收到请求后并且验证成功后server会生成一个JWT Token(String)
JWT 是一个String把用户的资料做加密处理所生成的，里面包含使用者的资料。
然后会回传JWT给使用者并储存在LocalStorage。Server不会储存这个信息

1. 用了JWT就不需要用cookies
2. JWT 储存在LocalStorage(用户没办法容易作改变)
3. 每次发送请求，jwt和请求一并发送
4. Any protected routes , such as requiring users to login first before posting new data, should be protected by Jwt passport authentication middleware to check the validation of the request

```js
//auth.js
const jwt = require("jsonwebtoken");
router.post("/login", (req, res) => {
  //check the validation of data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(400).send(err);

    if (!user) {
      res.status(401).send("User not found");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return res.status(400).send(err);

        if (isMatch) {
          //generate JWT
          const tokenObject = { _id: user._id, email: user.email };
          //sign(tokenObject,secret)用来制作token
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          //jwt要加空格
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          res.status(401).send("Wrong password");
        }
      });
    }
  });
});
```
use jwt
当我们获得jwt token的时候。（localhost:8080/api/user/login)post request
在POSTMAN的header里面的第一个Key是Authorization，value就是token里面的值
```js
//index.js
//from config/passport,it's a function
const passport = require("passport");
require("./config/passport")(passport);
///config/passport.js
const passport = require("passport");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").userModel;

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRETE;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};


```
# populate
填充(Population)是使用来自其它集合中的文档自动替换文档中的指定路径的过程。填充可以是单个文档、多个文档、普通对象、多个普通对象或从查询返回的所有对象。来看一些例子
```js
populate(path, [select], [model], [match], [options])
```
* path <Object, String> either the path to populate or an object specifying all parameters
* [select] <Object, String> Field selection for the population query
* [model] The model you wish to use for population. If not specified, populate will look up the model by the name in the Schema's ref field.
* [match] Conditions for the population query
* [options] Options for the population query (sort, etc)

# Client side
用react 和bootstrap做

# cors
让我们可以同时运行2个server
localhost:3000
localhost:8080
**在server文件夹里面做：**
npm install cors
在server/index.js 写上：
```js
const cors = require("cors");
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//一定要写在这两个下面
app.use(cors());
```
在client folder安装router:
npm install react-router-dom

在client folder安装axios:
axios
从react通过http req到server
npm install axios

在src创建一个services文件夹
里面存着auth.service.js
这个文件提供一个服务，当我们按下register这个按钮数据会通过这个文件把我们资料传到后端

useNavigate
重导向页面