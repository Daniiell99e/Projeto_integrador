document.addEventListener('DOMContentLoaded', function() {
        // --- LÓGICA DAS ABAS ---
        const tabs = document.querySelectorAll('.tab-link');
        const contents = document.querySelectorAll('.details-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', function(event) {
                event.preventDefault();
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const targetContent = document.getElementById(this.getAttribute('data-tab'));
                if (targetContent) targetContent.classList.add('active');
            });
        });

        // --- LÓGICA DE EDIÇÃO DO FORMULÁRIO ---
        const editProfileBtn = document.querySelector('.edit-profile-btn');
        const profileForm = document.getElementById('dados-pessoais');
        const saveChangesBtn = document.getElementById('saveChangesBtn');
        const cancelBtn = document.getElementById('cancelBtn');

        editProfileBtn.addEventListener('click', function() {
            profileForm.classList.add('is-editing');
            profileForm.querySelectorAll('.view-mode').forEach(p => {
                const fieldName = p.dataset.field;
                const input = profileForm.querySelector(`.edit-mode[data-field="${fieldName}"]`);
                if (input) {
                    if (input.type === 'date') {
                        const dateParts = p.textContent.trim().split('/');
                        if (dateParts.length === 3) {
                            input.value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                        }
                    } else {
                        input.value = p.textContent.trim();
                    }
                }
            });
        });

        saveChangesBtn.addEventListener('click', function(event) {
            event.preventDefault();
            profileForm.querySelectorAll('.edit-mode').forEach(input => {
                const fieldName = input.dataset.field;
                const p = profileForm.querySelector(`.view-mode[data-field="${fieldName}"]`);
                if (p) {
                    if (input.type === 'date') {
                        const dateParts = input.value.split('-');
                         if (dateParts.length === 3 && input.value) {
                            p.textContent = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                        } else {
                            p.textContent = '';
                        }
                    } else {
                        p.textContent = input.value;
                    }
                }
            });
            profileForm.classList.remove('is-editing');
        });

        cancelBtn.addEventListener('click', function() {
            profileForm.classList.remove('is-editing');
        });
    });