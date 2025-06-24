// script.js

const API_URL = 'https://db.buckapi.lat:7752/api/tramos';
const ADMIN_PASSWORD = 'uioW99..administrator';
let currentView = 'grid';

  // Función para mostrar/ocultar elementos según la autenticación
  function actualizarEstadoAutenticacion() {
    const autenticado = sessionStorage.getItem('authenticated') === 'true';
    
    // Mostrar/ocultar elementos según autenticación
    document.querySelectorAll('.container, header, footer').forEach(el => {
      el.style.display = autenticado ? '' : 'none';
    });
    
    // Mostrar/ocultar botón de cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
      if (autenticado) {
        btnCerrarSesion.style.display = 'block';
      } else {
        btnCerrarSesion.style.display = 'none';
      }
    }
    
    // Ajustar clases del body
    document.body.classList.toggle('bg-light', !autenticado);
  }
  
  // Función para mostrar la interfaz
  function mostrarInterfaz() {
    sessionStorage.setItem('authenticated', 'true');
    actualizarEstadoAutenticacion();
    
    // Asegurarse de que el modal se cierre
    if (loginModal) {
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          loginModal.hide();
        }
      }
      
      // Forzar el cierre del backdrop si es necesario
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }
  
  // Función para cerrar sesión
  function cerrarSesion() {
    sessionStorage.removeItem('authenticated');
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    actualizarEstadoAutenticacion();
    // Limpiar el formulario de login
    const form = document.getElementById('loginForm');
    if (form) form.reset();
  }

  // Variable global para el modal de login
  let loginModal;

  // Verificar autenticación al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    // Establecer vista grid como activa por defecto
    actualizarBotonesVista('grid');
    // Inicializar el modal de login
    loginModal = new bootstrap.Modal(document.getElementById('loginModal'), {
      backdrop: 'static',
      keyboard: false
    });
    
    // Configurar el botón de cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
      btnCerrarSesion.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
          title: '¿Cerrar sesión?',
          text: '¿Estás seguro de que deseas cerrar la sesión?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Sí, cerrar sesión',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            cerrarSesion();
          }
        });
      });
    }
    
    // Mostrar/ocultar contraseña
    document.getElementById('togglePassword').addEventListener('click', function() {
      const passwordInput = document.getElementById('password');
      const icon = this.querySelector('i');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });

    // Manejar envío del formulario de inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      
      if (password === ADMIN_PASSWORD) {
        // Guardar en sessionStorage
        sessionStorage.setItem('authenticated', 'true');
        // Limpiar el campo de contraseña
        document.getElementById('password').value = '';
        // Mostrar la interfaz
        mostrarInterfaz();
        // Ocultar el modal
        loginModal.hide();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Contraseña incorrecta',
          confirmButtonColor: '#3085d6',
        });
      }
    });

    // Verificar si ya está autenticado
    if (sessionStorage.getItem('authenticated') === 'true') {
      // Si ya está autenticado, mostrar la interfaz y asegurarse de que el modal esté cerrado
      mostrarInterfaz();
      if (loginModal) {
        loginModal.hide();
      }
    } else {
      // Si no está autenticado, mostrar el modal de inicio de sesión
      if (loginModal) {
        loginModal.show();
      }
      // Ocultar la interfaz
      actualizarEstadoAutenticacion();
    }
});

// Función para actualizar el tipo según el orden
window.actualizarTipoSegunOrden = function(orden) {
  const radioFijo = document.querySelector('input[name="tipo"][value="fijo"]');
  const radioIntervalo = document.querySelector('input[name="tipo"][value="por_intervalo"]');
  
  if (parseInt(orden) > 1) {
    // Si el orden es mayor a 1, forzar tipo 'por_intervalo' y deshabilitar 'fijo'
    if (radioIntervalo) radioIntervalo.checked = true;
    if (radioFijo) radioFijo.disabled = true;
    const tarifasFijas = document.getElementById('tarifasFijas');
    const tarifasPorVehiculo = document.getElementById('tarifasPorVehiculo');
    if (tarifasFijas) tarifasFijas.classList.add('d-none');
    if (tarifasPorVehiculo) tarifasPorVehiculo.classList.remove('d-none');
  } else {
    // Si el orden es 1, habilitar ambas opciones
    if (radioFijo) radioFijo.disabled = false;
  }
};

