// first import install libery 

var express = require("express");
var bodyParse = require("body-parser");
var mongoose = require("mongoose");
const path = require('path');
const fs = require('fs');


//create app

const app = express()

app.use(bodyParse.json())
app.use(express.static('public'))
app.use(bodyParse.urlencoded({
    extended: true
}))

// conect database


mongoose.connect('mongodb://0.0.0.0:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection;

// check connect

db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to Database"));

// upload data
app.post("/sign_up",(req,res)=>{
    var name =req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;
    // create object
    var data = {
        "name":name,
        "email":email,
        "phno":phno,
        "password":password
    }
    db.collection('users').insertOne(data, (err, collection) => {
        if (err) throw err;
        console.log("Record Inserted Successfully");
    });
    return res.redirect('index.html');
})

app.get("/", (req, res) => {

    res.set({
        "Allow-access-Allow-Origin": '*'
    })

    return res.redirect('try.html');

}).listen(3000);


app.post("/login", async (request, response) => {
    try {
        //adding
        const username = request.body.username;
        const password = request.body.password;

        const usermail = db.collection('users').findOne({ email: username }, (err, res) => {
            if (res == null) {
                response.send("Invalid information!❌❌❌! Please create account first");
            }
            else if (err) throw err;


            if (res.password === password) {
                return response.redirect('Dashboard.html');
            }
            else {
                response.send("Invalid Password!❌❌❌");
            }
        });
    }
    catch (error) {
        response.send("Invalid information❌");
    }
})


app.get('/users/count', async (req, res) => {
    const count = await db.collection('users').countDocuments();
    res.json({ count });
  });


  
  const IMAGE_DIR = path.join(__dirname, 'public/images');
  
  // Endpoint to get all images
  app.get('/images', (req, res) => {
    fs.readdir(IMAGE_DIR, (err, files) => {
      if (err) {
        console.error('Error reading images directory:', err);
        res.sendStatus(500);
        return;
      }
  
      // Filter out non-image files
      const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
      res.json(images);
    });
  });


const spawn = require('child_process').spawn;

app.get('/generate-video', (req, res) => {
  const process = spawn('python', ['tiknknme.py']);

  process.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  process.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  process.on('close', (code) => {
    console.log(`Video generation process exited with code ${code}`);
    res.send(`Video generated with code ${code}`);
  });
});

// to count the number of images stored in 

const directoryPath = 'C:/Users/Raviraj/Desktop/javascript_login/public/images';

app.get('/count-images', function(req, res) {
  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Error reading directory');
      return;
    }
    const imageFiles = files.filter(function(file) {
      return /\.(jpe?g|png|gif)$/i.test(file);
    });
    res.send(imageFiles.length.toString());
  });
});

// To count the number of videos in the Directory

const directoryPaths = 'C:/Users/Raviraj/Desktop/javascript_login/public/videos';

app.get('/count-videos', function(req, res) {
  fs.readdir(directoryPaths, function(err, files) {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Error reading directory');
      return;
    }
    const videoFiles = files.filter(function(file) {
      return /\.(mp4v|avi|mov)$/i.test(file);
    });
    res.send(videoFiles.length.toString());
  });
});
// to display video 
app.get('/video', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'videos', 'output.mp4v'));
});