// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const UserProfile    = require('../models/userProfile')


authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("userViews/login", {
      message: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("userViews/login", {
          message: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        req.login(user, (err) => {
          if(err) {
            next(err);
          } else {
            setTimeout(() => {
              res.redirect("welcomePage");
            }, 100)
          }
        })
      } else {
        res.render("userViews/login", {
          message: "Incorrect password"
        });
      }
  });
});

authRoutes.get("/login", (req, res, next) => {
  console.log("the user info when going to login page ==================== ", req.user);
  if(req.user) {
    res.redirect("/");
    return;
  }
  res.render("userViews/login", { "message": req.flash("error") });
});

// authRoutes.post("/login", passport.authenticate("local", {
//   successRedirect: "welcomePage",
//   failureRedirect: "userViews/login",
//   failureFlash: true,
//   passReqToCallback: true
 
// })
// );


authRoutes.get("/logout", (req, res) => {
  console.log("the user info on log out --------------------------- ", req.user);
  req.session.destroy();
  req.logout();
  res.redirect("/");
});



// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  console.log("sending to signup page ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ")
  res.render("userViews/signup");
});


authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("userViews/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("userViews/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("userViews/signup", { message: "Something went wrong" });
      } else {
        console.log(newUser)
        res.render("userViews/login"),{message1:`${newUser.username} Please Sign In`};
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

//+_+_+_+_+_+_+_+_+_+__+_+_+_+_+_+_++_+_++++++++++++++++++++++
//profile page create, edit, update, delete


authRoutes.post('/userProfile/create', (req, res, next)=>{

  UserProfile.find({profile: req.user._id})
  .then( user => {
    // console.log('1: ', user.length)
    if(user.length !== 0){
      res.redirect('/welcomePage')
    } else {
      // console.log('2 in else', req.body)
      UserProfile.create({
        name: req.body.name,
        work: req.body.work,
        interests: req.body.interests,
        profile: req.user._id
    }) 
    .then((newUserProf) => {
      // console.log('newUserProf = = == ', newUserProf)
      res.redirect('/welcomePage')
    })
    .catch( err => {
      console.log('err here: ',err)
      next(err)})
    }
  }) 
})
 

authRoutes.get('/showProfile', (req, res, next)=>{

  UserProfile.find({profile:req.user._id})
  .then((theProfile)=>{
    res.render('userViews/profilePage', {user: theProfile[0]})
  })
  .catch((err)=>{
      next(err);
  });
});



authRoutes.post('/profilePage/update/:userID', (req, res, next)=>{

  UserProfile.findByIdAndUpdate(req.params.userID, {
      name: req.body.name,
      work: req.body.work,
      interests: req.body.interests
  })
  .then((response)=>{
      res.redirect('/showProfile')
  })
  .catch((err)=>{
      next(err)
  })


})



module.exports = authRoutes;