function renderizarFormularioTramo() {
    document.getElementById('modalBody').innerHTML = `
      <div class="row g-3">
        <div class="col-md-8">
          <label class="form-label" for="inputDescripcion">Descripción</label>
          <input id="inputDescripcion" type="text" name="descripcion" class="form-control" placeholder="Descripción" required />
        </div>
        <div class="col-md-2">
          <label class="form-label" for="inputOrden">Orden</label>
          <input id="inputOrden" disabled=true type="number" name="orden" class="form-control" placeholder="Orden" onchange="actualizarTipoSegunOrden(this.value)" />
        </div>
        <div class="col-md-2">
  </div>
        <div class="col-md-4">
          <label class="form-label" for="inputKmDesde">Km Desde</label>
          <input id="inputKmDesde" disabled=true  type="number" name="kmDesde" class="form-control" placeholder="Km Desde" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label" for="inputKmHasta">Km Hasta</label>
          <input id="inputKmHasta" type="number" name="kmHasta" class="form-control" placeholder="Km Hasta" required />
        </div>
      </div>
      <div class="mt-3">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="tipo" value="fijo" checked />
          <label class="form-check-label">Fijo</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="tipo" value="por_intervalo" />
          <label class="form-check-label">Por intervalo</label>
        </div>
      </div>
      <div id="tarifasFijas" class="mt-3">
        <!-- Tarifas Aeropuerto - Hotel -->
        <div class="border p-3 mb-4 rounded">
          <h6 class="fw-bold mb-3">Tarifas Aeropuerto - Hotel</h6>
          <div class="row g-3">
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Sedán Estándar</label>
                <input name="tarifasAeropuerto[sedan_estandar]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Sedán Espacioso</label>
                <input name="tarifasAeropuerto[sedan_espacioso]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Sedán Premium</label>
                <input name="tarifasAeropuerto[sedan_premium]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Minivan Estándar</label>
                <input name="tarifasAeropuerto[minivan_estandar]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Minivan Premium</label>
                <input name="tarifasAeropuerto[minivan_premium]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">SUV Premium</label>
                <input name="tarifasAeropuerto[suv_premium]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Van 12 asientos</label>
                <input name="tarifasAeropuerto[minibus_12]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Van 19 asientos</label>
                <input name="tarifasAeropuerto[minibus_19]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tarifas Punto a Punto -->
        <div class="border p-3 rounded">
          <h6 class="fw-bold mb-3">Tarifas Punto a Punto</h6>
          <div class="row g-3">
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Sedán Estándar</label>
                <input name="tarifasPuntoPunto[sedan_estandar]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Sedán Espacioso</label>
                <input name="tarifasPuntoPunto[sedan_espacioso]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Sedán Premium</label>
                <input name="tarifasPuntoPunto[sedan_premium]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Minivan Estándar</label>
                <input name="tarifasPuntoPunto[minivan_estandar]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Minivan Premium</label>
                <input name="tarifasPuntoPunto[minivan_premium]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">SUV Premium</label>
                <input name="tarifasPuntoPunto[suv_premium]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Van 12 asientos</label>
                <input name="tarifasPuntoPunto[minibus_12]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-2">
                <label class="small mb-0 flex-grow-1">Van 19 asientos</label>
                <input name="tarifasPuntoPunto[minibus_19]" type="number" class="form-control form-control-sm" style="width: 100px;" />
              </div>
            </div>
          </div>
        </div>
      </div>
       <div class="row align-items-center mb-5 mt-3">
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">Aplicar tarifas cada</span>
              <input type="number" name="unidadCadaKm" class="form-control" value="1" />
              <span class="input-group-text">Km</span>
            </div>
          </div>
        </div>
      <div id="tarifasPorVehiculo" class="mt-3 d-none border p-3 rounded">
       
        <div class="row g-3 align-items-center">
          <!-- Sedanes -->
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2">
              <label class="small mb-0 flex-grow-1">Sedán Estándar</label>
              <input name="tarifas[sedan_estandar]" type="number" class="form-control form-control-sm" style="width: 80px;" />
            </div>
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2">
              <label class="small mb-0 flex-grow-1">Sedán Espacioso</label>
              <input name="tarifas[sedan_espacioso]" type="number" class="form-control form-control-sm" style="width: 80px;" />
            </div>
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2">
              <label class="small mb-0 flex-grow-1">Sedán Premium</label>
              <input name="tarifas[sedan_premium]" type="number" class="form-control form-control-sm" style="width: 80px;" />
            </div>
          </div>
          
          <!-- Minivans -->
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2">
              <label class="small mb-0 flex-grow-1">Minivan Estándar</label>
              <input name="tarifas[minivan_estandar]" type="number" class="form-control form-control-sm" style="width: 80px;" />
            </div>
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2">
              <label class="small mb-0 flex-grow-1">Minivan Premium</label>
              <input name="tarifas[minivan_premium]" type="number" class="form-control form-control-sm" style="width: 80px;" />
            </div>
          </div>
          <div class="col-md-4">
           
          </div>
          <!-- Otros vehículos -->
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2">
              <label class="small mb-0 flex-grow-1">SUV Premium</label>
              <input name="tarifas[suv_premium]" type="number" class="form-control form-control-sm" style="width: 80px;" />
            </div>
          </div>
          <div class="col-md-4">
           
          </div>
          <div class="col-md-4">
           
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2">
              <label class="small mb-0 flex-grow-1">Van 12 asientos</label>
              <input name="tarifas[minibus_12]" type="number" class="form-control form-control-sm" style="width: 80px;" />
            </div>
          </div>
          <div class="col-md-4">
           
          </div>
          <div class="col-md-4">
           
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2">
              <label class="small mb-0 flex-grow-1">Van 19 asientos</label>
              <input name="tarifas[minibus_19]" type="number" class="form-control form-control-sm" style="width: 80px;" />
            </div>
          </div>
        </div>
      </div>
    `;
  
    // Activar listeners de los radios luego de renderizar
    document.querySelectorAll('input[name="tipo"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const isFijo = radio.value === 'fijo';
        document.getElementById('tarifasFijas').classList.toggle('d-none', !isFijo);
        document.getElementById('tarifasPorVehiculo').classList.toggle('d-none', isFijo);
      });
    });
    
    // Asegurarse de que el estado inicial sea correcto
    const tipoInicial = document.querySelector('input[name="tipo"]:checked').value;
    const isFijoInicial = tipoInicial === 'fijo';
    document.getElementById('tarifasFijas').classList.toggle('d-none', !isFijoInicial);
    document.getElementById('tarifasPorVehiculo').classList.toggle('d-none', isFijoInicial);
    
    // Verificar el orden inicial después de un pequeño retraso para asegurar que el DOM esté listo
    setTimeout(() => {
      const ordenInicial = document.getElementById('inputOrden')?.value;
      if (ordenInicial && parseInt(ordenInicial) > 1) {
        actualizarTipoSegunOrden(ordenInicial);
      }
    }, 100);
  }

