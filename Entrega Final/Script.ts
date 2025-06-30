document.addEventListener('DOMContentLoaded', function () {
  const productosContainer = document.getElementById('productos-container');
  const carritoContainer = document.getElementById('carrito-container');
  const contadorCarrito = document.getElementById('contador-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  fetch('https://fakestoreapi.com/products')
    .then(function (response) { return response.json(); })
    .then(function (productos) {
      productos.forEach(function (producto) {
        const card = document.createElement('div');
        card.className = 'card';
        const botonAgregar = document.createElement('button');
        botonAgregar.textContent = 'Añadir al carrito';
        botonAgregar.addEventListener('click', function () {
          agregarAlCarrito(producto);
        });

        card.innerHTML = '<img src="' + producto.image + '" alt="' + producto.title + '" width="100">' +
          '<h3>' + producto.title + '</h3>' +
          '<p>$' + producto.price + '</p>';
        card.appendChild(botonAgregar);
        productosContainer.appendChild(card);
      });
      actualizarCarrito();
    });

  function agregarAlCarrito(producto) {
    const existe = carrito.find(function (p) { return p.id === producto.id; });
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ id: producto.id, title: producto.title, price: producto.price, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarrito();
  }

  function actualizarCarrito() {
    carritoContainer.innerHTML = '';
    let total = 0;
    carrito.forEach(function (item) {
      const div = document.createElement('div');
      const botonEliminar = document.createElement('button');
      botonEliminar.textContent = 'Eliminar';
      botonEliminar.addEventListener('click', function () {
        eliminarDelCarrito(item.id);
      });
      div.textContent = item.title + ' x ' + item.cantidad + ' - $' + (item.price * item.cantidad);
      div.appendChild(botonEliminar);
      carritoContainer.appendChild(div);
      total += item.price * item.cantidad;
    });
    contadorCarrito.textContent = carrito.reduce(function (acc, item) { return acc + item.cantidad; }, 0);
    totalCarrito.textContent = total.toFixed(2);
  }

  function eliminarDelCarrito(id) {
    carrito = carrito.filter(function (item) { return item.id !== id; });
    guardarCarrito();
    actualizarCarrito();
  }

  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
});

