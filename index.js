document.addEventListener('DOMContentLoaded', function() {
    const templateName = 'templates/PermanentResidentCard.json'

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    dropZone.addEventListener('dragover', function(event) {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function(event) {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', function(event) {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    


    function compareJSON(json1, json2) {
        const keys1 = Object.keys(json1);
        const keys2 = Object.keys(json2);
        
        if (keys1.length !== keys2.length) {
            return false;
        }
        
        for (let key of keys1) {
            if (!keys2.includes(key)) {
                return false;
            }
        }
        
        return true;
    }

    function handleFile(file) {
        if (file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    // Asumimos que el archivo JSON está en la carpeta 'templates' y su nombre coincide con 'templateName'
                    fetch(templateName)
                        .then(response => response.json())
                        .then(data => {
                            if (compareJSON(jsonData.credentialSubject, data.credentialSubject)) {
                                buildForm(jsonData, templateName);
                            } else {
                                displayMessage('JSON file does not match the selected template.');
                            }
                            
                        })
                        .catch(error => {
                            console.error('Error al cargar la plantilla:', error);
                            displayMessage('Error al cargar la plantilla. Por favor, revise la consola para más detalles.');
                        });
                } catch (error) {
                    displayMessage('Error parsing JSON file.');
                }
            };
            reader.readAsText(file);
        } else {
            displayMessage('Please upload a valid JSON file.');
        }
    }

    function buildForm(template) {

        const formContainer = document.getElementById('dynamicForm');
        formContainer.innerHTML = ''; // Limpia el contenedor del formulario

        const form = document.createElement('form');
        form.onsubmit = function(event) {
        };

        // Creación dinámica del formulario basado en la plantilla JSON
        Object.keys(template.credentialSubject).forEach(key => {
            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            const label = document.createElement('label');
            label.setAttribute('for', key);
            label.textContent = key;
            inputGroup.appendChild(label);

            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('name', key);
            input.setAttribute('id', key); // Asegúrate de que el 'id' y el 'for' del label coincidan
            input.value = template.credentialSubject[key]; // Asigna el valor del JSON a la entrada del formulario
            input.setAttribute('readonly', true); // Bloquea el input para que no se pueda cambiar el valor
            inputGroup.appendChild(input);

            form.appendChild(inputGroup);
        });

        const submitButton = document.createElement('input');
        submitButton.setAttribute('type', 'submit');
        submitButton.setAttribute('value', 'Send');
        form.appendChild(submitButton);

        formContainer.appendChild(form);
    }

    function displayMessage(message) {
        // Busca un contenedor de mensajes existente o crea uno nuevo si no existe
        let messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.setAttribute('id', 'messageContainer');
            document.body.appendChild(messageContainer);
        }
        
        // Actualiza el contenido del contenedor de mensajes
        messageContainer.textContent = message;
    }

});