// Función para actualizar el estado activo de los botones de vista
function actualizarBotonesVista(vistaActiva) {
  // Remover clase activa de todos los botones
  ['btnGrid', 'btnList', 'btnTimeline'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.remove('btn-dark', 'text-white');
      btn.classList.add('btn-outline-dark');
    }
  });
  
  // Agregar clase activa al botón seleccionado
  const btnActivo = document.getElementById(`btn${vistaActiva.charAt(0).toUpperCase() + vistaActiva.slice(1)}`);
  if (btnActivo) {
    btnActivo.classList.remove('btn-outline-dark');
    btnActivo.classList.add('btn-dark', 'text-white');
  }
}

document.getElementById('btnGrid').onclick = () => { 
  currentView = 'grid'; 
  actualizarBotonesVista('grid');
  ocultarDetalle(); 
  cargarTramos(); 
};
document.getElementById('btnList').onclick = () => { 
  currentView = 'list'; 
  actualizarBotonesVista('list');
  ocultarDetalle(); 
  cargarTramos(); 
};
document.getElementById('btnTimeline').onclick = () => { 
  currentView = 'timeline'; 
  actualizarBotonesVista('timeline');
  ocultarDetalle(); 
  cargarTramos(); 
};

document.getElementById('openModalBtn').onclick = async () => {
  const res = await fetch(API_URL);
  const tramos = await res.json();
  const ultimo = tramos.sort((a,b)=>b.orden - a.orden)[0];

  renderizarFormularioTramo(); // <-- importante renderizar antes de acceder a inputs

  const ordenInput = document.querySelector('input[name="orden"]');
  const kmDesdeInput = document.querySelector('input[name="kmDesde"]');
  const idInput = document.querySelector('input[name="id"]');

  if (ordenInput && kmDesdeInput && idInput) {
    ordenInput.value = ultimo ? ultimo.orden + 1 : 1;
    kmDesdeInput.value = ultimo ? ultimo.kmHasta : 0;
    idInput.value = '';
  }

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle me-2"></i>Nuevo Esquema';
  new bootstrap.Modal(document.getElementById('modal')).show();
};

