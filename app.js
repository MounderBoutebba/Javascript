// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDom = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-Items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDom = document.querySelector('.products-center');

// cart
let cart = []

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
        buttons.forEach(button => {
            let id = button.dataset.id
            let inCart = cart.find(item => item.id === id)
            if (inCart) {
                button.innerText = "In Cart"
                button.disabled = true
            }
            else {
                button.addEventListener('click', (event) => {
                    event.target.innerText = "In Cart";
                    button.target.disabled = true

                })
            }
        })

    }
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("produits", JSON.stringify(products))
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();


    //get products
    products.getProducts().then(data => {
        ui.displayProducts(data)
        Storage.saveProducts(data)
    }).then(
        () => {
            ui.getBagButtons()
        }
    )
})



















