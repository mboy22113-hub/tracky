export function setupModal() {
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');

  function open(modalTitle, contentHtml) {
    if (title) title.textContent = modalTitle;
    if (body) body.innerHTML = contentHtml;
    if (overlay) overlay.classList.add('active');
  }

  function close() {
    if (overlay) overlay.classList.remove('active');
    if (body) body.innerHTML = '';
  }

  if (closeBtn) closeBtn.onclick = close;
  if (overlay) {
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };
  }

  return { open, close };
}
