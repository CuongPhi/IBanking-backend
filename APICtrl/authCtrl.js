var router = require("express").Router();
var UserRepos = require('../repos/user');
var AuthRepos = require('../repos/auth');

router.post('/new_token', (req,res)=>{
    var user_ref_token = req.body.ref_token;
    var user_id = req.body.id;
    if(user_ref_token && user_id){
        UserRepos.getByToken(user_id, user_ref_token)
        .then(user=>{
            var acToken = AuthRepos.generateAccessToken(user);
            var user_res = {
                access_token: acToken,
                type: user.user_type
            };
            res.status(200).json(user_res);
        }).catch(err=>{
            res.statusCode = 500;
            res.end('View error log on console');
        });
    } else {
        res.status(404).send({
            msg : "not found",
        }); 
    }
});
router.post('/login', (req, res)=>{
    var usrname = req.body.username;
    var passw = req.body.password;
    var type = req.body.type;
    console.log(req.body)
    if(!usrname || !passw || !type) {
        res.json("err--");
    }
    UserRepos.login(usrname, passw, type)
       .then(user =>{
           console.log(user);
           if(user){             
               var acToken = AuthRepos.generateAccessToken(user);
               var rfToken = AuthRepos.generateRefreshToken();
               
               AuthRepos.updateRefreshToken(user.uid, rfToken)
               .then(()=>{
                   var user_res = {
                        user: {
                            uid : user.uid,
                            username: user.username,
                            type: user.user_type,
                            access_token: acToken,
                            refresh_token : rfToken
                        },                        
                    };
                   res.status(200).json(user_res);
               })
               .catch(err=>{                   
                   res.statusCode = 500;
                   res.end('View error log on console');
               });
           } else{
                   res.status(404).send({
                       msg : "not found",
                   });
           }           
       }).catch(err => {
           console.log(err)
            res.end("err")
        });

});
module.exports = router;