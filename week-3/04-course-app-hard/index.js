


// mongoose.connect("mongodb://127.0.0.1:27017/course_selling_app").then(()=>{
//   console.log("connected");
// })
// .catch((err)=>{
//   console.log("error",err)
// })

// //create schema
// // const addressSchema = new mongoose.Schema({
// //   city: String,
// //   street: String
// // })
// const userSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   hobbies:[String],
//   email: {
//     type: String,
//     // required: true
//   },
//   createdAt: {
//     type: Date,
//     default: ()=>{
//       Date.now()
//     }
//   },
//   updatedAt: Date,
//   bestFriend:{
//     type: mongoose.Schema.ObjectId,
//     ref: "Users"
//   },
//   address: addressSchema
// });

// //create a model of the schema
// const User = mongoose.model("User", userSchema);

//create a new user(document) through model and save it in our db

// const user = new User({
//   name: "random",
//   age: 24,
//   hobbies: ["weight lifting", "coding", "dying"],
//   address:{
//     city: "amalapuram",
//     street: "no_street"
//   }
// })

//updated a user document
// User.findOne({name:"random"}).then((curr_user)=>{
//   curr_user.name = "not_random"
//   curr_user.save().then(()=>{
//     console.log("user updated")
//   })
// });

//findbyid method
// User.findById("6530f99438c773fc95a726aa").then((user)=>{
//   console.log(user);
// })

// user.save().then(()=>{
//  console.log("user created");
// })

//or 

// User.create({
//   name: "random2",
//   age: 22
// }).then((user)=>{
//   console.log(user)
// })

//learned abt create and save methods



//find vs exists find --- returns an array of objects, exists returns id which u can check.
// User.find({name: "random2"}).then((arr)=>{
//   console.log(arr)
// })

// User.exists({name:"random2"}).then((el)=>{
//   console.log(el);
// })

// deletOne vs deleteMany

//adding queries in a diff way
// User.where("age").gt(12).lt(27).equals("kyle")

// //ref in schema to a diff model

// User.findOne({name: "random2"}).then((use)=>{
//   use.bestFriend = "6530ff86b84064399a54740f";
//   use.save();
//   console.log(use);
// })

//user.populate("bestFriend");  will populate the bestfriend ref






const express = require('express');
const app = express();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const encodedMessage = encodeURIComponent("Mynameisberry@123");
console.log(encodedMessage);

mongoose.connect(`mongodb+srv://yeshwanth:${encodedMessage}@cluster0.yiqw3ui.mongodb.net/`).then((sm) => {
  console.log("connected to mongodb");
})

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
})

const admin = mongoose.model("admins", adminSchema);

var token;

function authenticate_admin(req, res, next) {
  console.log(req.headers);
  const token_sent = req.headers.authorization;
  jwt.verify(token_sent, "secretkey", (err, decoded) => {
    if (err) {
      console.log(err)
      res.send({ "err": "u are not authenticated" })

    }
    else{
      console.log("decoded", decoded)
    //ninja technique
    // req.user = decoded;
     next()
    }
    
  })
}



// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  try {
    const { username, password } = req.body
    const admin1 = new admin({
      username,
      password
    })
    admin1.save().then(() => {
      token = jwt.sign(req.body, "secretkey", { expiresIn: '1h' });
      // const token = jwt.sign(admin1,"secret",{ expiresIn: '1h' });
      console.log("token", token);
      // res.send(token);
    }).catch(() => {
      res.send("err in mongoose")
    });
  }
  catch (err) {
    console.log(err);
    res.send({ "err": "error in jwt or mongodb" })
  }
  admin.findOne({ username: "user" }).then((use) => {
    console.log(use)
    res.send(token);
  })
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  admin.findOne({ username: req.body.username, password: req.body.password }).then((us) => {
    token = jwt.sign(req.body, "secretkey", { expiresIn: "1h" })
    res.send(token);
  }).catch((er) => console.log(er))

});

const courseSchema = new mongoose.Schema({ title: {type: String, required: true}, description: String, price: Number, imageLink: String, published: Boolean });
const courseModel = mongoose.model("courses", courseSchema);


app.post('/admin/courses', authenticate_admin, (req, res) => {
  // logic to create a course
  const c1 = new courseModel(req.body)
  c1.save().then(()=>{
    res.send("course created successfully");
  })
.catch(()=>res.send({"err": "some error in course"}))
});


app.put('/admin/courses/:courseId',authenticate_admin, (req, res) => {
  // logic to edit a course
  // courseModel.findById(req.params.courseId).then((cs1)=>{
  //   cs1 = {...req.body, ...cs1};
  //   // Object.assign(cs1, req.body)
  //   cs1.save().then(()=>{
  //     res.send("course updated successfully")
  //   }).catch(()=>res.send("some error in course updation"))
  // })
  courseModel.findByIdAndUpdate(req.params.courseId,req.body).then(()=>res.send("course updated successfully"))
  .catch(()=>{
    res.send("error updating course");
  })
});



app.get('/admin/courses', authenticate_admin, (req, res) => {
  // logic to get all courses
  courseModel.find({}).then((el)=>console.log(el))
  res.send({"msg": "see the console"});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
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
