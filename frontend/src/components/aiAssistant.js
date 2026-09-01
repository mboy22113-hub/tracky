import { api } from '../services/api.js';

export function setupAiAssistant(onActionClick) {
  const drawer = document.getElementById('ai-drawer');
  const openBtn = document.getElementById('open-ai-btn');
  const closeBtn = document.getElementById('close-ai-btn');
  const messagesContainer = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const promptPills = document.querySelectorAll('.chat-prompt-pill');

  function open() {
    if (drawer) drawer.classList.add('active');
  }

  function close() {
    if (drawer) drawer.classList.remove('active');
  }

  if (openBtn) openBtn.onclick = open;
  if (closeBtn) closeBtn.onclick = close;

  function appendMessage(sender, text, reason = null, action = null) {
    if (!messagesContainer) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;

    let html = `<div>${text}</div>`;
    if (reason) {
      html += `<div class="chat-msg-reason">${reason}</div>`;
    }
    if (action && action.label) {
      html += `<button class="chat-action-btn" data-action-type="${action.type}" data-action-payload='${JSON.stringify(action.payload || {})}'>${action.label} →</button>`;
    }
    msg.innerHTML = html;
    messagesContainer.appendChild(msg);

    // Bind action button
    const btn = msg.querySelector('.chat-action-btn');
    if (btn) {
      btn.onclick = () => {
        const type = btn.getAttribute('data-action-type');
        const payload = JSON.parse(btn.getAttribute('data-action-payload') || '{}');
        close();
        if (onActionClick) onActionClick(type, payload);
      };
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function handleSend(text) {
    const query = text || (input ? input.value.trim() : '');
    if (!query) return;
    if (input) input.value = '';

    appendMessage('user', query);

    // Loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'chat-msg assistant';
    loadingMsg.innerHTML = '<span style="font-style:italic;color:var(--muted);">Analyzing your Trackey data...</span>';
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const response = await api.chatAdvisor(query);
      loadingMsg.remove();
      appendMessage('assistant', response.answer, response.reason, response.action);
    } catch (err) {
      loadingMsg.remove();
      appendMessage('assistant', 'Based on your Trackey records, I am ready to advise you on your subscriptions.', 'Unable to connect to the advisor service momentarily.', null);
    }
  }

  if (sendBtn) {
    sendBtn.onclick = () => handleSend();
  }
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter') handleSend();
    };
  }
  promptPills.forEach(pill => {
    pill.onclick = () => {
      const promptText = pill.getAttribute('data-prompt') || pill.textContent.trim();
      handleSend(promptText);
    };
  });

  return { open, close, send: handleSend };
}
