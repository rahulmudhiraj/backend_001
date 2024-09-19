let express = require('express');
let mongoose = require('mongoose');
const multer=require('multer');
const cors=require('cors')
const dotenv=require("dotenv").config({path:'.env'});
let getFields=multer();
// workshop
const stripe=require('stripe')('pk_test_51OysROSD6eLhSv0z9kxummvO544AilWR9GzP2WqU2aFWSSbqBVsSmRzpRZx2g6rvcP0o5xX4LJGxR42K3KsupIpx00gnE6j2Gb')
let app = express();
app.use(cors());
app.use(express.json());

let db = async() => {
    try{ 
        // console.log(process.env.DBURI); 
    // await mongoose.connect('mongodb://localhost:27017');
    await mongoose.connect(process.env.DBURI);
    console.log('mongo db connected!');
    }
    catch(error) {
        console.log(error);
    }
}
db();

app.get('/',(req,res) => { 
    console.log(" A new request has been raised on  " + new Date(Date.now())); 
    res.writeHead(200,{ 'Content-Type':"text/plain"})  
    res.write(' hey');
    res.end();
});


const pitc=new mongoose.Schema({
    veadioplayer:
        [
            {
                no:Number,
                VIDEO_PATH:String,
                questions:[{question:String,options:[String],correctAnswer:Number}]
            }
        ],
    games:
        {jigsawpussil:
        [
            {
                no:Number,
                imageloc:String,
                questions:[{question:String,options:[String],correctAnswer:Number}]
            }
        ],
        memory:
        [
            {
                no:Number,
                cardImages:[{src:String,matched:Boolean,question:String,options:[String],correctOption:String}]

            }
        ],
        scrachcard:
        [
            {
                no:Number,
                cardImage:String,replace:String,data:String,
                questions:[{question:String,options:[String],correctAnswer:Number}]
            }
        ],
        worldscramble:
        [
            {
                no:Number,
                wordsWithHints:[{word:String,hint:String}]
            }
        ],
        wheel:
        [
            {
                no:Number,
                segments:[{name:String,image:String,message:String}],segColors:[String],
                questions:[{question:String,options:[String],correctAnswer:Number}]
            }
        ],
        crossword:
        [
            {
                no:Number,data:{across:{1:{data:{clue:String,answer:String,row:Number,col:Number}},3:{data:{clue:String,answer:String,row:Number,col:Number}}},down:{1:{data:{clue:String,answer:String,row:Number,col:Number}},2:{data:{clue:String,answer:String,row:Number,col:Number}}}}
            }
        ],
        flipcard:
        [
            {
                no:Number,pictureSources:[String],
                questions:[{question:String,options:[String],correctOption:String,textAfterQuestion:String}]
            }
        ]
    
    
    }
})
const pitchouts=new mongoose.model("pitchout", pitc)

const flipflop=new mongoose.Schema({
    rosponce:[
        {
            question:String,
            option:String
        }
    ],
    score:Number
})
// const jikjak= new mongoose.Schema({
//     rosponce:[
//         {
//             question:String,
//             option:Number
//         }
//     ],
//     score:Number
// })

const userSchema = new mongoose.Schema({
    name: String,
    // age:{type: Number,min:6,max:20,
    //     validate:{ 
    //     validator:v=>v%1===0,
    //     message:props=>`${props.value} is not a natural no`
    //     },},
    createdat:{type:Date,immutable:true,default:()=>Date.now()},
    flipcard:[flipflop],        memory:[flipflop],   VIDEO:[flipflop]
});

const Users = new mongoose.model("User", userSchema)

app.get('/users',async (request,response) => { 
    const allUsers = await Users.find();
    try {
        
        response.send(allUsers);
    } catch (error) {
        response.status(500).send(error);
    }
});

//To check the user
app.get('/pitch',async (request,response) => { 
    const peaches = await pitchouts.find({});
    try {
        // console.log(peaches);
        response.send(peaches);
    } catch (error) {
        response.status(500).send(error);
    }
});
/*
app.put()
app.delete()
*/

