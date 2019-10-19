// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-button');
const cartDom = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDom = document.querySelector('.products-center');

// cart
let cart = []
//buttons
let buttonsDOM = []
// getting the products
class Products {


    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json()
            let products = data.items

            products = products.map(item => {
                const { price, title } = item.fields
                const image = item.fields.image.fields.file.url
                const id = item.sys.id
                return { id, title, price, image }
            })

            return products
        }
        catch (error) {
            console.log("cant get products error :!", error)
        }
    }
}

//display products
class UI {

    displayProducts(products) {
        let result = ''
        products.forEach(product => {
            result += `
                  <!--un produit-->
                    <article class="product">
                        <div class="img-container">
                            <img
                                class="product-img"
                                src=${product.image}
                                alt="product"
                            />
                            <button class="bag-btn" data-id=${product.id}>
                                <i class="fas fa-shopping-cart"></i>
                                Ajouter au panier
               </button>
                        </div>
                        <h3>${product.title}</h3>
                        <h4>${product.price} $</h4>
                    </article>
                    <!--fin un produit-- >
                    `;
        });
        productsDom.innerHTML = result
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")]
        buttonsDOM = buttons
        buttons.forEach(button => {
            let id = button.dataset.id
            let inCart = cart.find(item => item.id === id)
            if (inCart) {
                button.innerText = "In Cart"
                button.disabled = true
            }


            button.addEventListener("click", event => {
                event.target.innerText = "In Cart";
                event.target.disabled = true
                let cartItem = { ...Storage.getProduct(id), amount: 1 }
                //add product to the cart
                cart = [...cart, cartItem]
                //save cart in local storage
                Storage.saveCart(cart)
                //set cart values
                this.setCartValues(cart)
                //Dispaly cart items
                this.addCartItem(cartItem);
                //show cart
                this.showCart()
            })

        })

    }

    setCartValues(cart) {
        let tempTotal = 0
        let itemsTotal = 0
        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2))
        cartItems.innerHTML = itemsTotal

    }

    addCartItem(item) {
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `   <img src=${item.image} />
                            <div>
                            <h4>${item.title}</h4>
                            <h5>${item.price}$</h5>
                            <div class="remove-item" data-id=${item.id} >Annuler</div>
                            </div>
                            <div>
                            <i class="fas fa-chevron-up" data-id=${item.id} ></i>
                            <p class="item-ammount">${item.amount}</p>
                            <i class="fas fa-chevron-down" data-id=${item.id} ></i>
                            </div>
                            `
        cartContent.appendChild(div)

    }

    showCart() {
        cartOverlay.classList.add('transparentBcg')
        cartDom.classList.add('showCart')
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg')
        cartDom.classList.remove('showCart')
    }
    setupAPP() {
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populateCart(cart)
        cartBtn.addEventListener('click', this.showCart)
        closeCartBtn.addEventListener('click', this.hideCart)
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item))
    }
    cartLogic() {
        //clear button

        clearCartBtn.addEventListener('click', () => {
            this.clearCart()
        })

        //remove
        cartContent.addEventListener('click', event => {

            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target
                let id = removeItem.dataset.id
                this.removeItem(id)
                cartContent.removeChild(removeItem.parentElement.parentElement)
            }
            else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target
                let id = addAmount.dataset.id
                let tempItem = cart.find(item => item.id === id)
                tempItem.amount = tempItem.amount + 1
                Storage.saveCart(cart)
                this.setCartValues(cart)
                addAmount.nextElementSibling.innerText = tempItem.amount
            }
            else if (event.target.classList.contains("fa-chevron-down")) {

                let lowerAmount = event.target
                let id = lowerAmount.dataset.id
                let tempItem = cart.find(item => item.id === id)
                tempItem.amount = tempItem.amount - 1
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart)
                    this.setCartValues(cart)
                    lowerAmount.previousElementSibling.innerText = tempItem.amount
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement)
                    this.removeItem(id)
                }
            }
        })
    }

    clearCart() {
        let cartItems = cart.map(item => item.id)
        cartItems.forEach(id => this.removeItem(id))
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart()
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id)
        this.setCartValues(cart)
        Storage.saveCart(cart)
        let button = this.getSingleButton(id)
        button.disabled = false
        button.innerHTML = `<i class="fas fa-shopping-cart"></i> Ajouter au panier`
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id)
    }

}
// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("produits", JSON.stringify(products))
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('produits'))
        return products.find(product => product.id === id)
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    static getCart(cart) {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupAPP()

    //get products
    products.getProducts().then(data => {
        ui.displayProducts(data)
        Storage.saveProducts(data)
    }).then(
        () => {
            ui.getBagButtons()
            ui.cartLogic()
        }
    )
})



















