
const readline=require("readline");
const {GoogleGenerativeAI} =require("@google/generative-ai");
const dotenv=require("dotenv").config();
const genai=new GoogleGenerativeAI("AIzaSyB4wf2ZlsMZgaAw_TGqaYtvaitZigr6mBc");
const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout,
});
async function run(){
    
    const model=genai.getGenerativeModel({model:"gemini-pro"});
    const chat=model.startChat({
        history:[],
        generationConfig:{
            maxOutputTokens:500,
        },
    });
    async function asked(){
        rl.question("(●'◡'●): ",async(mes)=>{
            if(mes.toLowerCase()==="exit"){
                rl.close();
            }else{
                const res=await model.generateContent(mes);
                const response=await res.response;
                const text=response.text();
                console.log("sol:/:",text);
                asked();
            }
        });
    }
    asked();
}
run();

/*
const readline=require("readline");
const {GoogleGenerativeAI} =require("@google/generative-ai");
const dotenv=require("dotenv").config();
const genai=new GoogleGenerativeAI("AIzaSyB4wf2ZlsMZgaAw_TGqaYtvaitZigr6mBc");
const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout,
});
let isaw=false;
async function run(){
    
    const model=genai.getGenerativeModel({model:"gemini-pro"});
    const chat=model.startChat({
        history:[],
        generationConfig:{
            maxOutputTokens:500,
        },
    });
    async function asked(){
        if(!isaw){
        rl.question("(●'◡'●): ",async(mes)=>{
            console.log("sol/::/");
            if(mes.toLowerCase()==="exit"){
                rl.close();
            }else{
                isaw=true;
                try{
                const res=await chat.sendMessageStream(mes);
                const text="";
                for await (const chunk of res.stream){
                    const chunktext=await chunk.text();
                    console.log(" ",chunktext);
                    text+=chunktext;
                }
                isaw=false;
                asked();
            }catch(error){
                console.log(error);
                isaw=false;
            }
            }
        });
    }
    }
    asked();
}
run();
*/