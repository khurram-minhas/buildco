var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var app = express();
const fetch = require("node-fetch");
var fs = require("fs");
const multer = require('multer');
const upload = multer();
app.use(express.json())
app.use(cors())
app.use(express.json({limit: '50mb'}));

app.post('/saveData', function (req, res) {
    const path = "./Json/" + req.body.id + ".json";
    console.log(req.body)
    var json = JSON.stringify(req.body);
   fs.writeFile(path, json, 'utf8', function (err, data) {
      res.end( data );
   });
})

app.post('/post_pdf', upload.any(), (req, res) => {
    console.log('POST /post_pdf');
    console.log('Files: ', req.files);
    fs.writeFile('./pdf/' + req.files[0].originalname, req.files[0].buffer, (err) => {
        if (err) {
            console.log('Error: ', err);
            res.status(500).send('An error occurred: ' + err.message);
        } else {
            res.status(200).send('ok');
        }
    });
});


app.get('/getData/:id', function (req, res) {
    const path = "./Json/" +req.params.id + ".json";
    const rawJson = require(path)
    console.log(rawJson)
    res.send(rawJson)
   
})

app.get('/getPdf/:id', async function (req, res) {
    try{
        const path = "./Pdf/" +req.params.id + ".pdf";
        const buffer = bufferFile(path)
        console.log(buffer)
        res.write(buffer)
        res.end()
    }
    catch(ex) {
        res.end()
    }
})


function bufferFile(path) {
    return fs.readFileSync(path);
}

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})