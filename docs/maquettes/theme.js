// Bascule « Wireframe / Maquette » partagée par toutes les pages.
// Le choix est mémorisé dans le navigateur (localStorage) ; si le navigateur
// refuse le stockage, la page marche quand même, sans mémoire.
(function () {
  var KEY = 'tantsaha-maquettes-wire';
  var btn = document.getElementById('toggle-wire');

  function read() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* pas grave */ }
  }
  function apply(wire) {
    document.body.classList.toggle('wire', wire);
    if (btn) {
      btn.setAttribute('aria-pressed', wire ? 'true' : 'false');
      btn.textContent = wire ? 'Mode : wireframe (gris)' : 'Mode : maquette (couleurs)';
    }
  }

  apply(read());
  if (btn) {
    btn.addEventListener('click', function () {
      var wire = !document.body.classList.contains('wire');
      apply(wire);
      write(wire);
    });
  }
})();
