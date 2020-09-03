const express = require("express");
const User = require("../models/user.model");
const config= require("../config");
const jwt = require("jsonwebtoken");
const { request } = require("express");
const middleware = require("../middleware");
const router = express.Router();

router.route("/:username").get(middleware.checkToken, (req, res)=> {
    User.findOne({username: req.params.username}, (err, result) =>{
        if(err) return res.status(500).json({msg: err});
        return res.json({
            data: result,
            username: req.params.username,
        });
    });
});

router.route("/checkusername/:username").get((req, res) =>{
    User.findOne({username: req.params.username}, (err, result) =>{
        if(err) return res.status(500).json({msg: err});
        if(result!==null){
            return res.json({
                Status: true,
            });
        }
        else 
        return res.json({
            Status:false,
        });
    });
});

router.route("/login").post((req, res)=> {
    User.findOne({username: req.body.username}, (err, result) =>{
        if(err) return res.status(500).json({msg: err});
        if(result === null){
        return res.status(403).json("Username incorrect");
        }
        if(result.password === req.body.password){
            //implement JWT token 
            let token = jwt.sign({ username: req.body.username }, config.key, {
                expiresIn: "24", //expire in 24 hours
            });
            res.json({
                token: token,
                msg: "sucess",
            });
        }
        else{
            res.status(403).json("Password is incorrect");
        }
    });
});

router.route("/register").post((req,res) => {
console.log("inside the register");
const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
});
user
    .save()
    .then(() => {
        console.log("user registered");
        res.status(200).json("ok");
    })
    .catch((err) => {
        res.status(403).json({ msg: err});
    });
    res.json("registerd");
});

router.route("/update/:username").patch((req, res) => {
    User.findOneAndUpdate(
        { username: req.params.username},
        { $set: {password:req.body.password} },
        (err, result) => {
            if (err) return res.status(500).json({msg:err});
            const msg = {
                msg: "pasword sucessfully updated",
                username: req.params.username,
            };
            return res.json(msg);
        }
    );
});

router.route("/delete/:username").patch((req, res) => {
    User.findOneAndDelete(
        { username: req.params.username},
        (err, result) => {
            if (err) return res.status(500).json({msg:err});
            const msg = {
                msg: "User deleted",
                username: req.params.username,
            };
            return res.json(msg);
        }
    );
});

module.exports = router;