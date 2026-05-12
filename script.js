loadProductsFromServer();
let productsArray = [];
document.addEventListener('DOMContentLoaded', function() {
    const listproducts = document.querySelector('#listproducts');
    if (listproducts) {
        listproducts.addEventListener('click', getDataElements);
    }
    const contentProducts = document.querySelector('#contentProducts');
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const searchContainer = document.querySelector('.search-container');

    mobileMenuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        searchContainer.classList.toggle('active');
    });

    const cartBtn = document.querySelector('.btn-cart button');
    const cart = document.querySelector('.cart');

    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function() {
        cart.style.display = 'none';
    });

    cart.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    const loadProduct = localStorage.getItem('products');
    if (loadProduct){
        productsArray = JSON.parse(loadProduct);
        productsHtml();
        updateCartCount();
    }
    else{
        productsArray=[];
    }
});

function updateCartCount(){
    const cartCount = document.querySelector('#cartCount');
    cartCount.textContent = productsArray.length;
}
function updateTotal(){
    const total = document.querySelector('#total')
    let totalProduct = productsArray.reduce((total,prod)=> total+prod.precio*prod.quantity,0)
    total.textContent = `$${totalProduct.toFixed(2)}`;
}   
function getDataElements(e){
   if (e.target.classList.contains('btn-agregar')){
    const elementHtml = e.target.parentElement;
    selectData(elementHtml);
  
   }
}
function selectData(prod){
  
  const productObj={
    img: prod.querySelector('img').src,
    title: prod.querySelector('h3').textContent,
    precio: parseFloat(prod.querySelector('.precio').textContent.replace('$','')),
    id: parseInt(prod.querySelector('button[type="button"]').dataset.id, 10),
    quantity: 1
  }
  const exists = productsArray.some(prod => prod.id === productObj.id);
  if(exists){
    ShowAlert('El producto ya exite en el carrito','error');
return;
  }
 productsArray = [...productsArray,productObj];
 ShowAlert('El producto ya fue agregado', 'success')
 productsHtml();
 updateCartCount();
 updateTotal();
}
function productsHtml(){
    cleanHtml();
    productsArray.forEach(prod => {
        const{img,title,precio,quantity,id }=prod;
        const tr= document.createElement('tr');
        const tdImg = document.createElement('td');
        const prodImg = document.createElement('img');
        prodImg.src= img;
        prodImg.alt= 'image product'
        tdImg.appendChild(prodImg);

        const tdTitle = document.createElement('td');
        const prodTitle =document.createElement('p');
        prodTitle.textContent = title;
        tdTitle.appendChild(prodTitle);

        const tdPrecio = document.createElement('td');
        const prodPrecio =document.createElement('p');
        const newprecio = precio*quantity;
        prodPrecio.textContent = `$${(precio * quantity).toFixed(2)}`;
        tdPrecio.appendChild(prodPrecio);

        const tdQuantity = document.createElement('td');
        const prodQuantity =document.createElement('input');
        prodQuantity.type = 'number';
        prodQuantity.min= '1';
        prodQuantity.value = quantity;
        prodQuantity.dataset.id = id;
        prodQuantity.oninput = updateQuantity;
        tdQuantity.appendChild(prodQuantity);

        const tdDelete = document.createElement('td');
        const prodDelete =document.createElement('button');
        prodDelete.type = 'button';
        prodDelete.textContent = 'x';
        prodDelete.onclick = ()=> destroyProduct(id);
        tdDelete.appendChild(prodDelete);


        tr.append(tdImg, tdTitle, tdPrecio ,tdQuantity, tdDelete);

        contentProducts.appendChild(tr);
    });
    saveLocalStorage();
}

function saveLocalStorage(){
    localStorage.setItem('products', JSON.stringify(productsArray))
}

function updateQuantity(e){
 const newQuantity = parseInt(e.target.value,10);
 const idProd = parseInt(e.target.dataset.id,10);
 const product = productsArray.find(prod => prod.id === idProd);
 if (product && newQuantity > 0){
    product.quantity = newQuantity;
 }
 productsHtml();
 updateTotal();
 saveLocalStorage();
}

function destroyProduct(idProd){
   productsArray = productsArray.filter(prod => prod.id !== idProd);
   productsHtml();
   updateCartCount();
   updateTotal();
   saveLocalStorage();
}
function cleanHtml(){
    while (contentProducts.firstChild){
        contentProducts.removeChild(contentProducts.firstChild);
    }
} 
function ShowAlert(menssage, type){
    const nonReppeatAlert = document.querySelector('.alert');
    if (nonReppeatAlert) nonReppeatAlert.remove();
    const div = document.createElement('div');
    div.classList.add('alert', type);
    div.textContent = menssage;

    document.body.appendChild(div);

    setTimeout(()=> div.remove(),2000);
}
function exportCartToExcel() {
    if (productsArray.length === 0) {
        ShowAlert('El carrito está vacío.', 'error');
        return;
    }
    showClientModal();
}

function showClientModal() {
    const modal = document.getElementById('clientModal');
    modal.style.display = 'block';
    
    document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    document.getElementById('clientForm').onsubmit = function(e) {
        e.preventDefault();
        sendWhatsAppMessage();
    }
}

