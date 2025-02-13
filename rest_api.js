const express=require('express');
const app=express();
const fs=require('fs');
const user=require('./MOCK_DATA.json');
const path=require('path');


app.use(express.json());
app.use(express.urlencoded({extended : false}));

const port=8001;
app.get('/user',(req,res)=>{
    res.json(user);
});
app.get('/user/:id',(req,res)=>{
    const id=Number(req.params.id);
    const fuser=user.find(user=>user.id===id);
    if(fuser)
    {
        res.json(fuser);
    }
    else{
        res.status(404).json({ message: 'User not found' });
    }
});
app.delete('/user/:id',(req,res)=>{
    const id=Number(req.params.id);
    const userIndex=user.findIndex(user =>user.id===id);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const deletedUser = user.splice(userIndex, 1);
    fs.writeFileSync(path.join(__dirname, 'MOCK_DATA.json'), JSON.stringify(user, null, 2));

    res.status(200).json({ message: 'User deleted successfully', deletedUser });

});
app.post('/user',(req,res)=>{
    const { id,first_name ,last_name,email,gender} = req.body; // Make sure you're expecting all necessary fields

    if (!first_name || !last_name || !email ||!gender ) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const newUser = {
        id: user.length ? user[user.length - 1].id + 1 : 1, // New ID based on the current user length
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        gender:req.body.gender,
    };

    // Add the new user to the array
    user.push(newUser);

    fs.writeFileSync(path.join(__dirname,'MOCK_DATA.json'),JSON.stringify(user, null, 2));
    res.status(201).json(newUser);
});
app.listen(port,()=>{console.log("server start...")});

