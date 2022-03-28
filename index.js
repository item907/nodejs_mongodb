// 初始化 Web Server
const express = require("express");
const app = express();

// 支援POST方法取得要求字串的欄位
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

// 使用樣板引擎EJS--安裝,設定
app.set("view enginee","ejs");  //使用EJS當樣板引擎
app.set("views","./views");  //決定 ./views資料夾放樣板引擎

// 建立 Session 使用者狀態儲存機制
const session = require("express-session");
app.use(session({
    secret: 'qweasdzxc',
    resave: false,
    saveUninitialized: true
}));

// 初始化資料庫的連線
const client = require("./connect");
client.connect(async err =>{
    if(err){
        console.log(err);
    }else{
        console.log("Database Ready");
    }
});

// 首頁
app.get("/",(req,res)=>{
    res.render("index.ejs");
});

// 註冊功能 /signup
app.post("/signup",async (req,res)=>{
    const db = client.db("dbtest");
    const collection = db.collection("member");
    // 從前端取得屬用者輸入
    const data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        level:1
    };
    // console.log(data);

    // 檢查資料庫中是否有重複的Email
    const result = await collection.findOne({
        email:data.email
    });
    if (result !== null){
        res.send("重複的信箱");
        return;
    };

    // 新增會員資料到資料庫裡
    await collection.insertOne(data);

    // 完成註冊，導向回首頁
    res.redirect("/");
})

// 登入功能 /signin
app.post("/signin",async (req,res)=>{
    const db = client.db("dbtest");
    const collection = db.collection("member");
    // 從前端取得使用者輸入
    data = {
        email:req.body.email,
        password:req.body.password
    };
    // console.log(data);

    // 檢查帳號密碼的配對是否存在
    const result = await collection.findOne({
        email:data.email,
        password:data.password
    });
    // console.log(result);

    // 登入成功
    if(result !== null){
        // 在session中記錄使用者姓名信箱，導向會員頁 /admin
        req.session["member"] = {
            name:result.name,
            email:result.email
        };
        // console.log(req.session);
        res.redirect("/admin");
    }
    // 登入失敗
    else{
        req.session["member"] = null;
        // console.log(req.session);
        res.redirect("/");
    }
});

// 登出功能 /signout
app.get("/signout",(req,res)=>{
    req.session["member"] = null;
    res.redirect("/");
});

// 管理頁面 /admin
app.get("/admin", async (req,res)=>{
    if(req.session["member"]){
        // 取得所有留言、根據時間排序
        const messages = client.db("dbtest").collection("message");
        const msg = await messages.find({},{
            sort:{time:-1}
        });
        let data = [];
        await msg.forEach((msg)=>{
            data.push(msg);
        });
        // 套用到模板引擎中顯示出來
        res.render("admin.ejs",{
            name:req.session["member"].name,
            messages:data
        });
    }
    else{
        res.send("沒有登入");
    }
});

app.post("/admin/addMessage",async (req,res)=>{
    // 驗證使用者確實有登入
    if (!req.session["member"]){
        return;
    }
    // 取得前端的留言內容
    const content = req.body.content;
    // 寫入留言資料庫
    const messages = client.db("dbtest").collection("message");
    await messages.insertOne({
        name:req.session.member.name,
        email:req.session.member.email,
        content:content,
        time:Date.now()
    });
    // 導回會員頁
    res.redirect("/admin");
});

app.listen(3000,()=>{
    console.log("server listen on port 3000");
});