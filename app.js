const express = require('express')
const bodyParser = require('body-parser');
const {date} = require(__dirname+"/date.js");
const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set('view engine','ejs')


let newItem = [];
let workItem = [];

app.get('/', function(req,res){

    let day = date();
    res.render('list',{day:day,newListItem:newItem})
})

app.post('/',(req,res)=>{
    let item = req.body.newItem;

    if(req.body.list == 'work'){
        workItem.push(item);
        res.redirect('/work')
    }
    else{
        newItem.push(item);
        res.redirect('/');
    }
})

app.get('/work',(req,res)=>{
    res.render('list',{day:"Work list",newListItem:workItem});
})

app.post('/work',(req,res)=>{
    let item = req.body.newItem;
    workItem.push(item);
    res.redirect("/work");
})

app.get('/about',(req,res)=>{
    res.render('about')
})

app.listen(3000, function(){
    console.log('Server started on Port: 3000')
})