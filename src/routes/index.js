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
	const cart = await pool.query('SELECT * FROM cart WHERE user_id = ?', [req.user.id]);

	const costo = () => {
		let suma = 0;
		let multiplica = 0;
		cart.forEach(items => {			
			multiplica = items.cantidad * items.precio ;
			suma += multiplica;
		})
		return suma;
	};
	costo();

    res.render('index', { links, cart, costo });
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

router.get('/buy/:costo', isLoggedIn ,async (req, res) => {
	const {costo} = req.params
	
	const sql = await pool.query('SELECT * FROM cart WHERE user_id = ?', [req.user.id]);

	const factura = () => {
		let body = ``; 
		let row= ``;
		sql.forEach(item => {
			rows = `== ${item.producto} => ( ${item.cantidad} UND ) ========= $${item.precio} x UND
			`;
			body += rows;
		});
		console.log(body);
		return body;
	}

	const body = factura();

	res.redirect(`https://api.whatsapp.com/send?phone=584243473812&text================= FACTURA DE LA COMPRA ================
======================================================
== PRODUCTOS ========================================
======================================================
${body}
======================================================
=========== DELIVERY ACORDAR VIA WHATSAPP  ===========
======================================================
== TOTAL : $${costo} ========================================
======================================================`);

})

router.get('/admin', isLoggedInAD ,async (req, res) => {
	const links = await pool.query('SELECT * FROM links');
	res.render('admin/index', {links})
})

router.post('/cart/:id', isLoggedIn, async (req, res) => {
	const {id} = req.params;
	const sql = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
	const title = sql[0].titlepublic;
	const precioNum = sql[0].precioNum;
	const {cantidad} = req.body;
	const imagen = sql[0].imagen;
	console.log(title)
	const newLink = {
		producto : title,
		precio : precioNum,
		cantidad,
		imagen,
		user_id : req.user.id
	};
	await pool.query('INSERT INTO cart set ?', [newLink]);
	res.redirect('/');
});

router.post('/cart/uploads/:id', isLoggedIn, async (req, res) => {
	const { id } = req.params;
	const { cantidad } = req.body;
	await pool.query('UPDATE cart set cantidad = ? WHERE id = ?', [cantidad, id]);
	res.redirect('/');
});

router.get('/cart/delete/:id', isLoggedIn, async (req, res) => {
	const {id} = req.params;
	await pool.query('DELETE FROM cart WHERE ID = ?', [id])
})

module.exports = router;