async function cargarTramos() {
  const container = document.getElementById('tramosContainer');
  container.innerHTML = '';
  const res = await fetch(API_URL);
  let tramos = await res.json();

  if (currentView === 'timeline') {
    tramos.sort((a, b) => a.orden - b.orden);
    const totalKm = tramos.reduce((sum, t) => sum + (t.kmHasta - t.kmDesde), 0);
    const line = document.createElement('div');
    line.className = 'timeline-container';
    line.innerHTML = '<div class="timeline-line"></div>';

    let activeTramo = null;

    tramos.forEach((tramo, i) => {
      const tramoKm = tramo.kmHasta - tramo.kmDesde;
      const widthPercent = (tramoKm / totalKm) * 100;
      const gray = Math.round(255 - (i / tramos.length) * 100);
      const color = `rgb(${gray},${gray},${gray})`;
      const segment = document.createElement('div');
      segment.className = 'timeline-item';
      segment.style.flex = `0 0 ${widthPercent}%`;
      segment.innerHTML = `
        <div class="timeline-segment" style="width: 100%; background-color: ${color};">
          <span 
            style="cursor: pointer;" 
            onclick="event.stopPropagation(); mostrarDetalle(${JSON.stringify(tramo).replace(/"/g, '&quot;')}, this)">
            ${tramo.orden}
          </span>
        </div>`;
      line.appendChild(segment);
    });
    container.appendChild(line);
    return;
  }

  tramos.forEach(tramo => {
    const tarifas = Object.entries(tramo.tarifas || {}).map(([k, v]) => `${k.replace(/_/g, ' ')}: $${v.toLocaleString()}`).join('\n');
    const col = document.createElement('div');
    const isGridView = currentView === 'grid';
    col.className = isGridView ? 'col-md-4' : 'col-12';
    
    // Botones comunes
    const buttons = `
      <div class="d-flex gap-2 ${isGridView ? 'position-absolute top-0 end-0 m-2' : 'mt-2 justify-content-end'}">
        <button class="btn btn-sm btn-outline-primary" 
                onclick="event.stopPropagation(); cargarDatosParaEditar('${tramo._id}')"
                title="Editar tram o">
          <i class="fas fa-edit"></i>
          ${isGridView ? '' : '<span class="ms-1">Editar</span>'}
        </button>
        <button class="btn btn-sm btn-outline-danger" 
                onclick="event.stopPropagation(); eliminarTramo('${tramo._id}')"
                title="Eliminar tramo">
          <i class="fas fa-trash-alt"></i>
          ${isGridView ? '' : '<span class="ms-1">Eliminar</span>'}
        </button>
      </div>`;
    
    // Contenido de la tarjeta
    // <p class="mb-1"><strong>Tipo:</strong> ${tramo.tipo}</p>
    col.innerHTML = `<div class="card-tramo position-relative">
      ${isGridView ? buttons : ''}
      <h5 class="fw-bold">De ${tramo.kmDesde} Km A ${tramo.kmHasta} Km</h5>
 
      <p class="mb-2"><strong>Se aplica cada:</strong> ${tramo.unidadCadaKm || '1'} Km</p>
      <div class="d-flex flex-column gap-1">
        ${tramo.tipo === 'fijo' ? `
          <span class="text-primary text-decoration-underline small" 
                style="cursor: pointer;" 
                onclick="event.stopPropagation(); mostrarTarifasEspecificas('${tramo._id}', 'aeropuerto_hotel', event)">
            Ver tarifas Aeropuerto
          </span>
          <span class="text-primary text-decoration-underline small" 
                style="cursor: pointer;" 
                onclick="event.stopPropagation(); mostrarTarifasEspecificas('${tramo._id}', 'punto_a_punto', event)">
            Ver tarifas Punto a Punto
          </span>
        ` : `
          <span class="text-primary text-decoration-underline" 
                style="cursor: pointer;" 
                onclick="event.stopPropagation(); mostrarDetalle(${JSON.stringify(tramo).replace(/"/g, '&quot;')}, this)">
            Ver tarifas
          </span>
        `}
      </div>
        ${!isGridView ? buttons : ''}
      </div>`;
    container.appendChild(col);
  });

  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(t => new bootstrap.Tooltip(t));
}

