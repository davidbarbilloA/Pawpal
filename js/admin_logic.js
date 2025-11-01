document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos principales del DOM
    const profileTbody = document.getElementById('profiles-tbody');
    const detailView = document.getElementById('detail-view');
    const profileListSection = document.getElementById('profile-list-section');
    const rejectModal = document.getElementById('reject-modal');
    const statusFilter = document.getElementById('status-filter');
    
    let currentProfileId = null;

    // --- Datos de Prueba (Simulando la carga desde una API) ---
    const cuidadores = [
        { id: 101, name: "María López", regDate: "2025-10-25", status: "pending", personal: "35 años, vive en El Poblado.", experience: "5 años de experiencia, certificada en primeros auxilios.", references: "Dos referencias de clientes satisfechos." },
        { id: 102, name: "Juan Pérez", regDate: "2025-10-20", status: "pending", personal: "28 años, vive en Laureles.", experience: "2 años de experiencia, sin certificación adicional.", references: "Una referencia (pendiente de verificación)." },
        { id: 103, name: "Sofía Gómez", regDate: "2025-10-18", status: "approved", personal: "40 años, vive en Envigado.", experience: "10 años de experiencia, certificado de adiestramiento.", references: "Tres referencias verificadas." },
    ];
    
    // --- FUNCIÓN DE RENDERIZADO DE LA TABLA ---
    function renderTable(filter = 'pending') {
        profileTbody.innerHTML = '';
        const filteredCuidadores = cuidadores.filter(p => filter === 'all' || p.status === filter);

        if (filteredCuidadores.length === 0) {
            profileTbody.innerHTML = `<tr><td colspan="5" class="loading-message">No hay perfiles ${filter.toUpperCase()} para mostrar.</td></tr>`;
            return;
        }

        filteredCuidadores.forEach(profile => {
            const row = profileTbody.insertRow();
            row.dataset.id = profile.id;

            const statusClass = `status-${profile.status}`;
            const statusText = profile.status.charAt(0).toUpperCase() + profile.status.slice(1);

            row.innerHTML = `
                <td>${profile.id}</td>
                <td>${profile.name}</td>
                <td>${profile.regDate}</td>
                <td class="${statusClass}">${statusText}</td>
                <td><button class="btn btn-secondary view-btn" data-id="${profile.id}">Ver Detalle</button></td>
            `;

            // Agregar listener al botón "Ver Detalle"
            row.querySelector('.view-btn').addEventListener('click', () => {
                showDetailView(profile);
            });
        });
    }

    // --- FUNCIÓN PARA MOSTRAR LA VISTA DETALLADA ---
    function showDetailView(profile) {
        currentProfileId = profile.id;
        
        // Llenar los datos
        document.getElementById('detail-name').textContent = `Perfil de: ${profile.name}`;
        document.getElementById('detail-personal').textContent = profile.personal;
        document.getElementById('detail-experience').textContent = profile.experience;
        document.getElementById('detail-references').textContent = profile.references;

        // Mostrar/Ocultar secciones
        profileListSection.classList.add('hidden');
        detailView.classList.remove('hidden');
    }

    // --- MANEJO DE EVENTOS DE INTERFAZ ---

    // 1. Filtrado de Tabla
    statusFilter.addEventListener('change', (e) => {
        renderTable(e.target.value);
    });

    // 2. Volver a la Lista
    document.getElementById('back-to-list').addEventListener('click', () => {
        detailView.classList.add('hidden');
        profileListSection.classList.remove('hidden');
        currentProfileId = null;
    });

    // 3. Botón APROBAR
    document.getElementById('approve-btn').addEventListener('click', () => {
        if (currentProfileId) {
            updateProfileStatus(currentProfileId, 'approved');
            alert(`Perfil ID ${currentProfileId} aprobado y publicado.`);
            document.getElementById('back-to-list').click(); // Volver a la lista
        }
    });

    // 4. Botón RECHAZAR (Muestra Modal)
    document.getElementById('reject-btn').addEventListener('click', () => {
        rejectModal.classList.remove('hidden');
    });

    // 5. Botón CANCELAR Modal
    document.getElementById('modal-cancel-btn').addEventListener('click', () => {
        rejectModal.classList.add('hidden');
    });

    // 6. Botón ENVIAR RECHAZO (Lógica de rechazo)
    document.getElementById('modal-send-btn').addEventListener('click', () => {
        const reason = document.getElementById('rejection-reason').value.trim();
        if (!reason) {
            alert('Por favor, ingresa un motivo para el rechazo.');
            return;
        }

        if (currentProfileId) {
            updateProfileStatus(currentProfileId, 'rejected', reason);
            alert(`Perfil ID ${currentProfileId} rechazado. Motivo enviado: "${reason}"`);
            rejectModal.classList.add('hidden');
            document.getElementById('back-to-list').click(); // Volver a la lista
        }
    });

    // --- FUNCIÓN DE ACTUALIZACIÓN DE ESTADO (Simulada) ---
    function updateProfileStatus(id, newStatus, reason = null) {
        const profileIndex = cuidadores.findIndex(p => p.id === id);
        if (profileIndex !== -1) {
            cuidadores[profileIndex].status = newStatus;
            // Aquí iría la llamada a la API para guardar el cambio y enviar la notificación
            
            // Re-renderizar la tabla para actualizar la vista
            renderTable(statusFilter.value);
        }
    }
    
    // Iniciar: Renderizar la tabla al cargar la página (por defecto, solo pendientes)
    renderTable('pending');
});