function sendWhatsAppMessage() {
    const phoneNumber = "573202898094"; // Reemplaza con tu número
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const clientNotes = document.getElementById('clientNotes').value;
    
    const total = productsArray.reduce((acc, prod) => acc + prod.precio * prod.quantity, 0);
    
    let whatsappMessage = `*NUEVO PEDIDO - Cat Motor Garcias*\n\n`;
    whatsappMessage += `*Cliente:* ${clientName}\n`;
    whatsappMessage += `*Teléfono:* ${clientPhone}\n`;
    
    if (clientAddress) {
        whatsappMessage += `*Dirección:* ${clientAddress}\n\n`;
    }
    
    whatsappMessage += `*DETALLE DEL PEDIDO:*\n\n`;
    
    productsArray.forEach(product => {
        whatsappMessage += `➤ ${product.title}\n`;
        whatsappMessage += `   Cantidad: ${product.quantity}\n`;
        whatsappMessage += `   $${product.precio.toFixed(2)} c/u\n`;
        whatsappMessage += `   Subtotal: $${(product.precio * product.quantity).toFixed(2)}\n\n`;
    });
    
    whatsappMessage += `*TOTAL:* $${total.toFixed(2)}\n\n`;
    
    if (clientNotes) {
        whatsappMessage += `*NOTAS:*\n${clientNotes}\n\n`;
    }
    
    whatsappMessage += `Por favor confirmar disponibilidad. ¡Gracias!`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    document.getElementById('clientModal').style.display = 'none';
    window.open(whatsappUrl, '_blank');
    

    productsArray = [];
    updateCartCount();
    saveLocalStorage();
}

async function loadProductsFromServer() {
    try {
        const res = await fetch('https://catmotor-api.onrender.com/productos');
        const data = await res.json();

        const contenedor = document.querySelector('#listproducts');
        contenedor.innerHTML = ''; // limpia

        data.forEach(p => {
            const div = document.createElement('div');
            div.classList.add('producto');
            div.setAttribute('data-id', p.id);

            div.innerHTML = `
                <a href="#">
                    <img src="${p.imagen}" alt="${p.nombre}">
                </a>
                <h3>${p.nombre}</h3>
                <p class="descripcion">${p.descripcion}</p>
                <p class="precio">$${p.precio}</p>
                <button class="btn-agregar" type="button" data-id="${p.id}">
                    ${p.disponible ? 'Agregar Carrito' : 'No disponible'}
                </button>
            `;

            // si no está disponible → desactivar botón
            if (!p.disponible) {
                div.querySelector('button').disabled = true;
            }

            contenedor.appendChild(div);
        });

    } catch (err) {
        console.error('Error cargando productos:', err);
    }
}

    // ── Riel de productos ──────────────────────────────────────────
    (async function initRiel() {
        const track    = document.getElementById('rielTrack');
        const prevBtn  = document.querySelector('.riel-prev');
        const nextBtn  = document.querySelector('.riel-next');
        let allProducts = [];
        let currentIndex = 0;
        const VISIBLE = 4;
        let autoTimer = null;

        function getCardWidth() {
            const card = track.querySelector('.producto-riel:not(.skeleton)');
            if (!card) return 236; // 220px + 16px gap
            const style = window.getComputedStyle(track);
            const gap   = parseInt(style.gap || style.columnGap || '16', 10);
            return card.offsetWidth + gap;
        }

        function renderCards(products) {
            track.innerHTML = '';
            products.forEach(p => {
                const div = document.createElement('div');
                div.classList.add('producto-riel');
                div.setAttribute('data-id', p.id);
                div.innerHTML = `
                    <a href="#">
                        <img src="${p.imagen}" alt="${p.nombre}"
                             onerror="this.src='imagenes/Logo.png'">
                    </a>
                    <h3>${p.nombre}</h3>
                    <p class="descripcion">${p.descripcion}</p>
                    <p class="precio">$${Number(p.precio).toLocaleString('es-CO')}</p>
                    <button class="btn-agregar" type="button" data-id="${p.id}"
                        ${p.disponible ? '' : 'disabled'}>
                        ${p.disponible ? 'Agregar al Carrito' : 'No disponible'}
                    </button>
                `;
                track.appendChild(div);
            });
        }

        function slideTo(index) {
            const maxIndex = Math.max(0, allProducts.length - VISIBLE);
            currentIndex   = Math.max(0, Math.min(index, maxIndex));
            track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }

        function startAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => {
                const maxIndex = Math.max(0, allProducts.length - VISIBLE);
                slideTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
            }, 4000);
        }

        prevBtn.addEventListener('click', () => { slideTo(currentIndex - 1); startAuto(); });
        nextBtn.addEventListener('click', () => { slideTo(currentIndex + 1); startAuto(); });

        // Soporte swipe táctil
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { slideTo(currentIndex + (diff > 0 ? 1 : -1)); startAuto(); }
        });

        // Agregar al carrito desde el riel (usa selectData del script.js)
        track.addEventListener('click', e => {
            if (e.target.classList.contains('btn-agregar') && !e.target.disabled) {
                selectData(e.target.closest('.producto-riel'));
            }
        });

        // Productos de ejemplo (fallback sin servidor)


        try {
            const res  = await fetch('https://catmotor-api.onrender.com/productos');
            const data = await res.json();
            // Mezclar aleatoriamente (Fisher-Yates)
            allProducts = data
                .filter(p => p.disponible)
                .sort(() => Math.random() - 0.5);
        } catch {
            allProducts = FALLBACK.sort(() => Math.random() - 0.5);
        }

        renderCards(allProducts);
        slideTo(0);
        startAuto();

        // Recalcular al redimensionar
        window.addEventListener('resize', () => slideTo(currentIndex));
    })();
