const express = require('express');
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

var course_id = 1;

function authenticate_admin(req,res,next){
  // Headers: { 'username': 'admin', 'password': 'pass' }
  ADMINS.forEach((el)=>{
    if((el.username == req.headers.username) && (el.password == req.headers.password)){
      next()
    }
  })
  next()
  res.send("u are not admin");
}

function authenticate_user(req,res,next){
  USERS.forEach((el)=>{
    if((el.username == req.headers.username) && (el.password == req.headers.password)){
      next()
    }
  })
  // next()
  res.send("u are not a user")
};


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  ADMINS.forEach((el)=>{
    if(el.username == req.body.username){
      res.send("user already created");
    }
  })
  console.log(req.body);
  let obj = { username: req.body.username, password: req.body.password };
  ADMINS.push(obj);
  console.log(ADMINS);
  res.send("user created successfully"+JSON.stringify(ADMINS));
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  console.log("req headers",req.headers.username,req.headers.password,"admins",ADMINS);
  ADMINS.forEach((el)=>{
    console.log("eluser",el.username,"elpass",el.password)
    if(el.username == req.headers.username){
      if(el.password == req.headers.password){
        res.send({message: 'Logged in successfully'});
      }
    }
  })
  res.send("user not found"+JSON.stringify(ADMINS));
});

app.post('/admin/courses', authenticate_admin ,(req, res) => {
  // logic to create a course
  COURSES.forEach((el)=>{
    if(el.title == req.body.title){
      res.send("course already created");
    }
  })
  let obj = { id: course_id, title: req.body.title, description: req.body.description, price: req.body.price, imageLink: req.body.imageLink, published: req.body.published }
  course_id += 1
  COURSES.push(obj);
});

app.put('/admin/courses/:courseId', authenticate_admin, (req, res) => {
  // logic to edit a course
  COURSES.forEach((el)=>{
    if(el.id == req.params.id){
      let obj = { title: req.body.title, description: req.body.description, price: req.body.price, imageLink: req.body.imageLink, published: req.body.published }
      COURSES.splice(el.id,1,obj);
    }
  })
});

app.get('/admin/courses', authenticate_admin, (req, res) => {
  // logic to get all courses
  req.send(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  USERS.forEach((el)=>{
    if(el.username == req.body.username){
      res.send("user already created");
    }
  })
  let obj = { username: req.body.username, password: req.body.password, courses:[] };
  USERS.push(obj);
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  USERS.forEach((el)=>{
    if(el.username == req.headers.username){
      if(el.password == req.headers.password){
        res.send({message: 'Logged in successfully'});
      }
    }
    res.send("user not found");
  })

});

app.get('/users/courses',authenticate_user, (req, res) => {
  // logic to list all courses
  res.send(COURSES);
});

app.post('/users/courses/:courseId',authenticate_user, (req, res) => {
  // logic to purchase a course
  USERS.forEach((el)=>{
    if(el.username == req.headers.username){
      el.courses.push(req.params.courseId);
    }
  })

});

app.get('/users/purchasedCourses',authenticate_user, (req, res) => {
  // logic to view purchased courses
  USERS.forEach((el)=>{
    if(el.username == req.headers.username){
      res.send(el.courses)
    }
  })
  res.send("i dont know wht happened")
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
