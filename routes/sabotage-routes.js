const router = require("express").Router();
const db = require("../../models");
// const words = require("./words");
const bcrypt = require("bcrypt-nodejs");
const passport = require("../../config/passport");
const moment = require("moment")
// Book routes
// router.use("/words", words);

router.get("/user", (req,res) => {
  res.json(req.user || "")
})

router.get("/users", (req,res) => {
  db.User.find().sort({score:-1}).then((dbUsers, err) => {
      if(err) {
          console.log('Error: ' + err);
          res.status(500).send('Error');
      } else {
          res.status(200).json(dbUsers);
      }
  })
})

router.get("/friends", (req,res) => {
  db.User.findOne({_id:req.user._id}).sort({score:-1}).populate('friends').then((dbUsers, err) => {
      if(err) {
          console.log('Error: ' + err);
          res.status(500).send('Error');
      } else {
          res.status(200).json(dbUsers);
      }
  })
})

// NEW USER
router.post('/new', (req, res) => {
  let password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
    db.User.create({
        username: req.body.username,
        password: password
    }, (err, dbUser) => {
        console.log(JSON.stringify(err));
        console.log(typeof(err));
        if (err) {
          console.log(err.code);
          switch(err.code){
            case 11000:
              console.log('Repeat username: ' + err);
              res.statusMessage ='Username Taken';
              res.status(500).send('Username already taken'); 
              break;
            default:  
              console.log('signup error: ' + err);
              res.statusMessage ='Signup Error';
              res.status(500).statusMessage('Signup Error').send('Signup Error'); 
          }

        }
        else{
          req.flash('success', 'signup worked');
          res.redirect(307, "login");
        }
    });
});

router.post('/login', passport.authenticate("local"), (req,res) => {
  console.log('tried to login');
  console.log(req.user);

  db.User.findOneAndUpdate({
    _id: req.user._id
  }, {
    lastLogin: new Date
  }, (err, dbUser) => {
    if (err) {
      console.log('CREATE Error: ' + err);
      res.status(500).send('Error');
    } else {
      res.json(req.user);
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.put('/score', (req, res) => {
    //console.log(req);
    console.log(req.user);
    db.User.updateOne({_id : req.user._id}, {$inc: {score: req.body.deduct}}, (err, dbUser) => {
      if (err) { 
        console.log('CHANGE USER Error: ' + err);
        res.status(500).send('Error');
      } else if (dbUser) {
          res.status(200).json(dbUser);
    } else {
        res.status(404).send('Not found');
      }
  });
});

router.put('/add', (req,res) => {
  db.User.updateOne({_id:req.user_id}, {$push: {friends:req.body.id}}, (err,dbUser) => {
    if (err) {
      console.log('CHANGE USER Error: ' + err);
      res.status(500).send('Error');
    } else if (dbUser) {
      res.status(200).json(dbUser);
    } else {
      res.status(404).send('Not found');
    }
  });
})

router.put('/sabotage', (req, res) => {
  //console.log(req);
  console.log(req.user);
  db.User.updateOne({
    _id: req.user._id
  }, {
    $inc: {
      score: -1000
    }
  }).then(db.User.updateOne({
      _id: req.body.id
    },{
      $inc: {
        score:-10000
      }
    }, (err, dbUser) => {
      if (err) {
        console.log('CHANGE USER Error: ' + err);
        res.status(500).send('Error');
      } else if (dbUser) {
        res.status(200).json(dbUser);
      } else {
        res.status(404).send('Not found');
      }
  }))  
});



// DELETE USER
router.route('/:id')
    .delete((req, res) => {
        db.User.findById(req.params.id, (err, dbUser) => {
          if (err) { 
            console.log('DELETE Error: ' + err);
            res.status(500).send('Error');
          } else if (dbUser) {
            dbUser.remove( () => {
              res.status(200).json(dbUser);
            });
         } else {
            res.status(404).send('Not found');
          }
        });
    })


module.exports = router;
