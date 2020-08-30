const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const app = express();

// mongoose.connect('mongodb+srv://sajeevan96:20.03.1996@cluster0.rbzzm.gcp.mongodb.net/AppDB?retryWrites=true&w=majority/AppDB', 
// {useNewUrlParser: true,
// useCreateIndex:true,
// useUnifiedTopology:true,
// });

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongodb Connected");
});
//nidleware
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user", userRoute);

app.route("/").get((req,res)=>res.json("Hello world"));

app.listen(port, () => console.log('Welcome your listening at port ${port}'));

