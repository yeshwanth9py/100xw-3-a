const express = require('express');
const app = express();
const path = require("path")

const fs = require("fs");
const jwt = require('jsonwebtoken');


app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];


function authenticate_admin(req,res,next){
  // { 'Authorization': 'Bearer jwt_token_here' }
  console.log(req.headers);
  jwt.verify(req.headers.Authorization, "secretKey", (err, decoded) => {
    if (err){
      res.send({"Err":"u are not authorized"})
    }
  req.user = decoded
  next()
})}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let data1 =[];
  console.log(req.body)
  try{
    ADMINS = JSON.parse(fs.readFileSync("admin.txt","utf8"));
    ADMINS.push(req.body);
  }
  catch{
    ADMINS = [];
    ADMINS.push(req.body);
  }
  ADMINS = JSON.stringify(ADMINS);
  console.log(ADMINS);
  fs.writeFileSync('admin.txt', ADMINS);
  // res.send(200);
  const token = jwt.sign(req.body, "secretKey", { expiresIn: '1h' });
  res.send({message: 'Admin created successfully', token: token })
});


app.post('/admin/login', (req, res) => {
  // logic to log in admin
  
  try{
    ADMINS = JSON.parse(fs.readFileSync("admin.txt","utf8"));
  }
  catch{
    ADMINS = [];
  }
  console.log(ADMINS,req.headers);
  ADMINS.forEach((el)=>{
    if((el.username == req.headers.username) && (el.password == req.headers.password) ){
      res.send({ message: 'Logged in successfully', token: 'jwt_token_here' })
    }
  })
  res.status(404).send({"err":"something went wrong"})
});


var c_id = 0;

app.post('/admin/courses', authenticate_admin ,(req, res) => {
  // logic to create a course
  try{
    COURSES = JSON.parse(fs.readFileSync("course.txt","utf8"));
    console.log(COURSES, typeof(COURSES));
  }
  catch{
    COURSES = []
  }
  req.body.c_id = c_id
  c_id += 1
  console.log(COURSES,req.body)
  
  COURSES.push(req.body)
  COURSES = JSON.stringify(COURSES)
  
  fs.writeFileSync('course.txt', COURSES);
  res.send(COURSES);

});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  try{
    COURSES = JSON.parse(fs.readFileSync("course.txt","utf8"));
    console.log(COURSES, typeof(COURSES));
  }
  catch{
    COURSES = []
  }
  const curr_course = req.params;
  let new_course = req.body;
  COURSES.splice(curr_course,1,new_course);
  fs.writeFileSync('course.txt', JSON.stringify(COURSES));
  res.send("course edited");
});

app.get('/admin/courses',authenticate_admin, (req, res) => {
  // logic to get all courses
  let data = JSON.parse(fs.readFileSync("course.txt","utf8"));
  res.send(data);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let USERS = JSON.parse(fs.readFileSync("user.txt","utf8"));
  USERS.push(req.body);
  fs.writeFileSync("user.txt",JSON.stringify(USERS));
  res.send(USERS)
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
