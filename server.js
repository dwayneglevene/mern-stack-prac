const {MongoClient, ObjectId} = require("mongodb")

const express = require('express')

const multer = require('multer')
const upload = multer()

const sanitizeHTML = require("sanitize-html")
const fse = require('fs-extra')
const sharp = require('sharp')
let db;

const path = require('path')

// when the app first launches make sure the public/uploaded-photos directory exist
fse.ensureDirSync(path.join("public","uploaded-photos"))

const app = express()

app.set("view engine","ejs")
app.set("views","./views")
app.use(express.static("public"))


app.use(express.json())
app.use(express.urlencoded({extended:false}))

function passwordProtected(req,res,next){
    res.set("WWW-Authenticate","Basic realm ='Our NERN App")

    if (req.headers.authorization == "Basic Og=="){
        next()

    }else{
        console.log(req.headers.authorization)
        res.status(401).send("Try again")

    }
}


// at this route display the welcome to the home page and print data from data base async set it
app.get("/", async (req,res) =>{
    const allAnimals = await db.collection("Animals").find().toArray();
    res.render('home',{allAnimals})

})

app.use(passwordProtected)

// app.get("/admin",(req,res) => {
//     res.send("sani")
// })

app.get("/admin",(req,res) =>{
    res.render("admin")
})


app.get("/api/animals", async (req,res)=>{
    const allAnimals = await db.collection("Animals").find().toArray();
    res.json(allAnimals)

})

app.post("/create-animal", upload.single("photo"),ourCleanup,async (req,res) => {
    if (req.file){
        const photofilename = `${Date.now()}.jpg`
        await sharp(req.file.buffer).resize(844,456).jpeg({quality:60}).toFile(path.join("public","uploaded-photos",photofilename))
        req.cleanData.photo = photofilename
    }
    
    
    
    
    
    
    console.log(req.body)
    const info = await db.collection("Animals").insertOne(req.cleanData)
    
    const newAnimal = await db.collection("Animals").findOne({_id: new ObjectId(info.insertedId)})
    
    res.send(newAnimal)
})


app.delete("/animal/:id", async (req,res) =>{

if (typeof req.params.id != "string") req.params.id = ""
const doc = await db.collection("Animals").findOne({_id: new ObjectId(req.params.id)})
if(doc.photo){
    fse.remove(path.join("public","uploaded-photos",doc.photo))
}


db.collection("Animals").deleteOne({_id: new ObjectId(req.params.id)})
res.send("Good job")

}
)


function ourCleanup(req,res,next){
    if (typeof req.body.name !="string") req.body.name =""
    if (typeof req.body.species !="string") req.body.species =""
    if (typeof req.body._id !="string") req.body._id =""


req.cleanData ={
    name: sanitizeHTML(req.body.name.trim(), {allowedTags:[],allowedAttributes: {}}),
    species: sanitizeHTML(req.body.species.trim(), {allowedTags:[],allowedAttributes: {}})
}
    next()

}

async function start(){

    // await we will wait for all the items from the data base to come from mongo before we place anything
    // connnect to mongo db database
    const client = new MongoClient("mongodb://root:root@localhost:27017/AmazingMemApp?&authSource=admin")
    await client.connect()
    db = client.db()
    app.listen(3000)
}

start()

