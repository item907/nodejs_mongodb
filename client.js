const client = require("./connect.js");

client.connect(async err => {
    if(err){
        console.log(err);
        return;
    }
    // 決定要操作的資料庫
    const db = client.db("dbtest");
    // 決定要操作的集合
    const collection = db.collection("member");
    // 開始操作集合底下的資料
    // 新增資料
    /*
    await collection.insertOne({
        name:"test",
        email:"test@test.com",
        password:"test",
        level:1
    });
    */
    /*
    await collection.insertMany([
        {
            name:"test",
            email:"test@test.com",
            password:"test",
            level:1
        },
        {
            name:"alice",
            email:"alice@alice.com",
            password:"alice",
            level:2
        },
        {
            name:"bob",
            email:"bob@bob.com",
            password:"bob",
            level:3
        },
        {
            name:"cindy",
            email:"cindy@cindy.com",
            password:"cindy",
            level:4
        }
    ]);
    */

    // 刪除資料
    // await collection.deleteMany({});
    /*
    await collection.deleteMany({
        name:"test"
    });
    */

    // 更新資料
    /*
    await collection.updateOne({
        email:"cindy@cindy.com"
    },{
        $set:{
            name:"cindy123",
            password:"cindy123"
        }
    });
    */

    // 查詢資料
    // let result = await collection.find({
        /*
        level:{
            // $eq:2
            // $gt:2
            // $lt:4
            // $gte:2
            $lte:3
        }
        */
        /*
        $or:[
            {level:2},
            {level:4}
        ]
        */
        /*
        $and:[
            {email:"alice@alice.com"},
            {password:"alice"}
        ]
        */
    // });
    let result = await collection.find({},{
        sort:{
            level:-1    //1 esc正排, -1 desc反排
        },
        limit:1,    //一次載入幾筆
        skip:1      //跳過前幾筆
    });
    await result.forEach((doc)=>{
        console.log(doc);
    });

    client.close();
});