document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const btnMostrarForm = document.getElementById("btn-mostrar-form");
    const btnCancelar = document.getElementById("btn-cancelar");
    const formContainer = document.getElementById("form-container");
    const formProducto = document.getElementById("form-producto");
    const contenedorProductos = document.getElementById("contenedor-productos");
    const tituloForm = document.getElementById("titulo-form");
    const btnSubmit = document.getElementById("btn-submit");
    const inputId = document.getElementById("producto-id") || { value: "" };
    const inputNombre = document.getElementById("producto-nombre");
    const inputDesc = document.getElementById("producto-descripcion");
    const inputPrecio = document.getElementById("producto-precio");
    const inputCategoria = document.getElementById("producto-categoria");
    const inputAlcohol = document.getElementById("producto-alcohol");
    const inputStock = document.getElementById("producto-stock");
  
    // Verificación de elementos críticos
    if (!inputNombre || !inputPrecio || !inputCategoria) {
      console.error("Elementos críticos del formulario no encontrados!");
      return;
    }
  
    // Estado del formulario
    let editando = false;
    let idActual = null;
  
    // Event Listeners
    btnMostrarForm.addEventListener("click", toggleForm);
    btnCancelar.addEventListener("click", resetearForm);
    formProducto.addEventListener("submit", manejarSubmit);
    contenedorProductos.addEventListener("click", manejarClicksContenedor);
  
    // Funciones
    function toggleForm() {
      formContainer.classList.toggle("d-none");
      btnMostrarForm.classList.toggle("btn-primary");
      btnMostrarForm.classList.toggle("btn-outline-primary");
      btnMostrarForm.innerHTML = formContainer.classList.contains("d-none")
        ? '<i class="fas fa-plus me-2"></i>Agregar Producto'
        : '<i class="fas fa-minus me-2"></i>Ocultar Formulario';
    }
  
    function manejarSubmit(e) {
      e.preventDefault();
  
      const productoData = {
        nombre: inputNombre.value,
        precio: parseFloat(inputPrecio.value),
        categoria: inputCategoria.value,
        descripcion: inputDesc.value,
        gradoAlcohol: inputCategoria.value === 'cerveza' || inputCategoria.value === 'coctel' 
                     ? parseFloat(inputAlcohol.value) 
                     : undefined,
        stock: parseInt(inputStock.value)
      };
  
      if (editando && idActual) {
        actualizarProducto(idActual, productoData);
      } else {
        crearProducto(productoData);
      }
    }
  
    function manejarClicksContenedor(e) {
      // Botón eliminar
      if (e.target.closest(".btn-eliminar")) {
        const boton = e.target.closest(".btn-eliminar");
        const card = boton.closest(".card-producto");
        const id = boton.dataset.id;
  
        if (confirm("¿Estás seguro de querer desactivar este producto?")) {
          desactivarProducto(id, card);
        }
      }
  
      // Botón editar
      if (e.target.closest(".btn-editar")) {
        const boton = e.target.closest(".btn-editar");
        const card = boton.closest(".card-producto");
        const id = boton.dataset.id;
  
        prepararEdicion(
          id,
          card.querySelector(".nombre-producto").textContent,
          card.querySelector(".desc-producto").textContent,
          card.querySelector(".precio-producto").textContent.replace("$", ""),
          card.querySelector(".categoria-producto").dataset.categoria,
          card.querySelector(".stock-producto").textContent.match(/\d+/)[0],
          card.querySelector(".alcohol-producto")?.textContent.match(/\d+\.?\d*/)?.[0]
        );
      }
    }
  
    // Operaciones con la API
    async function crearProducto(datos) {
      try {
        const response = await fetch("/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        });
  
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  
        const nuevoProducto = await response.json();
  
        // Actualizar UI
        const estadoVacio = contenedorProductos.querySelector(".estado-vacio");
        if (estadoVacio) estadoVacio.remove();
  
        contenedorProductos.prepend(crearCardProducto(nuevoProducto));
        resetearForm();
  
        return nuevoProducto;
      } catch (error) {
        console.error("Error al crear producto:", error);
        alert("Error al crear producto. Por favor intente nuevamente.");
      }
    }
  
    async function actualizarProducto(id, datos) {
      try {
        const response = await fetch(`/api/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        });
  
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  
        const productoActualizado = await response.json();
  
        // Actualizar UI
        const card = contenedorProductos.querySelector(`[data-id="${id}"]`);
        if (card) {
          card.querySelector(".nombre-producto").textContent = productoActualizado.nombre;
          card.querySelector(".desc-producto").textContent = productoActualizado.descripcion || "";
          card.querySelector(".precio-producto").textContent = `$${productoActualizado.precio.toFixed(2)}`;
          card.querySelector(".categoria-producto").textContent = 
            productoActualizado.categoria.charAt(0).toUpperCase() + productoActualizado.categoria.slice(1);
          card.querySelector(".categoria-producto").dataset.categoria = productoActualizado.categoria;
          card.querySelector(".stock-producto").textContent = `Stock: ${productoActualizado.stock}`;
          
          const alcoholElement = card.querySelector(".alcohol-producto");
          if (alcoholElement) {
            alcoholElement.textContent = productoActualizado.gradoAlcohol 
              ? `${productoActualizado.gradoAlcohol}% alc.` 
              : "";
          }
        }
  
        resetearForm();
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        alert("Error al actualizar producto. Por favor intente nuevamente.");
      }
    }
  
    async function desactivarProducto(id, elemento) {
      try {
        const response = await fetch(`/api/productos/${id}`, {
          method: "DELETE"
        });
  
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  
        elemento.remove();
        verificarEstadoVacio();
      } catch (error) {
        console.error("Error al desactivar producto:", error);
        alert("Error al desactivar producto. Por favor intente nuevamente.");
      }
    }
  
    // Funciones auxiliares
    function crearCardProducto(producto) {
      const div = document.createElement("div");
      div.className = "col-md-6 col-lg-4 mb-4";
      div.dataset.id = producto._id || producto.id;
      
      div.innerHTML = `
        <div class="card card-producto h-100 shadow-sm ${!producto.activo ? 'bg-light' : ''}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h3 class="nombre-producto h5 mb-0">${producto.nombre}</h3>
              <span class="precio-producto badge bg-primary rounded-pill">$${producto.precio.toFixed(2)}</span>
            </div>
            
            <p class="desc-producto text-muted small mb-2">${producto.descripcion || ''}</p>
            
            <div class="d-flex flex-wrap gap-2 mb-3">
              <span class="categoria-producto badge ${getBadgeColor(producto.categoria)}" 
                    data-categoria="${producto.categoria}">
                ${producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}
              </span>
              ${producto.gradoAlcohol ? `
                <span class="alcohol-producto badge bg-info">
                  ${producto.gradoAlcohol}% alc.
                </span>
              ` : ''}
              <span class="stock-producto badge ${producto.stock > 0 ? 'bg-success' : 'bg-warning'}">
                Stock: ${producto.stock}
              </span>
            </div>
            
            <div class="d-flex justify-content-end gap-2">
              <button class="btn-editar btn btn-sm btn-outline-primary" data-id="${producto._id || producto.id}">
                <i class="fas fa-edit me-1"></i> Editar
              </button>
              <button class="btn-eliminar btn btn-sm btn-outline-danger" data-id="${producto._id || producto.id}">
                <i class="fas fa-trash me-1"></i> ${producto.activo ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      `;
      
      return div;
    }
  
    function getBadgeColor(categoria) {
      const colores = {
        cerveza: 'bg-warning text-dark',
        coctel: 'bg-danger',
        bebida: 'bg-info text-dark',
        comida: 'bg-success',
        snack: 'bg-secondary'
      };
      return colores[categoria] || 'bg-dark';
    }
  
    function prepararEdicion(id, nombre, descripcion, precio, categoria, stock, alcohol) {
      editando = true;
      idActual = id;
  
      // Actualizar UI del formulario
      tituloForm.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Producto';
      btnSubmit.innerHTML = '<i class="fas fa-save me-1"></i>Guardar Cambios';
  
      // Establecer valores del formulario
      if (inputId) inputId.value = id;
      inputNombre.value = nombre;
      inputDesc.value = descripcion;
      inputPrecio.value = precio;
      inputCategoria.value = categoria;
      inputStock.value = stock;
      
      if (alcohol) inputAlcohol.value = alcohol;
  
      // Mostrar campos relevantes según categoría
      toggleCamposAlcohol();
  
      // Mostrar formulario si está oculto
      if (formContainer.classList.contains("d-none")) {
        toggleForm();
      }
    }
  
    function toggleCamposAlcohol() {
      const esBebidaAlcoholica = ['cerveza', 'coctel'].includes(inputCategoria.value);
      document.getElementById("alcohol-group").style.display = esBebidaAlcoholica ? 'block' : 'none';
    }
  
    function verificarEstadoVacio() {
      if (contenedorProductos.children.length === 0) {
        contenedorProductos.innerHTML = `
          <div class="col-12 estado-vacio text-center py-5">
            <i class="fas fa-glass-martini-alt fa-4x mb-3 text-muted"></i>
            <h3 class="h4">No hay productos registrados</h3>
            <p class="text-muted">Haz clic en "Agregar Producto" para comenzar</p>
          </div>
        `;
      }
    }
  
    function resetearForm() {
      editando = false;
      idActual = null;
  
      // Resetear valores del formulario
      if (inputId) inputId.value = "";
      formProducto.reset();
  
      // Resetear UI del formulario
      tituloForm.innerHTML = '<i class="fas fa-plus me-2"></i>Agregar Producto';
      btnSubmit.innerHTML = '<i class="fas fa-save me-1"></i>Guardar Producto';
      formContainer.classList.add("d-none");
  
      // Resetear estado del botón
      btnMostrarForm.classList.remove("btn-outline-primary");
      btnMostrarForm.classList.add("btn-primary");
      btnMostrarForm.innerHTML = '<i class="fas fa-plus me-2"></i>Agregar Producto';
    }
  
    // Inicialización
    function init() {
      // Configurar evento para campos dependientes
      inputCategoria.addEventListener("change", toggleCamposAlcohol);
      
      // Cargar productos iniciales
      cargarProductosIniciales();
    }
  
    async function cargarProductosIniciales() {
      try {
        const response = await fetch("/api/productos");
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const productos = await response.json();
        
        if (productos.length === 0) {
          verificarEstadoVacio();
        } else {
          productos.forEach(producto => {
            contenedorProductos.appendChild(crearCardProducto(producto));
          });
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
        verificarEstadoVacio();
      }
    }
  
    // Iniciar
    init();
  });
  
  