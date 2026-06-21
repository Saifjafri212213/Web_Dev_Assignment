const express = require("express");
const mongoose = require("mongoose");


const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))


mongoose.connect("mongodb://127.0.0.1:27017/Movie-collection")
  .then(() => {
    console.log("mongo db local wala connect");
  })
  .catch((err) => {
    console.log("error aa gya bhai", err);
  });

  const moviesSchema = new mongoose.Schema({
    movieName:{
        type:String,
        // required:true
    } ,
    director : String,
    genre : String,
    releaseYear : Number,
    rating:{
        type: Number,
        min:1,
        max:10
    } 
});


const moviesCollection = mongoose.model("movieCollection", moviesSchema, );

app.get("/", async(req,res)=>{
  res.render("home.ejs")
})


app.get("/collection",async(req,res)=>{
  
    let movieCollection=await moviesCollection.find(); 
    console.log(movieCollection);
    res.render("collection.ejs",{movieCollection})
})


app.get("/delete/:userid", async(req,res)=>{
  console.log(req.params.userid);
  let data = await moviesCollection.findByIdAndDelete(req.params.userid)
  res.redirect("/collection")
})


app.get("/edit/:userid", async(req,res)=>{
  let data = await moviesCollection.findById(req.params.userid)
  res.render("edit.ejs",{data})
})


app.post("/update/:userid",async(req,res)=>{
  let data = await moviesCollection.findByIdAndUpdate(req.params.userid, req.body,{new:true})
  res.redirect("/collection")
})


app.get("/search", async (req, res) => {
    try {
        const searchQuery = req.query.q;
        let searchResults = [];

        if (searchQuery) {
            searchResults = await moviesCollection.find({
                // $regex allows partial matches, $options: "i" makes it ignore uppercase/lowercase
                movieName: { $regex: searchQuery, $options: "i" } 
            });
        }

        res.render("search.ejs", { searchResults, searchQuery });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).send("Error searching for movies");
    }
});


app.get("/insertdata", async(req,res)=>{
    res.render("form.ejs")
    
})

app.post("/createdata",async(req,res)=>{
   let data = await moviesCollection.create(req.body);   
  //  console.log(data);
   
    res.redirect("/collection")
})


app.listen(3000,()=>{
    console.log("server is running at 3000 local port");
    
})
