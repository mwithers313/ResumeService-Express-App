const express = require('express');
const router  = express.Router();
const UserProfile = require('../models/userProfile');


/* GET contact page */
router.get('/contact', (req, res, next) => {
  res.render('contact');
});

//welcome page    
router.get('/welcomePage', (req, res, next) => {
  console.log("user info when going to welcome page %%%%%%%%%%%%%%%%%%%%%%%%% ", req.user);
  if(req.user === undefined) {
    res.redirect('/login')
    return;
  }
    res.render('welcomePage');
});


//page that gives you choices
router.get('/welcomeProfile', (req, res, next) => {

  console.log("the user info when going to welcomePage page ==================== ", req.user);


  res.render('userViews/welcomeProfile');
});





//create profile
router.get('/createProfile', (req, res, next) => {

  console.log("the user info when going to createProfile page ==================== ", req.user);

  res.render('userViews/createProfile');
});



//edit
router.get('/editProfile', (req, res, next) => {
  UserProfile.find({profile: req.user._id})
  .then(userInfo => {
console.log('user in edit: ', userInfo[0])
    res.render('userViews/editProfile', {user: userInfo[0]});
  })
  .catch(err => next(err))
});

// //view profile
// router.get('/profilePage', (req, res, next) => {
//   res.render('userViews/profilePage');
// });





module.exports = router;