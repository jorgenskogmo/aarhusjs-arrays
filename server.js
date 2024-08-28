// a node server with SSL-includes style preprocessor

const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const port = 3300;

const webroot = path.join(__dirname, "webroot")
const ssiroot = path.join(__dirname, "incroot")


const ssi = (html) => {
  const lines = html.split("\n")
  const result = lines.map( (line) => {
    if( line.indexOf('<!--#include file="') > -1){
      const a = line.split('<!--#include file="')
      const ssi_file = a[1].split('" -->')[0]
      const ssi_source = `${ssiroot}${ssi_file}`
      if (fs.existsSync(ssi_source)) {
        return fs.readFileSync(ssi_source).toString()
      }else{
        return "<!-- node-ssi error: file not found -->\n"
      }
    }else{
      return line
    }
  })
  return result.join("\n")
}

app.use('/webstatic', express.static('webstatic'))

app.get("*", function (req, res) {
  let requestedFile = req.path;
  if( requestedFile === "/" ) requestedFile = "/index.html"
  const source = `${webroot}${requestedFile}`
  // console.log( req.path, source )
  if (fs.existsSync(source)) {
    const file = fs.readFileSync(source).toString()
    const ext = requestedFile.split(".").pop()
    if( ext === "js" ){
      console.log("ext", ext, "text/javascript")
      res.setHeader('content-type', 'text/javascript');
      res.send( file )
    }else if( ext === "css" ){
        console.log("ext", ext, "text/css")
        res.setHeader('content-type', 'text/css');
        res.send( file )
    }else{
      res.send( ssi(file) )
    }
  }else{
    res.send("404");
  }
});

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});