async function cargarDatosParaEditar(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const tramo = await res.json();
  renderizarFormularioTramo();
  const form = document.getElementById('tramoForm');
  form.querySelector('input[name="id"]').value = tramo._id;
  form.querySelector('input[name="descripcion"]').value = tramo.descripcion || '';
  form.querySelector('input[name="orden"]').value = tramo.orden;
  form.querySelector('input[name="kmDesde"]').value = tramo.kmDesde;
  form.querySelector('input[name="kmHasta"]').value = tramo.kmHasta;
  form.querySelector(`input[name="tipo"][value="${tramo.tipo}"]`).checked = true;
  // Mostrar/ocultar las secciones según el tipo de tramo
  const esFijo = tramo.tipo === 'fijo';
  document.getElementById('tarifasFijas').classList.toggle('d-none', !esFijo);
  document.getElementById('tarifasPorVehiculo').classList.toggle('d-none', esFijo);
  
  if (esFijo) {
    // Cargar tarifas de aeropuerto
    if (tramo.tarifas?.aeropuerto_hotel) {
      Object.entries(tramo.tarifas.aeropuerto_hotel).forEach(([key, value]) => {
        const input = form.querySelector(`input[name="tarifasAeropuerto[${key}]"]`);
        if (input) input.value = value;
      });
    }
    // Cargar tarifas punto a punto
    if (tramo.tarifas?.punto_a_punto) {
      Object.entries(tramo.tarifas.punto_a_punto).forEach(([key, value]) => {
        const input = form.querySelector(`input[name="tarifasPuntoPunto[${key}]"]`);
        if (input) input.value = value;
      });
    }
  } else {
    form.querySelector('input[name="unidadCadaKm"]').value = tramo.unidadCadaKm || 1;
    Object.entries(tramo.tarifas || {}).forEach(([key, value]) => {
      const input = form.querySelector(`input[name="tarifas[${key}]"]`);
      if (input) input.value = value;
    });
  }
  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Editar esquema';
  new bootstrap.Modal(document.getElementById('modal')).show();
}

