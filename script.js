// --- Global Helper Functions ---
function showFeedbackMessage(message, type = 'success') {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.textContent = message;
    feedbackDiv.style.position = 'fixed';
    feedbackDiv.style.bottom = '20px';
    feedbackDiv.style.left = '50%';
    feedbackDiv.style.transform = 'translateX(-50%)';
    feedbackDiv.style.padding = '10px 20px';
    feedbackDiv.style.borderRadius = '5px';
    feedbackDiv.style.zIndex = '1000';
    feedbackDiv.style.transition = 'opacity 0.5s ease-out';
    feedbackDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    if (type === 'success') {
        feedbackDiv.style.backgroundColor = '#28a745'; // Green for success
        feedbackDiv.style.color = 'white';
    } else if (type === 'error') {
        feedbackDiv.style.backgroundColor = '#dc3545'; // Red for error
        feedbackDiv.style.color = 'white';
    } else { // General info
        feedbackDiv.style.backgroundColor = '#17a2b8'; // Blue for info
        feedbackDiv.style.color = 'white';
    }

    document.body.appendChild(feedbackDiv);

    // Trigger fade in
    setTimeout(() => {
      feedbackDiv.style.opacity = '1'; // Should be initially transparent or have opacity 0 set by CSS for a fade-in effect
    }, 10); // Small delay to ensure transition applies

    setTimeout(() => {
        feedbackDiv.style.opacity = '0';
        setTimeout(() => {
            if (feedbackDiv.parentNode) {
                feedbackDiv.parentNode.removeChild(feedbackDiv);
            }
        }, 500); // Wait for fade out transition
    }, 3000); // Message visible for 3 seconds
}


