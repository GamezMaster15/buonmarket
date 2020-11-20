const express = require('express');
const router = express.Router();

const path = require('path');
const multer = require('multer');
const fs = require('fs');

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images/'),
    filename:  (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const uploadImage = multer({
    storage,
    limits: {fileSize: 1000000}
}).single('image');

router.get('/image/:title', (req, res) => {
    const {title} = req.params;    
    res.render('links/add', {title})
});

router.post('/image/:title', (req, res) => {
    const { title } = req.params;
    uploadImage(req, res, async (err) => {
        if (err) {
            err.message = 'The file is so heavy for my service';
            return res.send(err);
        }
        const imagen = req.file.filename;
        await pool.query('UPDATE links set imagen = ? WHERE title = ?', [imagen, title])
        res.redirect('/admin');
    });
});

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, precioNum, categoria, marca, titlepublic, stock } = req.body;
    const newLink = {
        title,
        precioNum,
        categoria,
        marca,
        titlepublic,
        stock
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    res.redirect(`/links/image/${req.body.title}`);
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Eliminado con exito');
    res.redirect('/admin');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/list', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, precioNum, categoria, marca, titlepublic, stock } = req.body;
    const newLink = {
        title,
        precioNum,
        categoria,
        marca,
        titlepublic,
        stock
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Editado con exito');
    res.redirect(`/links/image/${title}`);
});


router.get('/profile', isLoggedIn, async (req, res) => {
  const links = await pool.query('SELECT * FROM links');
  res.render('profile', {links});
});

module.exports = router;