app.post('/login',async(req,res)=>{
    const{name}=req.body;
    if(!name){
        return res.status(422).json({error:"piz fill"})
    }
    try{
        const users =await Users.findOne({name});
        if(users){
            res.send(users);
            res.status(201).json({message:"all din"})
        }
        else{
            res.status(402).json({message:"invalid name"})
        }
        
    }catch(err){
        console.log(err);
    }
});



//post
app.post('/register',async(req,res)=>{
    const{name}=req.body;
    if(!name ){
        return res.status(422).json({error:"piz fill"})
    }
    try{
        const userExists = await Users.findOne({ name });
        if (userExists) {
            return res.status(422).json({ error: "User already exists" });
        }
        const users =new Users({name});
        await users.save();
        res.send(users);
        res.status(201).json({message:"all din"})
    }catch(err){
        console.log(err);
    }
});



const fead=new mongoose.Schema({feedback:String,createdat:{type:Date,immutable:true,default:()=>Date.now()}})
const feadback=new mongoose.model("feadback",fead)


app.post('/feadback',async(req,res)=>{
    const fead001=req.body;
    if(!fead001){
        return res.status(422).json({error:"piz fill"})
    }
    try{
        const Feadback=new feadback(fead001);
        await Feadback.save();
        res.send(Feadback);
        res.status(201).json({message:"report saved"})
    }catch(err){
        console.log(err);
    }
});

const fead007=new mongoose.Schema({name: String,phone: String,email: String,message: String})
const Contactus=new mongoose.model("Contactus",fead007)

app.post('/contactus',async(req,res)=>{
    const {name,phone,email,message}=req.body;
    if(!name){
        return res.status(422).json({error:"piz fill"})
    }
    try{
        const contactus=new Contactus({name,phone,email,message});
        await contactus.save();
        res.send(contactus);
        res.status(201).json({message:"report saved"})
    }catch(err){
        console.log(err);
    }
});

//put
app.put("/update",async(req,res)=>{
    
    let {name,age1}=req.body;
    try{
    const data=Users.findOneAndUpdate({name:name},{$set:{age:age1}},{new:true}).exec();
    if (data == null) {
        res.send("Data not found");
        } else {
        res.send(data);
        }
    }catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Internal Server Error');
    }

});

app.put("/responceflipcard",async(req,res)=>{
    let{rosponce,score}=req.body;
    if(!rosponce && !score){
        return res.status(422).json({error:"piz fill"})
    }
    try{
        const data=Users.findOneAndUpdate({name:"brad pit"},{$set:{flipcard:[{rosponce,score}]}},{new:true}).exec();
        if (data == null) {
            res.send("Data not found");
            } else {
            res.send(data);
            }

    }catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.put("/responcememory", async (req, res) => {
    let { rosponce, score } = req.body;
    if (!rosponce && !score) {
        return res.status(422).json({ error: "Please fill in the required fields" });
    }

    try {
        const data = await Users.findOneAndUpdate(
            { name: "brad pit" },
            { $set: { memory: [{ rosponce, score }] } },
            { new: true }
        ).exec();

        if (data === null) {
            res.send({ data: "Data not found" });
        } else {
            // console.log(rosponce);
            res.send(data);
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put("/VIDEO", async (req, res) => {
    let { rosponce,score } = req.body;
    if (!rosponce && !score ) {
        return res.status(422).json({ error: "Please fill in the required fields" });
    }

    try {
        const data = await Users.findOneAndUpdate(
            { name: "brad pit" },
            { $push: { VIDEO: [{ rosponce, score }] } },
            { new: true }
        ).exec();

        if (data === null) {
            res.send({ data: "Data not found" });
        } else {
            // console.log(rosponce);
            res.send(data);
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/api",(req,res)=>{
    res.json({"kmit":["userone","user2","user3"]})
});



app.listen(5000, () => console.log("listening at port 5000"));