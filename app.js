// variables
const bannerTitle = document.querySelector('.banner-title'),
 cartBtn = document.querySelector('.cart-btn'),
closeCartBtn = document.querySelector('.close-cart'),
clearCartBtn = document.querySelector('.clear-cart'),
cartDOM = document.querySelector('.cart'),
cartOverlay = document.querySelector('.cart-overlay'),
cartItems = document.querySelector('.cart-items'),
cartTotal = document.querySelector('.cart-total'),
cartContent = document.querySelector('.cart-content'),
productsDOM= document.querySelector('.products-center');

//cart
let cart = []

// buttons
let buttonsDOM = []

//getting the product
class Products{
    async getProducts(){
        try{
            let result = await fetch('products.json')
            let data = await result.json()
            let products  =data.items;
            products = products.map(item=>{
                const {title,price,image} = item.fields;
                const {id} = item.sys
               
                return {title,price,id,image}
            })
            return products;
        } catch(error){
            console.log(error);
        }
    }
}

// display products
class UI{
    titleTextFormat(){
        let text = bannerTitle.innerText;
        let index = 5;
        setInterval(() => {
            bannerTitle.innerHTML = text.slice(0, index);
        index++;
        if(index > text.length){
            index = 12;
        }
        }, 300);
    }
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result+=  `
            <!-- single Product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to bag
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>
            <!-- single Product -->
            `
        });
        productsDOM.innerHTML = result;
    }
    getBagBtns(){
       const btns = [...document.querySelectorAll('.bag-btn')];
       buttonsDOM = btns;
       btns.forEach(btn =>{
        let id = btn.dataset.id;
        let inCart = cart.find(item => item.id === id);
        if(inCart){
            btn.innerText = "In Cart";
            btn.disabled = true
        }
        btn.addEventListener('click', event =>{
            event.target.innerText = "In Cart"
            event.target.disabled = true;
            console.log(btn.innerText);
                //get product from product
                let cartItem = { ...Storage.getProduct(id), 
                "amount": 1};
                // add product to the cart
                cart = [...cart, cartItem]
                // save cart in local storage
                Storage.saveCart(cart)
                // set cart value
                this.setCartValue(cart)
                // display cart item
                    this.addcartItem(cartItem)
                // show the cart
                // this.showCart()
                
            })
        
    })
    }
    setCartValue(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map( item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        
    }
    addcartItem(item){
        const div = document.createElement('div')

        div.classList.add('cart-item')

        div.innerHTML =`
        <img src=${item.image} alt="">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}> 
                remove
            </span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        `
        cartContent.appendChild(div);
        
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart')
    }
    setupApp(){
        cart = Storage.getCart();
        this.setCartValue(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart)
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    populateCart(cart){
        cart.forEach(item => this.addcartItem(item));
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart')
    }
    cartLogic(){
        //clear cart btn
        clearCartBtn.addEventListener('click',()=>{
            this.clearCart();
            
        });
        // cart functionality
        cartContent.addEventListener('click', event=>{
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValue(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount

            }else if(event.target.classList.contains('fa-chevron-down')){
                let decAmount =event.target;
                let id =  decAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValue(cart);
                    decAmount.previousElementSibling.innerText = tempItem.amount
                }else{
                    cartContent.removeChild(decAmount.parentElement.parentElement)
                    this.removeItem(id)
                }
               
            }
        })
    }
    clearCart(){
        let cartItems = cart.map(item => item.id)
        cartItems.forEach(id => this.removeItem(id))
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id)
        this.setCartValue(cart);
        Storage.saveCart(cart);
        let button = this.getSingleBtn(id);
        button.disabled = false
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
    }
    getSingleBtn(id){
        return buttonsDOM.find(button => button.dataset.id === id)
    }
   
}

// local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id)
    } 
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem('cart') ?  JSON.parse(localStorage.getItem('cart')) : []
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupApp()

    // get all the products
    products.getProducts().then(products => { ui.displayProducts(products);       
     Storage.saveProducts(products);
    
    }).then(()=>{
        ui.titleTextFormat();
        ui.getBagBtns();
        ui.cartLogic();
    })
})













