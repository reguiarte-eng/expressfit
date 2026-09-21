document.addEventListener('DOMContentLoaded', () => {
  let carrito = [];

  // Elementos de la interfaz
  const inputBusqueda = document.querySelector('input[type="search"]') || document.querySelector('.navbar input');
  const contadorCarrito = document.querySelector('#cart-count');
  const totalCarrito = document.querySelector('#cart-total');
  const listaCarrito = document.querySelector('#cart-items-list');
  
  // Elementos de la pestaña flotante
  const cartDrawer = document.querySelector('#cart-drawer');
  const toggleBtn = document.querySelector('#cart-toggle-btn');
  const closeBtn = document.querySelector('#close-cart-btn');

  // 1. Controles para abrir y cerrar la pestañita
  if (toggleBtn && closeBtn && cartDrawer) {
    toggleBtn.addEventListener('click', () => {
      cartDrawer.style.right = '0'; // Abre el panel
    });

    closeBtn.addEventListener('click', () => {
      cartDrawer.style.right = '-350px'; // Cierra el panel
    });
  }

  // 2. Conectar las tarjetas (.menu-card) del HTML existente
  const tarjetas = document.querySelectorAll('.menu-card');

  tarjetas.forEach((tarjeta) => {
    const titulo = tarjeta.querySelector('h3')?.innerText.trim() || 'Producto';
    const precioTexto = tarjeta.querySelector('.price')?.innerText || '$0';
    const precio = parseFloat(precioTexto.replace(/[^0-9.]/g, '')) || 0;

    // Crear el botón de "Agregar"
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = 'Agregar';
    boton.style.cssText = 'margin-top: 10px; width: 100%; padding: 8px; background-color: #2e7d32; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

    boton.addEventListener('click', () => {
      carrito.push({ titulo, precio });
      actualizarCarrito();
      cartDrawer.style.right = '0'; // Despliega la pestaña automáticamente al agregar
    });

    tarjeta.appendChild(boton);
  });

  // 3. Renderizar items dentro de la pestaña y actualizar la suma
  function actualizarCarrito() {
    const totalItems = carrito.length;
    const sumaTotal = carrito.reduce((acc, item) => acc + item.precio, 0);

    // Actualizar contadores globales
    if (contadorCarrito) contadorCarrito.textContent = totalItems;
    if (totalCarrito) totalCarrito.textContent = `$${sumaTotal.toFixed(2)} MXN`;

    // Renderizar la lista dentro del drawer
    listaCarrito.innerHTML = '';

    if (carrito.length === 0) {
      listaCarrito.innerHTML = '<li style="color: #888; text-align: center;">El carrito está vacío</li>';
      return;
    }

    carrito.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; font-size: 14px;';
      li.innerHTML = `
        <div>
          <strong style="display:block;">${item.titulo}</strong>
          <span style="color: #2e7d32;">$${item.precio} MXN</span>
        </div>
        <button onclick="eliminarDelCarrito(${index})" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-size: 16px;">&times;</button>
      `;
      listaCarrito.appendChild(li);
    });
  }

  // Permite borrar ítems directamente desde la pestaña
  window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
  };

  // 4. Filtro de Búsqueda
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', (e) => {
      const termino = e.target.value.toLowerCase().trim();

      tarjetas.forEach((tarjeta) => {
        const titulo = tarjeta.querySelector('h3')?.innerText.toLowerCase() || '';
        const descripcion = tarjeta.querySelector('p')?.innerText.toLowerCase() || '';

        if (titulo.includes(termino) || descripcion.includes(termino)) {
          tarjeta.style.display = 'block';
        } else {
          tarjeta.style.display = 'none';
        }
      });
    });
  }
});