function routes(app){
        // app.route('/api/robot-users')
        app.get('/api/robot-users', (req, resp) => {
            resp.send('un get avec succé')
        })

    }
//console.log("bien")
module.exports=routes;