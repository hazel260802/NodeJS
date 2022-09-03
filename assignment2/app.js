const express = require('express');

const app = express();

// app.use((req,res,next) => {
//     console.log('First MiddleWare');
//     next();
// });
// app.use((req,res,next) => {
//     console.log('F MiddleWare');
//     res.send('<p>Assignment solved(almost)</p>');
// });

app.use("/user",(req,res,next)=> {
    console.log('/ middleware');
    res.send('<p>The middleware that handle users</p>');
});

app.use("/",(req,res,next)=> {
    console.log('/ middleware');
    res.send('<p>Assignment solved</p>');
});

app.listen(3000);