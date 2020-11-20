const express = require('express');
const router = express.Router();
const multer = require('multer');

router.use(multer({
	dest: 'images'
}).single('image'))

const pool = require('../database');
const { isLoggedIn, isLoggedInAD } = require('../lib/auth');


router.get('/', isLoggedIn ,async (req, res) => {
	const links = await pool.query('SELECT * FROM links');
    res.render('index', { links });
});													

router.post('/search', isLoggedIn ,async (req, res) => {
	const {select, search} = req.body;
	console.log(select);
	console.log(search);
		if (select == 'todos') {
		const links = await pool.query('SELECT * FROM links WHERE marca = ?', [search]);
		res.render('index', { links });		
		}else if(select == 'despensa'){
			const links = await pool.query('SELECT * FROM links WHERE categoria = ?', [select]);
			res.render('index', { links });
		}
		else if(select == 'snacks'){
			const links = await pool.query('SELECT * FROM links WHERE categoria = ?', [select]);
			res.render('index', { links });
		}
		else if(select == 'otros'){
			const links = await pool.query('SELECT * FROM links WHERE categoria = ?', [select]);
			res.render('index', { links });
		}
		else if(select == 'todos' && search == undefined){
			const links = await pool.query('SELECT * FROM links');
			res.render('index', { links });
		}    
});

router.post('/buy/:id', isLoggedIn ,async (req, res) => {
	const {
		title,
		precioNum,
		cantidad,
	} = req.body;

	const sql = await pool.query('SELECT * FROM links WHERE id = ?', [req.params.id]);
	const cantidadSql = sql[0].stock;
	const resultado = cantidadSql - cantidad;

	await pool.query('UPDATE links set stock = ? WHERE id = ?', [resultado, req.params.id])

	const total = precioNum * cantidad;
	const messenger = `======= FACTURA DE LA COMPRA =======
====================================
= PRODUCTO ========================
= ${title} (${cantidad}) ==== $${precioNum}.00
======== DELIVERY GRATUITO =========
====================================
= TOTAL A PAGAR = $${total}.00 ===============`
	res.redirect(`https://api.whatsapp.com/send?phone=584243473812&text=${messenger}`);
})

router.get('/admin', isLoggedInAD ,async (req, res) => {
	const links = await pool.query('SELECT * FROM links');
	res.render('admin/index', {links})
})


module.exports = router;