function mostrarDetalle(tramo, anchorElement) {
  // Evitar comportamiento predeterminado del enlace
  if (anchorElement && anchorElement.tagName === 'A') {
    anchorElement.blur();
  }
  
  const generarHTMLTarifas = (tarifas) => {
    if (!tarifas || typeof tarifas !== 'object') return '<p class="text-muted mb-0">No hay tarifas disponibles</p>';
    
    // Crear grupos de vehículos
    const grupos = {
      sedan: [],
      minivan: [],
      suv: [],
      van12: [],
      van19: []
    };
    
    // Clasificar vehículos en grupos
    for (const [vehiculo, monto] of Object.entries(tarifas)) {
      if (vehiculo.includes('sedan')) {
        grupos.sedan.push({ vehiculo, monto });
      } else if (vehiculo.includes('minivan')) {
        grupos.minivan.push({ vehiculo, monto });
      } else if (vehiculo.includes('suv')) {
        grupos.suv.push({ vehiculo, monto });
      } else if (vehiculo.includes('minibus_12') || vehiculo.includes('van_12')) {
        grupos.van12.push({ vehiculo, monto });
      } else if (vehiculo.includes('minibus_19') || vehiculo.includes('van_19')) {
        grupos.van19.push({ vehiculo, monto });
      }
    }
    
    // Función para generar HTML de un grupo de vehículos
    const generarHTMLGrupo = (vehiculos, titulo) => {
      if (vehiculos.length === 0) return '';
      
      let html = `
        <div class="mb-3">
          <h6 class="text-warning mb-2">${titulo}</h6>
          <ul class="list-unstyled">`;
      
      for (const { vehiculo, monto } of vehiculos) {
        const nombreVehiculo = vehiculo
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .replace('Minibus', 'Minibús')
          .replace('Sedan', 'Sedán');
          
        html += `
            <li class="d-flex justify-content-between py-1">
              <span class="text-light">${nombreVehiculo}:</span>
              <span class="fw-bold text-warning">$${monto.toLocaleString()}</span>
            </li>`;
      }
      
      html += '\n          </ul>\n        </div>';
      return html;
    };
    
    // Generar HTML para cada grupo
    let html = '<div class="tarifas-container">';
    html += generarHTMLGrupo(grupos.sedan, 'Sedán');
    html += generarHTMLGrupo(grupos.minivan, 'Minivan');
    html += generarHTMLGrupo(grupos.suv, 'SUV');
    html += generarHTMLGrupo(grupos.van12, 'Van 12 Asientos');
    html += generarHTMLGrupo(grupos.van19, 'Van 19 Asientos');
    html += '</div>';
    
    return html;
  };
  
  // Configurar el título del modal
  document.getElementById('modalTarifasTitle').textContent = `Detalles del Tramo #${tramo.orden}`;
  
  // Generar el contenido del modal
  let contenido = `
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <i class="fas fa-route me-2 text-warning"></i>
        <h6 class="mb-0">${tramo.kmDesde} - ${tramo.kmHasta || '∞'} km</h6>
      </div>
  `;
  
  if (tramo.tipo === 'fijo') {
    // Para tramos fijos, mostramos los botones de los dos tipos de tarifas
    contenido += `
      <div class="d-flex gap-2 mb-4">
        <button onclick="mostrarTarifasEspecificas('${tramo._id}', 'aeropuerto_hotel', event)" 
                class="btn btn-outline-warning flex-grow-1">
          <i class="fas fa-hotel me-1"></i> Aeropuerto
        </button>
        <button onclick="mostrarTarifasEspecificas('${tramo._id}', 'punto_a_punto', event)" 
                class="btn btn-outline-warning flex-grow-1">
          <i class="fas fa-map-marker-alt me-1"></i> Punto a Punto
        </button>
      </div>
    `;
  } else {
    // Para tramos por intervalo
    contenido += `
      <div class="mb-3">
        <h6 class="fw-bold text-warning mb-3">Tarifas por km</h6>
        ${generarHTMLTarifas(tramo.tarifas)}
      </div>
    `;
    if (tramo.unidadCadaKm) {
      contenido += `
        <div class="d-flex align-items-center text-muted mt-3">
          <i class="fas fa-ruler me-2"></i>
          <span>Unidad cada ${tramo.unidadCadaKm} km</span>
        </div>
      `;
    }
  }
  
  contenido += '</div>';
  
  // Actualizar el contenido del modal
  document.getElementById('modalTarifasBody').innerHTML = contenido;
  
  // Mostrar el modal
  const modal = new bootstrap.Modal(document.getElementById('modalTarifas'));
  modal.show();
}

function ocultarDetalle() {
  document.getElementById('tramoDetalle').classList.add('d-none');
}

