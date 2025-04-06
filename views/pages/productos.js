<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Productos del Bar</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome para iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
      .card-producto {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        height: 100%;
      }
      .card-producto:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
      .badge-precio {
        font-size: 1.1rem;
        background-color: #198754;
      }
      .estado-vacio {
        padding: 3rem;
        text-align: center;
        color: #6c757d;
      }
      .contenedor-form {
        background-color: #f8f9fa;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
      }
      .badge-categoria {
        font-size: 0.8rem;
      }
    </style>
  </head>
  <body class="bg-light">
    <div class="container py-5">
      <div class="row mb-4">
        <div class="col-12 text-center">
          <h1 class="display-4 fw-bold text-primary">
            <i class="fas fa-glass-martini-alt me-2"></i>Gestión de Productos
          </h1>
          <p class="lead text-muted">Administración de bebidas y alimentos</p>
        </div>
      </div>

      <div class="row mb-4 justify-content-center">
        <div class="col-md-8">
          <button id="btn-mostrar-form" class="btn btn-primary w-100 py-2">
            <i class="fas fa-plus me-2"></i>Agregar Producto
          </button>
        </div>
      </div>

      <div id="form-container" class="row justify-content-center mb-4 d-none">
        <div class="col-md-8">
          <div class="contenedor-form shadow-sm">
            <h3 class="mb-4 text-center" id="titulo-form"><i class="fas fa-pencil-alt me-2"></i>Nuevo Producto</h3>
            <form id="form-producto">
              <input type="hidden" id="producto-id" value="">
              
              <div class="mb-3">
                <label for="producto-nombre" class="form-label">Nombre*</label>
                <input type="text" class="form-control form-control-lg" id="producto-nombre" required>
              </div>
              
              <div class="mb-3">
                <label for="producto-categoria" class="form-label">Categoría*</label>
                <select class="form-select" id="producto-categoria" required>
                  <option value="" disabled selected>Seleccione una categoría</option>
                  <option value="cerveza">Cerveza</option>
                  <option value="coctel">Cóctel</option>
                  <option value="bebida">Bebida sin alcohol</option>
                  <option value="comida">Comida</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <div class="mb-3" id="grupo-alcohol" style="display: none;">
                <label for="producto-alcohol" class="form-label">Grado alcohólico (%)</label>
                <input type="number" class="form-control" id="producto-alcohol" min="0" max="100" step="0.1">
              </div>
              
              <div class="mb-3">
                <label for="producto-precio" class="form-label">Precio*</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" class="form-control" id="producto-precio" min="0" step="0.01" required>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="producto-stock" class="form-label">Stock inicial*</label>
                <input type="number" class="form-control" id="producto-stock" min="0" required>
              </div>
              
              <div class="mb-3">
                <label for="producto-descripcion" class="form-label">Descripción</label>
                <textarea class="form-control" id="producto-descripcion" rows="2"></textarea>
              </div>
              
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" id="btn-cancelar" class="btn btn-outline-secondary me-md-2">
                  <i class="fas fa-times me-1"></i>Cancelar
                </button>
                <button type="submit" id="btn-submit" class="btn btn-primary">
                  <i class="fas fa-save me-1"></i>Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="contenedor-productos" class="row g-4">
        <% if (productos && productos.length > 0) { %>
          <% productos.forEach(producto => { %>
            <div class="col-md-6 col-lg-4">
              <div class="card card-producto h-100 shadow-sm <%= !producto.activo ? 'bg-light' : '' %>" data-id="<%= producto._id %>">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <h3 class="h5 mb-0"><%= producto.nombre %></h3>
                    <span class="badge badge-precio rounded-pill">$<%= producto.precio.toFixed(2) %></span>
                  </div>
                  
                  <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="badge badge-categoria <%= 
                      producto.categoria === 'cerveza' ? 'bg-warning text-dark' :
                      producto.categoria === 'coctel' ? 'bg-danger' :
                      producto.categoria === 'bebida' ? 'bg-info text-dark' :
                      producto.categoria === 'comida' ? 'bg-success' : 'bg-secondary'
                    %>">
                      <%= producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1) %>
                    </span>
                    
                    <% if (producto.gradoAlcohol) { %>
                      <span class="badge badge-categoria bg-info">
                        <%= producto.gradoAlcohol %>% alc.
                      </span>
                    <% } %>
                    
                    <span class="badge badge-categoria <%= producto.stock > 0 ? 'bg-success' : 'bg-warning' %>">
                      <%= producto.stock %> disponibles
                    </span>
                  </div>
                  
                  <% if (producto.descripcion) { %>
                    <p class="text-muted small mb-3"><%= producto.descripcion %></p>
                  <% } %>
                  
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary btn-editar" data-id="<%= producto._id %>">
                      <i class="fas fa-edit me-1"></i>Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="<%= producto._id %>">
                      <i class="fas fa-trash me-1"></i><%= producto.activo ? 'Desactivar' : 'Activar' %>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          <% }) %>
        <% } else { %>
          <div class="col-12">
            <div class="estado-vacio">
              <i class="fas fa-glass-martini-alt fa-4x mb-3"></i>
              <h3 class="h4">No hay productos registrados</h3>
              <p class="text-muted">Comience agregando nuevos productos</p>
            </div>
          </div>
        <% } %>
      </div>
    </div>

    <!-- Bootstrap 5 JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Archivo JavaScript para la gestión de productos -->
    <script src="/js/productos.js"></script>
    
    <script>
      // Mostrar/ocultar campo de alcohol según categoría
      document.getElementById('producto-categoria').addEventListener('change', function() {
        const esAlcoholico = ['cerveza', 'coctel'].includes(this.value);
        document.getElementById('grupo-alcohol').style.display = esAlcoholico ? 'block' : 'none';
        
        if (esAlcoholico) {
          document.getElementById('producto-alcohol').required = true;
        } else {
          document.getElementById('producto-alcohol').required = false;
        }
      });
    </script>
  </body>
</html>
