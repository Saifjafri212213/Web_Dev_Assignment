const express=require("express")
const app = express()
const mongoose = require("mongoose")

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")


mongoose.connect("mongodb://127.0.0.1:27017/Todo")
.then(()=>{
    console.log("DB Connected")
})
.catch(err =>{
    console.log(err)
});


const TodoSchema = new mongoose.Schema({
   task:{
    type:String,
    minlength:3,
   } 
})

const todo = mongoose.model("Task",TodoSchema)


app.get("/insertdata",async(req,res)=>{
    let alltask = await todo.find();
    res.render("form", { alltask: alltask })
})


app.post("/createdata" , async(req,res)=>{
    console.log(req.body);
    let data = await todo.create(req.body)
    console.log(data);  
    res.redirect("/insertdata")
})

app.listen(3000,()=>{
    console.log("server is running");
    
})

