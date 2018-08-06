var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/ravintolajoku';


MongoClient.connect(url, {useNewUrlParser: true}, (err, db) => {
    if (err != null) {
        console.error("Virhe yhteyden avaamisessa!" + err.message);
        throw err;
    }

    const dbo = db.db();
    console.log("Yhteys Mongoon saatu");
    const kokoelma = dbo.collection('ravintolajoku');

	//Hakee valittuihin hakuehtoihin perustuen kaikista ravintoloista 10 ensimmäistä ehdokasta.
    router.route('/')
        .get((req, res) => {
            kokoelma.find({borough: req.query.borough, cuisine: req.query.cuisine}).limit(10).toArray().then((result) => {
                console.log(res);
                res.json(result);
                // db.close();
            }).catch(function(err) {
                console.log(err.stack);
            });
        })
	//TODO korjaus & testaus
        .post((req, res) => {
            kokoelma.save(req.body, (err, result) => {
                if (err) return console.log(err);
                console.log('saved to database');
                res.redirect('/')
            })
        })
	//TODO korjaus & testaus
        .put((req, res) => {
            kokoelma.findOneAndUpdate({borough: req.body.borough}, {
                $set: {
                    name: req.query.name,
                    borough: req.query.borough
                }
            }, {
                //sort: {_id: -1},
                upsert: true
            }, (err, result) => {
                if (err) return res.send(err)
                res.json(result)
            })
        })
        .delete((req, res) => {
            kokoelma.findOneAndDelete({name: req.body.name},
                (err, result) => {
                    if (err) return res.send(500, err);
                    res.send({message: 'Object deleted! Hope you aint gonna miss it..'})
                })
        });



});

//Mahdollisuus poistaa nimen perusteella
router.route("/:name") .delete((req, res) => {
            kokoelma.findOneAndDelete({name: req.params.name},
                (err, result) => {
                    if (err) return res.send(500, err);
                    res.send({message: 'Object deleted! Hope you aint gonna miss it..'})
                })



module.exports = router;
