/**
 * script.js
 * --------------------------------------------------------------
 *  • Fond dynamique selon la position X/Y de la souris (dégradé HSL)
 *  • Validation côté client (nom, email, sujet, message)
 *  • Gestion du honeypot & du token CSRF
 *  • Envoi du formulaire via Fetch() (JSON) → contact.php
 *  • Affichage dynamique du message de réponse
 * --------------------------------------------------------------
 */

(() => {
    // ----------------------------------------------------------------
    // 1️⃣  Variables globales & références DOM
    // ----------------------------------------------------------------
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const csrfInput = document.getElementById('csrf_token');

    // Elements d’erreur (small.error) – on les récupère par groupe
    const fields = [
        { el: document.getElementById('name'), name: 'Nom' },
        { el: document.getElementById('email'), name: "Email" },
        { el: document.getElementById('subject'), name: "Sujet" },
        { el: document.getElementById('message'), name: "Message" }
    ];

    // ----------------------------------------------------------------
    // 2️⃣  Fond dynamique (requestAnimationFrame + HSL)
    // ----------------------------------------------------------------
    let mouseX = 0, mouseY = 0, scheduled = false;

    const updateBackground = () => {
        // Normalisation de la position de la souris (0–1)
        const xRatio = mouseX / window.innerWidth;
        const yRatio = mouseY / window.innerHeight;

        // Calcul du hue et de la saturation
        const hue = Math.round(xRatio * 360);               // 0 → 360°
        const sat = Math.round(30 + yRatio * 70);            // 30% → 100%
        const light1 = 55;                                  // couleur principale
        const light2 = 65;                                  // couleur secondaire

        // Mise à jour des variables CSS
        document.documentElement.style.setProperty('--bg1', `hsl(${hue}, ${sat}%, ${light1}%)`);
        document.documentElement.style.setProperty('--bg2', `hsl(${hue}, ${sat}%, ${light2}%)`);

        scheduled = false; // on a fini ce cycle
    };

    const onMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(updateBackground);
        }
    };
    window.addEventListener('mousemove', onMouseMove);

    // ----------------------------------------------------------------
    // 3️⃣  Récupération du token CSRF (token.php → JSON)
    // ----------------------------------------------------------------
    const loadCsrfToken = async () => {
        try {
            const resp = await fetch('php/token.php', { credentials: 'same-origin' });
            const data = await resp.json();
            csrfInput.value = data.token;
        } catch (err) {
            console.error('Impossible de récupérer le token CSRF', err);
        }
    };
    loadCsrfToken();

    // ----------------------------------------------------------------
    // 4️⃣  Fonctions utilitaires de validation
    // ----------------------------------------------------------------
    const setError = (input, message) => {
        const errorEl = input.parentElement.querySelector('.error');
        errorEl.textContent = message;
        input.classList.add('invalid');
    };
    const clearError = (input) => {
        const errorEl = input.parentElement.querySelector('.error');
        errorEl.textContent = '';
        input.classList.remove('invalid');
    };
    const validateEmail = (email) => {
        // Expression simple mais efficace
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    const trim = (str) => str.replace(/^\s+|\s+$/g, '');

    // ----------------------------------------------------------------
    // 5️⃣  Validation du formulaire côté client
    // ----------------------------------------------------------------
    const validateForm = () => {
        let valid = true;

        // Boucle sur chaque champ requis
        fields.forEach(({ el }) => {
            clearError(el);
            const value = trim(el.value);
            if (value === '') {
                setError(el, 'Ce champ est obligatoire.');
                valid = false;
            } else if (el.id === 'email' && !validateEmail(value)) {
                setError(el, 'Adresse email invalide.');
                valid = false;
            }
        });

        // Honeypot (si remplis → on bloque silencieusement)
        const honeypot = document.getElementById('website');
        if (honeypot.value.trim() !== '') {
            // Un robot a rempli le champ caché → le formulaire est considéré comme spam
            console.warn('Soumission détectée comme spam (honeypot).');
            valid = false;
        }

        return valid;
    };

    // ----------------------------------------------------------------
    // 6️⃣  Envoi du formulaire (Fetch API → contact.php)
    // ----------------------------------------------------------------
    const submitForm = async (e) => {
        e.preventDefault();

        // 1️⃣ Validation client
        if (!validateForm()) {
            formMessage.textContent = 'Veuillez corriger les erreurs ci‑dessus.';
            formMessage.className = 'form-message error';
            return;
        }

        // 2️⃣ Désactiver le bouton pendant l’envoi
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours…';

        try {
            const response = await fetch('php/contact.php', {
                method: 'POST',
                body: new FormData(form),
                credentials: 'same-origin' // pour envoyer le cookie de session (CSRF)
            });

            const result = await response.json();

            if (result.success) {
                formMessage.textContent = result.message || 'Message envoyé avec succès !';
                formMessage.className = 'form-message success';
                form.reset(); // on vide le formulaire
                // Regénérer un nouveau token CSRF pour la prochaine soumission
                loadCsrfToken();
            } else {
                formMessage.textContent = result.message || 'Une erreur est survenue.';
                formMessage.className = 'form-message error';
            }
        } catch (err) {
            console.error('Erreur lors de l’envoi du formulaire', err);
            formMessage.textContent = 'Impossible de contacter le serveur. Réessayez plus tard.';
            formMessage.className = 'form-message error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer';
        }
    };

    form.addEventListener('submit', submitForm);
})();

