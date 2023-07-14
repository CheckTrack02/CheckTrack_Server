    const express = require('express');

    const app = express();
    const port = 80;
    const userRoute = require('./routes/user');
    const loginRoute = require('./routes/login');
    const groupRoute = require('./routes/group');



    app.use(express.json({
        limit: '50mb'
    }));


    app.listen(port, () => console.log('80번 포트에서 대기중'));

    app.use('/user', userRoute);
    app.use('/login', loginRoute);
    app.use('/group', groupRoute);
