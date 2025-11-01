document.addEventListener('DOMContentLoaded', () => {
    class Cuidador {
        constructor(id, name, regDate, status, personal, experience, references) {
            this.id = id;
            this.name = name;
            this.regDate = regDate;
            this.status = status;
            this.personal = personal;
            this.experience = experience;
            this.references = references;
        }
    }

    class CuidadorManager {
        constructor() {
            this.cuidadores = [
                new Cuidador(101, "María López", "2025-10-25", "pending", "35 años, vive en El Poblado.", "5 años de experiencia, certificada en primeros auxilios.", "Dos referencias de clientes satisfechos."),
                new Cuidador(102, "Juan Pérez", "2025-10-20", "pending", "28 años, vive en Laureles.", "2 años de experiencia, sin certificación adicional.", "Una referencia (pendiente de verificación)."),
                new Cuidador(103, "Sofía Gómez", "2025-10-18", "approved", "40 años, vive en Envigado.", "10 años de experiencia, certificado de adiestramiento.", "Tres referencias verificadas.")
            ];
        }

        filtrarPorEstado(estado) {
            if (estado === 'all') return this.cuidadores;
            return this.cuidadores.filter(c => c.status === estado);
        }

        actualizarEstado(id, nuevoEstado, razon = null) {
            const cuidador = this.cuidadores.find(c => c.id === id);
            if (cuidador) {
                cuidador.status = nuevoEstado;
                // Aquí podrías agregar una llamada a API para guardar cambios o enviar notificación
            }
        }

        obtenerPorId(id) {
            return this.cuidadores.find(c => c.id === id);
        }
    }

    class UIManager {
        constructor(manager) {
            // Elementos del DOM
            this.manager = manager;
            this.profileTbody = document.getElementById('profiles-tbody');
            this.detailView = document.getElementById('detail-view');
            this.profileListSection = document.getElementById('profile-list-section');
            this.rejectModal = document.getElementById('reject-modal');
            this.statusFilter = document.getElementById('status-filter');
            this.currentProfileId = null;

            // Inicialización de eventos
            this.initEventListeners();
            this.renderizarTabla('pending');
        }

        renderizarTabla(filtro = 'pending') {
            const perfiles = this.manager.filtrarPorEstado(filtro);
            this.profileTbody.innerHTML = '';

            if (perfiles.length === 0) {
                this.profileTbody.innerHTML = `<tr><td colspan="5" class="loading-message">No hay perfiles ${filtro.toUpperCase()} para mostrar.</td></tr>`;
                return;
            }

            perfiles.forEach(perfil => {
                const row = this.profileTbody.insertRow();
                const estadoTexto = perfil.status.charAt(0).toUpperCase() + perfil.status.slice(1);
                const estadoClase = `status-${perfil.status}`;

                row.innerHTML = `
                    <td>${perfil.id}</td>
                    <td>${perfil.name}</td>
                    <td>${perfil.regDate}</td>
                    <td class="${estadoClase}">${estadoTexto}</td>
                    <td><button class="btn btn-secondary view-btn" data-id="${perfil.id}">Ver Detalle</button></td>
                `;

                row.querySelector('.view-btn').addEventListener('click', () => this.mostrarDetalle(perfil));
            });
        }

        mostrarDetalle(perfil) {
            this.currentProfileId = perfil.id;
            document.getElementById('detail-name').textContent = `Perfil de: ${perfil.name}`;
            document.getElementById('detail-personal').textContent = perfil.personal;
            document.getElementById('detail-experience').textContent = perfil.experience;
            document.getElementById('detail-references').textContent = perfil.references;

            this.profileListSection.classList.add('hidden');
            this.detailView.classList.remove('hidden');
        }

        volverALista() {
            this.detailView.classList.add('hidden');
            this.profileListSection.classList.remove('hidden');
            this.currentProfileId = null;
        }

        aprobarPerfil() {
            if (this.currentProfileId) {
                this.manager.actualizarEstado(this.currentProfileId, 'approved');
                alert(`Perfil ID ${this.currentProfileId} aprobado y publicado.`);
                this.volverALista();
                this.renderizarTabla(this.statusFilter.value);
            }
        }

        mostrarModalRechazo() {
            this.rejectModal.classList.remove('hidden');
        }

        ocultarModalRechazo() {
            this.rejectModal.classList.add('hidden');
        }

        enviarRechazo() {
            const razon = document.getElementById('rejection-reason').value.trim();
            if (!razon) {
                alert('Por favor, ingresa un motivo para el rechazo.');
                return;
            }

            if (this.currentProfileId) {
                this.manager.actualizarEstado(this.currentProfileId, 'rejected', razon);
                alert(`Perfil ID ${this.currentProfileId} rechazado. Motivo: "${razon}"`);
                this.ocultarModalRechazo();
                this.volverALista();
                this.renderizarTabla(this.statusFilter.value);
            }
        }

        initEventListeners() {
            this.statusFilter.addEventListener('change', (e) => this.renderizarTabla(e.target.value));
            document.getElementById('back-to-list').addEventListener('click', () => this.volverALista());
            document.getElementById('approve-btn').addEventListener('click', () => this.aprobarPerfil());
            document.getElementById('reject-btn').addEventListener('click', () => this.mostrarModalRechazo());
            document.getElementById('modal-cancel-btn').addEventListener('click', () => this.ocultarModalRechazo());
            document.getElementById('modal-send-btn').addEventListener('click', () => this.enviarRechazo());
        }
    }

    // --- Inicializar la aplicación ---
    const manager = new CuidadorManager();
    new UIManager(manager);
});
