let discount = 0;
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}
function addToCart(name, price, image, event) {
    event.preventDefault();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1,
        image: image
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast("Produit ajouté au panier !");
  }
  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    updateCartCount();
}
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const subtotalElem = document.getElementById('subtotal-amount');
    const totalElem = document.getElementById('total-amount');
    if (!cartItems || !cartTotal || !subtotalElem || !totalElem) return;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty">Votre panier est vide 🛒</div>`;
        cartTotal.textContent = "0 TND";
        subtotalElem.textContent = "DT 0";
        totalElem.textContent = "DT 0";
        return;
    }
    let total = 0;
    let subtotal = 0;
    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        total += itemSubtotal;
        const itemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Prix : ${item.price} TND</p>
                    <p>Quantité : ${item.quantity}</p>
                    <p>Sous-total : ${itemSubtotal} TND</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="removeFromCart(${index})">Supprimer</button>
                </div>
            </div>
        `;
        cartItems.innerHTML += itemHTML;
    });
    let discountedTotal = total;
    if (discount > 0) {
        discountedTotal = total * (1 - discount); 
    }
    subtotalElem.textContent = `DT ${subtotal}`;
    totalElem.textContent = `DT ${discountedTotal.toFixed(2)}`;
    cartTotal.textContent = `${discountedTotal.toFixed(2)} TND`; 
}
document.addEventListener("DOMContentLoaded", updateCart);
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); 
}
function updateCartTotalDisplay(total) {
    const subtotalElem = document.getElementById('subtotal-amount');
    const totalElem = document.getElementById('total-amount');
    if (subtotalElem && totalElem) {
        subtotalElem.textContent = `DT ${total}`;
        totalElem.textContent = `DT ${total}`;
    }
}
function applyCoupon() {
    const couponCode = document.getElementById("coupon-code").value.trim();
    console.log("Coupon saisi:", couponCode);

    const couponMessage = document.getElementById("coupon-message");
    if (couponCode === "HAPPYGOMYCODER") {
        discount = 0.15; 
        couponMessage.textContent = "Coupon appliqué avec succès ! Vous bénéficiez d'une remise de 15%.";
        couponMessage.style.color = "green"; 
    } else {
        discount = 0; 
        couponMessage.textContent = "Code de coupon invalide. Essayez à nouveau.";
        couponMessage.style.color = "red"; 
    }
    updateCart();
}
function showPage(pageNumber, event) {
  event.preventDefault(); 

  const allProducts = document.querySelectorAll('.pro');
  allProducts.forEach(product => {
    product.style.display = product.classList.contains(`page-${pageNumber}`) ? 'block' : 'none';
  });
  const productsSection = document.querySelector('.pro-container');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' });
  }
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => {
        const quantity = parseInt(item.quantity);
        return total + (isNaN(quantity) ? 0 : quantity);
    }, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = count;
    } else {
        console.log('Élément #cart-count non trouvé.');
    }
    const cartCountMobile = document.getElementById('cart-count-mobile');
    if (cartCountMobile) {
        cartCountMobile.innerText = count;
    } else {
        console.log('Élément #cart-count-mobile non trouvé.');
    }
    console.log('Panier:', cart);
    console.log('Nombre total d\'articles dans le panier:', count);
}
window.onload = function() {
    updateCartCount();
};
function redirectToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        const emptyCartMessage = document.createElement('div');
        emptyCartMessage.textContent = 'Votre panier est vide. Ajoutez des produits avant de passer commande.';
        emptyCartMessage.style.position = 'fixed';
        emptyCartMessage.style.top = '20px';
        emptyCartMessage.style.left = '50%';
        emptyCartMessage.style.transform = 'translateX(-50%)';
        emptyCartMessage.style.backgroundColor = '#e30613';
        emptyCartMessage.style.color = 'white';
        emptyCartMessage.style.padding = '15px 25px';
        emptyCartMessage.style.borderRadius = '8px';
        emptyCartMessage.style.zIndex = '10000';
        emptyCartMessage.style.fontWeight = 'bold';
        emptyCartMessage.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        document.body.appendChild(emptyCartMessage);

        setTimeout(() => emptyCartMessage.remove(), 4000);
        return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'checkout-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.zIndex = '9998';
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.innerHTML = `
        <h2 style="color: #e30613; font-size: 28px; margin-bottom: 10px;">Confirmation de commande</h2>
        <p style="margin-bottom: 10px;">Veuillez remplir vos informations :</p>
        <input type="text" id="user-name" placeholder="Nom complet" style="margin-bottom: 10px; padding: 10px; width: 100%; border: 1px solid #ccc; border-radius: 8px;">
        <input type="text" id="user-address" placeholder="Adresse de livraison" style="margin-bottom: 10px; padding: 10px; width: 100%; border: 1px solid #ccc; border-radius: 8px;">
        <input type="tel" id="user-phone" placeholder="+216 00 000 000" style="margin-bottom: 15px; padding: 10px; width: 100%; border: 1px solid #ccc; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between;">
            <button id="confirmOrder" style="background: #e30613; color: white; padding: 10px 20px; border: none; border-radius: 6px;">Confirmer</button>
            <button id="cancelOrder" style="background: #999; color: white; padding: 10px 20px; border: none; border-radius: 6px;">Annuler</button>
        </div>
    `;
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'white';
    modal.style.padding = '30px';
    modal.style.borderRadius = '16px';
    modal.style.zIndex = '9999';
    modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';
    modal.style.maxWidth = '400px';
    modal.style.width = '90%';
    modal.style.fontFamily = 'Arial, sans-serif';
    modal.style.textAlign = 'center';

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    document.getElementById('cancelOrder').onclick = () => {
        overlay.remove();
        modal.remove();
    };

    document.getElementById('confirmOrder').onclick = () => {
        const name = document.getElementById('user-name').value.trim();
        const address = document.getElementById('user-address').value.trim();
        const phone = document.getElementById('user-phone').value.trim();

        if (!name || !address || !phone.match(/^\+?\d{8,15}$/)) {
            const alertMessage = document.createElement('div');
            alertMessage.textContent = 'Veuillez remplir tous les champs correctement.';
            alertMessage.style.position = 'fixed';
            alertMessage.style.top = '20px';
            alertMessage.style.left = '50%';
            alertMessage.style.transform = 'translateX(-50%)';
            alertMessage.style.backgroundColor = '#e30613';
            alertMessage.style.color = 'white';
            alertMessage.style.padding = '15px 25px';
            alertMessage.style.borderRadius = '8px';
            alertMessage.style.zIndex = '10000';
            alertMessage.style.fontWeight = 'bold';
            alertMessage.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            document.body.appendChild(alertMessage);

            setTimeout(() => alertMessage.remove(), 4000);
            return; 
        }

        overlay.remove();
        modal.remove();

        const success = document.createElement('div');
        success.textContent = 'Commande confirmée avec succès !';
        success.style.position = 'fixed';
        success.style.top = '20px';
        success.style.left = '50%';
        success.style.transform = 'translateX(-50%)';
        success.style.backgroundColor = '#28a745';
        success.style.color = 'white';
        success.style.padding = '15px 25px';
        success.style.borderRadius = '8px';
        success.style.zIndex = '10000';
        success.style.fontWeight = 'bold';
        success.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        document.body.appendChild(success);

        setTimeout(() => {
            success.remove();
            localStorage.setItem('cart', JSON.stringify([]));
            window.location.reload();
        }, 3000);
    };
}




