
// Carrito

const cart = document.querySelectorAll('.cart-add');


const addItemToCart = (itemTitle, itemPrice, itemCategory, itemImg, itemCant) => {
	const shoppingCartRow = document.createElement('div');
	const btncart = document.createElement('div');
	const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer')
	const shoppingCartContent = `
		<div class="row border-bottom">
            <div class="col-2 p-2">
                <img src="${itemImg}" style="width: 100%;">
            </div>
            <div class="col-3 my-auto">
                <p style="font-family: Bebas Neue, cursive;">${itemTitle}</p>
            </div>
            <div class="col-2 my-auto" style="font-family: Bebas Neue, cursive;">
                ${itemPrice}
            </div>
            <div class="col-2 my-auto" style="font-family: Bebas Neue, cursive;">
                ${itemCant} UNI
            </div>
            <div class="col-1 my-auto" style="font-family: Bebas Neue, cursive;">
               	<button class="btn btn-danger p-3"><i class="fa fa-trash"></i></button>            
            </div>
        </div>
	`;

	shoppingCartRow.innerHTML = shoppingCartContent;
	shoppingCartItemsContainer.append(shoppingCartRow);
}

const addToCartClick = (event) => {
	const btn = event.target;
	const item = btn.closest('.item');


	// Variables del Producto

	const itemTitle = item.querySelector('.item-title').textContent;
	const itemPrice = item.querySelector('.item-price').textContent;
	const itemCategory = item.querySelector('.item-category').textContent;	
	const itemImg = item.querySelector('.item-img').src;
	const itemCant = item.querySelector('.item-cant').value;
	console.log(itemTitle + itemPrice + itemCant + itemCategory + itemImg);

	addItemToCart(itemTitle, itemPrice, itemCategory, itemImg, itemCant);
}


cart.forEach(btncart => {
	btncart.addEventListener('click', addToCartClick);
});