async function mostrarTarifasEspecificas(tramoId, tipoTarifa, event) {
  try {
    // Obtener los datos actualizados del tramo
    const response = await fetch(`${API_URL}/${tramoId}`);
    if (!response.ok) throw new Error('Error al cargar los datos del tramo');
    
    const tramo = await response.json();
    const titulo = tipoTarifa === 'aeropuerto_hotel' ? 'Aeropuerto - Hotel' : 'Punto a Punto';
    
    let tarifasHTML = '';
    const tarifas = tramo.tarifas?.[tipoTarifa] || {};
    
    // Crear grupos de vehículos
    const grupos = {
      sedan: [],
      minivan: [],
      suv: [],
      van12: [],
      van19: []
    };
    
    // Clasificar vehículos en grupos
    for (const [vehiculo, monto] of Object.entries(tarifas)) {
      // Determinar el tipo de vehículo
      if (vehiculo.includes('sedan')) {
        grupos.sedan.push({ vehiculo, monto });
      } else if (vehiculo.includes('minivan')) {
        grupos.minivan.push({ vehiculo, monto });
      } else if (vehiculo.includes('suv')) {
        grupos.suv.push({ vehiculo, monto });
      } else if (vehiculo.includes('minibus_12') || vehiculo.includes('van_12')) {
        grupos.van12.push({ vehiculo, monto });
      } else if (vehiculo.includes('minibus_19') || vehiculo.includes('van_19')) {
        grupos.van19.push({ vehiculo, monto });
      }
    }
    
    // Función para generar HTML de un grupo de vehículos
    const generarHTMLGrupo = (vehiculos, titulo) => {
      let html = `
        <div class="mb-4">
          <h6 class="text-warning mb-2">${titulo}</h6>
          <ul class="list-unstyled">`;
      
      if (vehiculos.length === 0) {
        html += `
            <li class="d-flex justify-content-between py-1">
              <span class="text-muted">No disponible</span>
              <span class="text-muted">-</span>
            </li>`;
      } else {
        for (const { vehiculo, monto } of vehiculos) {
          const nombreVehiculo = vehiculo
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace('Minibus', 'Minibús')
            .replace('Sedan', 'Sedán');
            
          html += `
            <li class="d-flex justify-content-between py-1">
              <span class="text-light">${nombreVehiculo}:</span>
              <span class="fw-bold text-warning">$${monto.toLocaleString()}</span>
            </li>`;
        }
      }
      
      html += '\n          </ul>\n        </div>';
      return html;
    };
    
    // Generar HTML para cada grupo (siempre mostrar todos los grupos)
    const gruposMostrar = [
      { datos: grupos.sedan, titulo: 'Sedán' },
      { datos: grupos.minivan, titulo: 'Minivan' },
      { datos: grupos.suv, titulo: 'SUV' },
      { datos: grupos.van12, titulo: 'Van 12 Asientos' },
      { datos: grupos.van19, titulo: 'Van 19 Asientos' }
    ];
    
    gruposMostrar.forEach(grupo => {
      tarifasHTML += generarHTMLGrupo(grupo.datos, grupo.titulo);
    });
    
    // Actualizar el título y contenido del modal
    document.getElementById('modalTarifasTitle').textContent = `Tarifas - ${titulo}`;
    document.getElementById('modalTarifasBody').innerHTML = `
      <div class="mb-3">
        <div class="d-flex align-items-center mb-3">
          <i class="fas fa-map-marker-alt me-2 text-warning"></i>
          <h6 class="mb-0">${tramo.descripcion || 'Tramo sin descripción'}</h6>
        </div>
        <div class="d-flex align-items-center mb-3">
          <i class="fas fa-road me-2 text-warning"></i>
          <h6 class="mb-0">${tramo.kmDesde ?? 0} - ${tramo.kmHasta ?? '∞'} km</h6>
        </div>
        <div class="tarifas-container">
          ${tarifasHTML}
        </div>
      </div>`;
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalTarifas'));
    modal.show();
    
  } catch (error) {
    console.error('Error al mostrar tarifas:', error);
    Swal.fire('Error', 'No se pudieron cargar las tarifas. Por favor, intente de nuevo.', 'error');
  }
}

document.getElementById('tramoForm').onsubmit = async e => {
  e.preventDefault();
  const form = e.target;
  const id = form.querySelector('input[name="id"]').value;
  const isEdit = !!id;
  
  try {
    const tipo = form.tipo.value;
    const tarifas = {};
    
    if (tipo === 'fijo') {
      tarifas.aeropuerto_hotel = {};
      tarifas.punto_a_punto = {};
      
      // Recolectar tarifas de aeropuerto
      new FormData(form).forEach((value, key) => {
        if (key.startsWith('tarifasAeropuerto[')) {
          const nombre = key.replace('tarifasAeropuerto[', '').replace(']', '');
          tarifas.aeropuerto_hotel[nombre] = +value;
        } else if (key.startsWith('tarifasPuntoPunto[')) {
          const nombre = key.replace('tarifasPuntoPunto[', '').replace(']', '');
          tarifas.punto_a_punto[nombre] = +value;
        }
      });
    } else {
      new FormData(form).forEach((value, key) => {
        if (key.startsWith('tarifas[')) {
          const nombre = key.replace('tarifas[', '').replace(']', '');
          tarifas[nombre] = +value;
        }
      });
    }
    
    const body = {
      orden: +form.orden.value,
      kmDesde: +form.kmDesde.value,
      kmHasta: +form.kmHasta.value,
      unidadCadaKm: tipo === 'por_intervalo' ? +form.unidadCadaKm.value : null,
      tipo,
      descripcion: form.descripcion.value,
      tarifas
    };
    
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${API_URL}/${id}` : API_URL;
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al procesar la solicitud');
    }
    
    await Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: isEdit ? 'Tramo actualizado correctamente' : 'Tramo creado correctamente',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
    
    bootstrap.Modal.getInstance(document.getElementById('modal')).hide();
    form.reset();
    await cargarTramos();
    
  } catch (error) {
    console.error('Error:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Ocurrió un error al procesar la solicitud',
      confirmButtonText: 'Entendido'
    });
  }
};

cargarTramos();