document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const contentSections = document.querySelectorAll('.content-section');

    // Base function to switch sections (will be wrapped)
    function _baseShowSection(sectionId) {
        contentSections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    // Initialize window.showSection with the base function
    if (typeof window.showSection === 'undefined') {
        window.showSection = _baseShowSection;
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            const sectionId = link.getAttribute('data-section');
            window.showSection(sectionId); 
        });
    });

    // --- Materias (Subjects) Feature ---
    const MATERIAS_KEY = 'cerebroEstudiante_materias';
    const NOTAS_KEY = 'cerebroEstudiante_notas';
    const EVENTOS_KEY = 'cerebroEstudiante_eventos';

    const btnAnadirMateria = document.getElementById('btnAnadirMateria');
    const formMateria = document.getElementById('formMateria');
    const btnCancelarMateria = document.getElementById('btnCancelarMateria');
    const listaMateriasContainer = document.getElementById('listaMaterias');

    const materiaIdInput = document.getElementById('materiaId');
    const materiaNombreInput = document.getElementById('materiaNombre');
    const materiaDescripcionInput = document.getElementById('materiaDescripcion');
    const materiaColorInput = document.getElementById('materiaColor');
    const materiaProfesorInput = document.getElementById('materiaProfesor');
    const materiaHorarioInput = document.getElementById('materiaHorario');

    if (typeof window.getMaterias === 'undefined') {
        window.getMaterias = function() {
            const materiasJSON = localStorage.getItem(MATERIAS_KEY);
            return materiasJSON ? JSON.parse(materiasJSON) : [];
        }
    }
    if (typeof window.saveMaterias === 'undefined') {
        window.saveMaterias = function(materias) {
            localStorage.setItem(MATERIAS_KEY, JSON.stringify(materias));
        }
    }

    function displayMaterias() {
        if (!listaMateriasContainer) return;
        listaMateriasContainer.innerHTML = ''; 
        const materias = window.getMaterias();
        if (materias.length === 0) {
            listaMateriasContainer.innerHTML = '<p>No hay materias añadidas aún. ¡Añade una para empezar!</p>';
            return;
        }
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';
        materias.forEach(materia => {
            const li = document.createElement('li');
            li.style.backgroundColor = '#fff';
            li.style.padding = '15px';
            li.style.marginBottom = '10px';
            li.style.borderLeft = '5px solid ' + (materia.color || '#ccc');
            li.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            const textContentDiv = document.createElement('div');
            textContentDiv.innerHTML = 
                '<h3 style="margin-top:0; margin-bottom:5px; color: ' + (materia.color || '#333') + ';">' + materia.nombre + '</h3>' +
                '<p style="margin-bottom:5px;"><strong>Descripción:</strong> ' + (materia.descripcion || 'N/A') + '</p>' +
                '<p style="margin-bottom:5px;"><strong>Profesor:</strong> ' + (materia.profesor || 'N/A') + '</p>' +
                '<p style="margin-bottom:0;"><strong>Horario:</strong> ' + (materia.horario || 'N/A') + '</p>';
            const buttonsDiv = document.createElement('div');
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-secondary'; 
            btnEditar.style.marginRight = '10px';
            btnEditar.addEventListener('click', () => loadMateriaForEdit(materia.id));
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'btn btn-danger';
            btnEliminar.addEventListener('click', () => deleteMateria(materia.id));
            buttonsDiv.appendChild(btnEditar);
            buttonsDiv.appendChild(btnEliminar);
            li.appendChild(textContentDiv);
            li.appendChild(buttonsDiv);
            ul.appendChild(li);
        });
        listaMateriasContainer.appendChild(ul);
    }

    function toggleFormMateria(show = true) {
        if (formMateria) formMateria.style.display = show ? 'block' : 'none';
    }

    if (btnAnadirMateria) {
        btnAnadirMateria.addEventListener('click', () => {
            if (formMateria) formMateria.reset(); 
            if (materiaIdInput) materiaIdInput.value = ''; 
            if (materiaColorInput) materiaColorInput.value = '#4287f5'; 
            toggleFormMateria(true);
            if (materiaNombreInput) materiaNombreInput.focus();
        });
    }

    if (btnCancelarMateria) {
        btnCancelarMateria.addEventListener('click', () => {
            toggleFormMateria(false);
            if (formMateria) formMateria.reset();
        });
    }

    if (formMateria) {
        formMateria.addEventListener('submit', (event) => {
            event.preventDefault();
            const id = materiaIdInput.value;
            const nombre = materiaNombreInput.value.trim();
            if (!nombre) {
                alert('El nombre de la materia es obligatorio.'); // Consider replacing with showFeedbackMessage(..., 'error')
                if (materiaNombreInput) materiaNombreInput.focus();
                return;
            }
            const newMateriaData = {
                nombre,
                descripcion: materiaDescripcionInput.value.trim(),
                color: materiaColorInput.value,
                profesor: materiaProfesorInput.value.trim(),
                horario: materiaHorarioInput.value.trim()
            };
            let materias = window.getMaterias();
            if (id) { 
                materias = materias.map(m => m.id === id ? { ...newMateriaData, id: m.id } : m);
            } else { 
                materias.push({ ...newMateriaData, id: Date.now().toString() });
            }
            window.saveMaterias(materias);
            showFeedbackMessage(id ? 'Materia actualizada con éxito.' : 'Materia guardada con éxito.');
            toggleFormMateria(false);
            if (formMateria) formMateria.reset();
            displayMaterias();
        });
    }

    function loadMateriaForEdit(id) {
        const materia = window.getMaterias().find(m => m.id === id);
        if (materia) {
            if (materiaIdInput) materiaIdInput.value = materia.id;
            if (materiaNombreInput) materiaNombreInput.value = materia.nombre;
            if (materiaDescripcionInput) materiaDescripcionInput.value = materia.descripcion || '';
            if (materiaColorInput) materiaColorInput.value = materia.color || '#4287f5';
            if (materiaProfesorInput) materiaProfesorInput.value = materia.profesor || '';
            if (materiaHorarioInput) materiaHorarioInput.value = materia.horario || '';
            toggleFormMateria(true);
            if (materiaNombreInput) materiaNombreInput.focus();
        }
    }

    function deleteMateria(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta materia? Esta acción no se puede deshacer.')) {
            window.saveMaterias(window.getMaterias().filter(m => m.id !== id));
            showFeedbackMessage('Materia eliminada.', 'error');
            displayMaterias();
            if (document.getElementById('tareas').style.display === 'block') {
                if(typeof populateMateriasDropdown === 'function') populateMateriasDropdown();
                if(typeof displayTareas === 'function') displayTareas();
            }
            if (document.getElementById('dashboard').style.display === 'block') {
                if(typeof displayDashboardMisMaterias === 'function') displayDashboardMisMaterias();
                if(typeof displayDashboardTareasPendientes === 'function') displayDashboardTareasPendientes(); 
            }
        }
    }
    
    const prevShowSectionForMaterias = window.showSection;
    window.showSection = function(sectionId) {
        prevShowSectionForMaterias(sectionId); 
        if (sectionId === 'materias') {
            if(typeof displayMaterias === 'function') displayMaterias();
        }
    };

    // --- Tareas (Tasks) Feature ---
    const TAREAS_KEY = 'cerebroEstudiante_tareas';
    const btnAnadirTarea = document.getElementById('btnAnadirTarea');
    const formTarea = document.getElementById('formTarea');
    const btnCancelarTarea = document.getElementById('btnCancelarTarea');
    const listaTareasContainer = document.getElementById('listaTareas');
    const tareaIdInput = document.getElementById('tareaId');
    const tareaTituloInput = document.getElementById('tareaTitulo');
    const tareaDescripcionInput = document.getElementById('tareaDescripcion');
    const tareaMateriaAsociadaSelect = document.getElementById('tareaMateriaAsociada');
    const tareaFechaLimiteInput = document.getElementById('tareaFechaLimite');
    const tareaPrioridadSelect = document.getElementById('tareaPrioridad');
    const tareaEtiquetasInput = document.getElementById('tareaEtiquetas');
    const tareaCompletadaCheckbox = document.getElementById('tareaCompletada');

    if (typeof window.getTareas === 'undefined') {
        window.getTareas = function() {
            const tareasJSON = localStorage.getItem(TAREAS_KEY);
            return tareasJSON ? JSON.parse(tareasJSON) : [];
        }
    }
    if (typeof window.saveTareas === 'undefined') {
        window.saveTareas = function(tareas) {
            localStorage.setItem(TAREAS_KEY, JSON.stringify(tareas));
        }
    }

    function populateMateriasDropdown() {
        if (!tareaMateriaAsociadaSelect) return;
        const materias = window.getMaterias();
        const currentValue = tareaMateriaAsociadaSelect.value;
        tareaMateriaAsociadaSelect.innerHTML = '<option value="">Ninguna</option>';
        materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.id;
            option.textContent = materia.nombre;
            if (materia.id === currentValue) option.selected = true;
            tareaMateriaAsociadaSelect.appendChild(option);
        });
    }

    function getMateriaColor(materiaId) {
        const materia = window.getMaterias().find(m => m.id === materiaId);
        return materia ? materia.color : null;
    }

    function displayTareas() {
        if (!listaTareasContainer) return;
        listaTareasContainer.innerHTML = '';
        const tareas = window.getTareas(); 
        const materias = window.getMaterias();
        if (tareas.length === 0) {
            listaTareasContainer.innerHTML = '<p>No hay tareas añadidas aún. ¡Añade una!</p>';
            return;
        }
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';
        tareas.sort((a, b) => (a.completada === b.completada) ? 0 : a.completada ? 1 : -1);
        tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.style.backgroundColor = tarea.completada ? '#e9e9e9' : '#fff';
            li.style.padding = '15px';
            li.style.marginBottom = '10px';
            const materiaColor = getMateriaColor(tarea.materiaAsociada);
            li.style.borderLeft = '5px solid ' + (tarea.completada ? '#6c757d' : (materiaColor || '#007bff'));
            li.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            li.style.textDecoration = tarea.completada ? 'line-through' : 'none';
            li.style.opacity = tarea.completada ? '0.7' : '1';
            const materiaAsociada = materias.find(m => m.id === tarea.materiaAsociada);
            const materiaNombre = materiaAsociada ? materiaAsociada.nombre : 'N/A';
            const etiquetas = tarea.etiquetas && tarea.etiquetas.length > 0 ? tarea.etiquetas.join(', ') : 'N/A';
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML =
                '<h3 style="margin-top:0; margin-bottom:5px;">' + tarea.titulo + '</h3>' +
                '<p style="margin-bottom:5px;"><strong>Materia:</strong> ' + materiaNombre + '</p>' +
                '<p style="margin-bottom:5px;"><strong>Fecha Límite:</strong> ' + (tarea.fechaLimite || 'N/A') + '</p>' +
                '<p style="margin-bottom:5px;"><strong>Prioridad:</strong> ' + tarea.prioridad + '</p>' +
                '<p style="margin-bottom:5px;"><strong>Etiquetas:</strong> ' + etiquetas + '</p>' +
                '<p style="margin-bottom:5px;"><strong>Descripción:</strong> ' + (tarea.descripcion || 'N/A') + '</p>';
            const controlsDiv = document.createElement('div');
            controlsDiv.style.marginTop = '10px';
            controlsDiv.style.display = 'flex';
            controlsDiv.style.alignItems = 'center';
            controlsDiv.style.flexWrap = 'wrap';
            const completeLabel = document.createElement('label');
            completeLabel.textContent = 'Completada: ';
            completeLabel.style.marginRight = '5px';
            const completeCheckbox = document.createElement('input');
            completeCheckbox.type = 'checkbox';
            completeCheckbox.checked = tarea.completada;
            completeCheckbox.style.marginRight = '20px';
            completeCheckbox.addEventListener('change', () => toggleTareaCompletada(tarea.id));
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-secondary';
            btnEditar.style.marginRight = '10px';
            btnEditar.style.marginBottom = '5px';
            btnEditar.addEventListener('click', () => loadTareaForEdit(tarea.id));
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'btn btn-danger';
            btnEliminar.style.marginBottom = '5px';
            btnEliminar.addEventListener('click', () => deleteTarea(tarea.id));
            controlsDiv.appendChild(completeLabel);
            controlsDiv.appendChild(completeCheckbox);
            if (!tarea.completada) controlsDiv.appendChild(btnEditar);
            controlsDiv.appendChild(btnEliminar);
            li.appendChild(contentDiv);
            li.appendChild(controlsDiv);
            ul.appendChild(li);
        });
        listaTareasContainer.appendChild(ul);
    }

    function toggleFormTarea(show = true) {
        if (formTarea) {
            formTarea.style.display = show ? 'block' : 'none';
            if (show && typeof populateMateriasDropdown === 'function') populateMateriasDropdown();
        }
    }

    if (btnAnadirTarea) {
        btnAnadirTarea.addEventListener('click', () => {
            if(formTarea) formTarea.reset();
            if(tareaIdInput) tareaIdInput.value = '';
            if(tareaCompletadaCheckbox) tareaCompletadaCheckbox.checked = false;
            if(tareaPrioridadSelect) tareaPrioridadSelect.value = 'Media'; 
            toggleFormTarea(true);
            if(tareaTituloInput) tareaTituloInput.focus();
        });
    }

    if (btnCancelarTarea) {
        btnCancelarTarea.addEventListener('click', () => {
            toggleFormTarea(false);
            if(formTarea) formTarea.reset();
        });
    }

    if (formTarea) {
        formTarea.addEventListener('submit', (event) => {
            event.preventDefault();
            const id = tareaIdInput.value;
            const titulo = tareaTituloInput.value.trim();
            if (!titulo) {
                alert('El título de la tarea es obligatorio.'); // Consider replacing with showFeedbackMessage(..., 'error')
                if(tareaTituloInput) tareaTituloInput.focus();
                return;
            }
            const newTareaData = {
                titulo,
                descripcion: tareaDescripcionInput.value.trim(),
                materiaAsociada: tareaMateriaAsociadaSelect.value,
                fechaLimite: tareaFechaLimiteInput.value,
                prioridad: tareaPrioridadSelect.value,
                etiquetas: tareaEtiquetasInput.value.trim().split(',').map(e => e.trim()).filter(e => e),
                completada: tareaCompletadaCheckbox.checked
            };
            let tareas = window.getTareas(); 
            if (id) { 
                tareas = tareas.map(t => t.id === id ? { ...newTareaData, id: t.id } : t);
            } else { 
                tareas.push({ ...newTareaData, id: Date.now().toString() });
            }
            window.saveTareas(tareas); 
            showFeedbackMessage(id ? 'Tarea actualizada con éxito.' : 'Tarea guardada con éxito.');
            toggleFormTarea(false);
            if(formTarea) formTarea.reset();
            if(typeof displayTareas === 'function') displayTareas();
            if (document.getElementById('dashboard').style.display === 'block') {
                 if(typeof displayDashboardTareasPendientes === 'function') displayDashboardTareasPendientes();
            }
        });
    }

    function loadTareaForEdit(id) {
        const tarea = window.getTareas().find(t => t.id === id); 
        if (tarea) {
            if(tareaIdInput) tareaIdInput.value = tarea.id;
            if(tareaTituloInput) tareaTituloInput.value = tarea.titulo;
            if(tareaDescripcionInput) tareaDescripcionInput.value = tarea.descripcion || '';
            if(typeof populateMateriasDropdown === 'function') populateMateriasDropdown(); 
            if(tareaMateriaAsociadaSelect) tareaMateriaAsociadaSelect.value = tarea.materiaAsociada || '';
            if(tareaFechaLimiteInput) tareaFechaLimiteInput.value = tarea.fechaLimite || '';
            if(tareaPrioridadSelect) tareaPrioridadSelect.value = tarea.prioridad || 'Media';
            if(tareaEtiquetasInput) tareaEtiquetasInput.value = tarea.etiquetas ? tarea.etiquetas.join(', ') : '';
            if(tareaCompletadaCheckbox) tareaCompletadaCheckbox.checked = tarea.completada;
            toggleFormTarea(true);
            if(tareaTituloInput) tareaTituloInput.focus();
        }
    }

    function deleteTarea(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            window.saveTareas(window.getTareas().filter(t => t.id !== id)); 
            showFeedbackMessage('Tarea eliminada.', 'error');
            if(typeof displayTareas === 'function') displayTareas();
            if (document.getElementById('dashboard').style.display === 'block') {
                if(typeof displayDashboardTareasPendientes === 'function') displayDashboardTareasPendientes();
            }
        }
    }

    function toggleTareaCompletada(id) {
        window.saveTareas(window.getTareas().map(t => t.id === id ? { ...t, completada: !t.completada } : t)); 
        showFeedbackMessage('Estado de tarea actualizado.');
        if(typeof displayTareas === 'function') displayTareas();
        if (document.getElementById('dashboard').style.display === 'block') {
             if(typeof displayDashboardTareasPendientes === 'function') displayDashboardTareasPendientes();
        }
    }
    
    const prevShowSectionForTareas = window.showSection;
    window.showSection = function(sectionId) {
        prevShowSectionForTareas(sectionId); 
        if (sectionId === 'tareas') {
            if(typeof populateMateriasDropdown === 'function') populateMateriasDropdown(); 
            if(typeof displayTareas === 'function') displayTareas();            
        }
    };

    // --- Dashboard Feature ---
    const listaDashboardTareasContainer = document.getElementById('listaDashboardTareas');
    const listaDashboardMateriasContainer = document.getElementById('listaDashboardMaterias');
    const btnAnadirRapido = document.getElementById('btnAnadirRapido');

    function displayDashboardTareasPendientes() {
        if (!listaDashboardTareasContainer) return;
        listaDashboardTareasContainer.innerHTML = '';
        const tareas = window.getTareas().filter(tarea => !tarea.completada); 
        tareas.sort((a, b) => {
            if (a.fechaLimite && b.fechaLimite) return new Date(a.fechaLimite) - new Date(b.fechaLimite);
            if (a.fechaLimite) return -1;
            if (b.fechaLimite) return 1;
            return 0;
        });
        if (tareas.length === 0) {
            listaDashboardTareasContainer.innerHTML = '<p>¡No tienes tareas pendientes! Buen trabajo.</p>';
            return;
        }
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';
        tareas.slice(0, 5).forEach(tarea => {
            const li = document.createElement('li');
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid #eee';
            const materiaAsociada = window.getMaterias().find(m => m.id === tarea.materiaAsociada); 
            const materiaNombre = materiaAsociada ? materiaAsociada.nombre : 'General';
            const materiaColor = materiaAsociada ? materiaAsociada.color : '#007bff';
            li.style.borderLeft = '4px solid ' + materiaColor;
            li.innerHTML = '<strong>' + tarea.titulo + '</strong> (' + materiaNombre + ')' +
                           (tarea.fechaLimite ? ' - <em>Vence: ' + tarea.fechaLimite + '</em>' : '') +
                           ' <small style="display:block; color: #555;">Prioridad: ' + tarea.prioridad + '</small>';
            ul.appendChild(li);
        });
        listaDashboardTareasContainer.appendChild(ul);
        if (tareas.length > 5) {
            const VerMasLink = document.createElement('a');
            VerMasLink.href = '#';
            VerMasLink.textContent = 'Ver todas las tareas pendientes (' + tareas.length + ')';
            VerMasLink.style.display = 'block';
            VerMasLink.style.marginTop = '10px';
            VerMasLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.showSection('tareas'); 
            });
            listaDashboardTareasContainer.appendChild(VerMasLink);
        }
    }

    function displayDashboardMisMaterias() {
        if (!listaDashboardMateriasContainer) return;
        listaDashboardMateriasContainer.innerHTML = '';
        const materias = window.getMaterias(); 
        if (materias.length === 0) {
            listaDashboardMateriasContainer.innerHTML = '<p>Aún no has añadido ninguna materia.</p>';
            return;
        }
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';
        ul.style.display = 'flex';
        ul.style.flexWrap = 'wrap';
        materias.forEach(materia => {
            const li = document.createElement('li');
            li.style.backgroundColor = materia.color || '#007bff';
            li.style.color = 'white';
            li.style.padding = '10px 15px';
            li.style.margin = '5px';
            li.style.borderRadius = '5px';
            li.style.cursor = 'pointer';
            li.textContent = materia.nombre;
            li.title = 'Ver detalles de ' + materia.nombre;
            li.addEventListener('click', () => {
                 window.showSection('materias'); 
            });
            ul.appendChild(li);
        });
        listaDashboardMateriasContainer.appendChild(ul);
    }

    if (btnAnadirRapido) {
        btnAnadirRapido.addEventListener('click', () => {
            window.showSection('tareas'); 
            if (btnAnadirTarea && typeof btnAnadirTarea.click === 'function') {
                btnAnadirTarea.click();
            }
        });
    }

    const prevShowSectionForDashboard = window.showSection;
    window.showSection = function(sectionId) {
        prevShowSectionForDashboard(sectionId); 
        if (sectionId === 'dashboard') {
            if(typeof displayDashboardTareasPendientes === 'function') displayDashboardTareasPendientes();
            if(typeof displayDashboardMisMaterias === 'function') displayDashboardMisMaterias();
        } else if (sectionId === 'notas') { // Added for Notas
            if(typeof displayNotas === 'function') displayNotas();
        } else if (sectionId === 'calendario') { // Added for Calendario
            if(typeof displayCalendario === 'function') displayCalendario();
        }
    };

    const initialSection = 'dashboard'; 
    window.showSection(initialSection); 


    // --- Notas (Notes) Feature ---

    // --- Calendario (Calendar) Feature ---
    const calendarioVistaContainer = document.getElementById('calendarioVistaContainer');
    const formEvento = document.getElementById('formEvento');
    const eventoIdInput = document.getElementById('eventoId');
    const eventoTituloInput = document.getElementById('eventoTitulo');
    const eventoDescripcionInput = document.getElementById('eventoDescripcion');
    const eventoFechaInicioInput = document.getElementById('eventoFechaInicio');
    const eventoFechaFinInput = document.getElementById('eventoFechaFin');
    const eventoMateriaAsociadaSelect = document.getElementById('eventoMateriaAsociada');
    const btnAnadirEvento = document.getElementById('btnAnadirEvento');
    const btnCancelarEvento = document.getElementById('btnCancelarEvento');


    if (btnAnadirEvento) {
        btnAnadirEvento.addEventListener('click', () => {
            if (formEvento) formEvento.reset();
            if (eventoIdInput) eventoIdInput.value = '';
            populateEventoMateriasDropdown(); // Ensure dropdown is populated
            toggleFormEvento(true);
            if (eventoTituloInput) eventoTituloInput.focus();
        });
    }

    if (btnCancelarEvento) {
        btnCancelarEvento.addEventListener('click', () => {
            toggleFormEvento(false);
            if (formEvento) formEvento.reset();
        });
    }

    // Funciones CRUD para Eventos
    if (formEvento) {
        formEvento.addEventListener('submit', (event) => {
            event.preventDefault();
            const id = eventoIdInput.value;
            const titulo = eventoTituloInput.value.trim();
            const descripcion = eventoDescripcionInput.value.trim();
            const fechaInicio = eventoFechaInicioInput.value;
            const fechaFin = eventoFechaFinInput.value;
            const materiaAsociada = eventoMateriaAsociadaSelect.value;

            if (!titulo || !fechaInicio) {
                showFeedbackMessage('El título y la fecha de inicio del evento son obligatorios.', 'error');
                if (!titulo && eventoTituloInput) eventoTituloInput.focus();
                else if (eventoFechaInicioInput) eventoFechaInicioInput.focus();
                return;
            }

            let eventos = window.getEventos();
            const now = new Date();
            let fechaCreacion = now;

            if (id) { // Editing existing evento
                const eventoExistente = eventos.find(e => e.id === id);
                if (eventoExistente && eventoExistente.fechaCreacion) {
                    fechaCreacion = new Date(eventoExistente.fechaCreacion); 
                }
                eventos = eventos.map(e =>
                    e.id === id ? { ...e, titulo, descripcion, fechaInicio, fechaFin, materiaAsociada, fechaModificacion: now } : e
                );
            } else { // New evento
                const nuevoEvento = {
                    id: Date.now().toString(),
                    titulo,
                    descripcion,
                    fechaInicio,
                    fechaFin,
                    materiaAsociada,
                    fechaCreacion: fechaCreacion,
                    fechaModificacion: now
                };
                eventos.push(nuevoEvento);
            }

            window.saveEventos(eventos);
            showFeedbackMessage(id ? 'Evento actualizado con éxito.' : 'Evento guardado con éxito.');
            toggleFormEvento(false);
            if (formEvento) formEvento.reset();
            if (typeof displayCalendario === 'function') displayCalendario();
        });
    }

    if (typeof window.getEventos === 'undefined') {
        window.getEventos = function() {
            const eventosJSON = localStorage.getItem(EVENTOS_KEY);
            return eventosJSON ? JSON.parse(eventosJSON) : [];
        }
    }

    if (typeof window.saveEventos === 'undefined') {
        window.saveEventos = function(eventos) {
            localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos));
        }
    }

    const formNota = document.getElementById('formNota');
    const notaIdInput = document.getElementById('notaId');
    const notaTituloInput = document.getElementById('notaTitulo');
    const notaContenidoInput = document.getElementById('notaContenido');
    const btnAnadirNota = document.getElementById('btnAnadirNota');
    const btnCancelarNota = document.getElementById('btnCancelarNota');
    const listaNotasContainer = document.getElementById('listaNotas');

    function displayCalendario() {
        if (!calendarioVistaContainer) return;
        calendarioVistaContainer.innerHTML = '';
        const eventos = window.getEventos();
        const materias = window.getMaterias(); // Para obtener nombres de materias

        if (eventos.length === 0) {
            calendarioVistaContainer.innerHTML = '<p>No hay eventos en el calendario. ¡Añade uno!</p>';
            return;
        }

        // Ordenar eventos por fecha de inicio
        eventos.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';

        eventos.forEach(evento => {
            const li = document.createElement('li');
            li.className = 'evento-item'; // Para CSS styling
            li.setAttribute('data-id', evento.id);

            const tituloElem = document.createElement('h3');
            tituloElem.textContent = evento.titulo;

            const descripcionElem = document.createElement('p');
            descripcionElem.textContent = evento.descripcion || 'Sin descripción.';

            const fechaInicioElem = document.createElement('p');
            fechaInicioElem.innerHTML = `<strong>Inicio:</strong> ${new Date(evento.fechaInicio).toLocaleDateString()}`;
            
            const fechaFinElem = document.createElement('p');
            if (evento.fechaFin) {
                fechaFinElem.innerHTML = `<strong>Fin:</strong> ${new Date(evento.fechaFin).toLocaleDateString()}`;
            }

            const materiaElem = document.createElement('p');
            if (evento.materiaAsociada) {
                const materia = materias.find(m => m.id === evento.materiaAsociada);
                materiaElem.innerHTML = `<strong>Materia:</strong> ${materia ? materia.nombre : 'No especificada'}`;
                if(materia && materia.color) { // Opcional: Colorear borde izquierdo o texto
                    li.style.borderLeft = `5px solid ${materia.color}`;
                }
            }
            
            const fechaModElem = document.createElement('small');
            fechaModElem.className = 'fecha'; // Reutilizar estilo si aplica
            fechaModElem.textContent = `Última modificación: ${new Date(evento.fechaModificacion).toLocaleString()}`;
            fechaModElem.style.display = 'block'; // Asegurar que sea un bloque
            fechaModElem.style.marginTop = '5px';


            const accionesDiv = document.createElement('div');
            accionesDiv.className = 'acciones';
            accionesDiv.style.marginTop = '10px';

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-secondary btn-sm';
            btnEditar.addEventListener('click', () => loadEventoForEdit(evento.id));

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'btn btn-danger btn-sm';
            btnEliminar.addEventListener('click', () => deleteEvento(evento.id));

            accionesDiv.appendChild(btnEditar);
            accionesDiv.appendChild(btnEliminar);

            li.appendChild(tituloElem);
            li.appendChild(descripcionElem);
            li.appendChild(fechaInicioElem);
            if (evento.fechaFin) li.appendChild(fechaFinElem);
            if (evento.materiaAsociada) li.appendChild(materiaElem);
            li.appendChild(fechaModElem);
            li.appendChild(accionesDiv);
            ul.appendChild(li);
        });
        calendarioVistaContainer.appendChild(ul);
    }

    function loadEventoForEdit(id) {
        const eventos = window.getEventos();
        const evento = eventos.find(e => e.id === id);
        if (evento) {
            if (eventoIdInput) eventoIdInput.value = evento.id;
            if (eventoTituloInput) eventoTituloInput.value = evento.titulo;
            if (eventoDescripcionInput) eventoDescripcionInput.value = evento.descripcion || '';
            if (eventoFechaInicioInput) eventoFechaInicioInput.value = evento.fechaInicio;
            if (eventoFechaFinInput) eventoFechaFinInput.value = evento.fechaFin || '';
            if (typeof populateEventoMateriasDropdown === 'function') populateEventoMateriasDropdown();
            if (eventoMateriaAsociadaSelect) eventoMateriaAsociadaSelect.value = evento.materiaAsociada || '';
            toggleFormEvento(true);
            if (eventoTituloInput) eventoTituloInput.focus();
        }
    }

    function deleteEvento(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.')) {
            let eventos = window.getEventos();
            eventos = eventos.filter(e => e.id !== id);
            window.saveEventos(eventos);
            showFeedbackMessage('Evento eliminado.', 'error'); // Or 'success'
            if (typeof displayCalendario === 'function') displayCalendario();
        }
    }

    // Funciones CRUD para Notas
    if (typeof window.getNotas === 'undefined') {
        window.getNotas = function() {
            const notasJSON = localStorage.getItem(NOTAS_KEY);
            return notasJSON ? JSON.parse(notasJSON) : [];
        }
    }

    function toggleFormNota(show = true) {
        if (formNota) {
            formNota.style.display = show ? 'block' : 'none';
        }
    }

    if (btnAnadirNota) {
        btnAnadirNota.addEventListener('click', () => {
            if (formNota) formNota.reset();
            if (notaIdInput) notaIdInput.value = '';
            toggleFormNota(true);
            if (notaTituloInput) notaTituloInput.focus();
        });
    }

    if (btnCancelarNota) {
        btnCancelarNota.addEventListener('click', () => {
            toggleFormNota(false);
            if (formNota) formNota.reset();
        });
    }

    if (formNota) {
        formNota.addEventListener('submit', (event) => {
            event.preventDefault();
            const id = notaIdInput.value;
            const titulo = notaTituloInput.value.trim();
            const contenido = notaContenidoInput.value.trim();

            if (!titulo) {
                showFeedbackMessage('El título de la nota es obligatorio.', 'error');
                if (notaTituloInput) notaTituloInput.focus();
                return;
            }

            let notas = window.getNotas();
            const now = new Date();
            let fechaCreacion = now;

            if (id) { // Editing existing note
                const notaExistente = notas.find(n => n.id === id);
                if (notaExistente && notaExistente.fechaCreacion) {
                    fechaCreacion = new Date(notaExistente.fechaCreacion); // Preserve original creation date
                }
                notas = notas.map(n => 
                    n.id === id ? { ...n, titulo, contenido, fechaModificacion: now } : n
                );
            } else { // New note
                const nuevaNota = {
                    id: Date.now().toString(),
                    titulo,
                    contenido,
                    fechaCreacion: fechaCreacion,
                    fechaModificacion: now
                };
                notas.push(nuevaNota);
            }

            window.saveNotas(notas);
            showFeedbackMessage(id ? 'Nota actualizada con éxito.' : 'Nota guardada con éxito.');
            toggleFormNota(false);
            if (formNota) formNota.reset();
            if (typeof displayNotas === 'function') displayNotas();
        });
    }

    function displayNotas() {
        if (!listaNotasContainer) return;
        listaNotasContainer.innerHTML = '';
        const notas = window.getNotas();

        if (notas.length === 0) {
            listaNotasContainer.innerHTML = '<p>No hay notas aún. ¡Añade una!</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';

        notas.sort((a, b) => new Date(b.fechaModificacion) - new Date(a.fechaModificacion)); // Sort by most recently modified

        notas.forEach(nota => {
            const li = document.createElement('li');
            li.className = 'nota-item'; // For CSS styling
            li.setAttribute('data-id', nota.id);

            const tituloElem = document.createElement('h3');
            tituloElem.textContent = nota.titulo;

            const contenidoResumen = document.createElement('p');
            contenidoResumen.className = 'contenido-resumen';
            contenidoResumen.textContent = nota.contenido.substring(0, 100) + (nota.contenido.length > 100 ? '...' : '');

            const fechaModElem = document.createElement('small');
            fechaModElem.className = 'fecha';
            fechaModElem.textContent = `Última modificación: ${new Date(nota.fechaModificacion).toLocaleString()}`;
            
            const fechaCreacionElem = document.createElement('small');
            fechaCreacionElem.className = 'fecha';
            fechaCreacionElem.textContent = `Creación: ${new Date(nota.fechaCreacion).toLocaleString()}`;


            const accionesDiv = document.createElement('div');
            accionesDiv.className = 'acciones';

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-secondary btn-sm'; // Added btn-sm for smaller buttons
            btnEditar.addEventListener('click', () => loadNotaForEdit(nota.id));

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'btn btn-danger btn-sm'; // Added btn-sm
            btnEliminar.addEventListener('click', () => deleteNota(nota.id));

            accionesDiv.appendChild(btnEditar);
            accionesDiv.appendChild(btnEliminar);

            li.appendChild(tituloElem);
            li.appendChild(contenidoResumen);
            li.appendChild(fechaModElem);
            li.appendChild(fechaCreacionElem);
            li.appendChild(accionesDiv);
            ul.appendChild(li);
        });
        listaNotasContainer.appendChild(ul);
    }

    function loadNotaForEdit(id) {
        const notas = window.getNotas();
        const nota = notas.find(n => n.id === id);
        if (nota) {
            if (notaIdInput) notaIdInput.value = nota.id;
            if (notaTituloInput) notaTituloInput.value = nota.titulo;
            if (notaContenidoInput) notaContenidoInput.value = nota.contenido;
            toggleFormNota(true);
            if (notaTituloInput) notaTituloInput.focus();
        }
    }

    function deleteNota(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.')) {
            let notas = window.getNotas();
            notas = notas.filter(n => n.id !== id);
            window.saveNotas(notas);
            showFeedbackMessage('Nota eliminada.', 'error'); // Or 'success' depending on desired feedback
            if (typeof displayNotas === 'function') displayNotas();
        }
    }

    if (typeof window.saveNotas === 'undefined') {
        window.saveNotas = function(notas) {
            localStorage.setItem(NOTAS_KEY, JSON.stringify(notas));
        }
    }

});
