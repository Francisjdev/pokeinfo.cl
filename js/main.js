// Cargar comunas en el dropdown
async function cargarComunas() {
  const responseComunas = await fetch('http://127.0.0.1:8000/comunas');
  const data = await responseComunas.json();
  
  const comunas = data.comunas || [];  // fallback si no hay comunas
  const comunaSelect = document.getElementById('comunaSelect');

  // Limpiar select antes de llenarlo
  comunaSelect.innerHTML = '<option value="todas">Todas las comunas</option>';

  comunas.forEach(comuna => {
    const option = document.createElement('option');
    option.value = comuna;
    option.textContent = comuna;
    comunaSelect.appendChild(option);
  });

  // Agregar listener al select para filtrar eventos al cambiar
  comunaSelect.addEventListener('change', () => {
    fetchEvents(comunaSelect.value);
  });
}

// Renderizar tarjetas de eventos
function renderEventos(list) {
  if (!Array.isArray(list)) return;  // seguridad
  const cardsContainer = document.getElementById('storeCards');
  cardsContainer.innerHTML = "";     // limpiar antes de renderizar

  list.forEach(t => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${t["shop"]}</h2>
      <p><strong>Día:</strong> ${t['date']}</p>
      <p><strong>Comuna:</strong> ${t['city']}</p>
      <p><strong>Dirección:</strong> ${t['address']}</p>
      ${t['url'] ? `<p><a href="${t.url}" target="_blank">URL evento</a></p>` : ''}
    `;
    cardsContainer.appendChild(card);
  });
}

// Fetch de eventos, opcionalmente filtrando por comuna
async function fetchEvents(params = 'todas') {
  let url = 'http://127.0.0.1:8000/events';
  if (params !== 'todas') {
    url = `http://127.0.0.1:8000/events/porcomuna?city=${encodeURIComponent(params)}`;
  }

  const responseEventos = await fetch(url);
  const data = await responseEventos.json();
  const eventos = data.events || [];  // fallback si no hay eventos

  renderEventos(eventos);
}

// Inicialización
cargarComunas();
fetchEvents();  // muestra todos los eventos al cargar la página
