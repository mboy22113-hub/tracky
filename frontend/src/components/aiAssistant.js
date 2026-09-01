import { api } from '../services/api.js';

export function setupAiAssistant(onActionClick) {
  const drawer = document.getElementById('ai-drawer');
  const openBtn = document.getElementById('open-ai-btn');
  const closeBtn = document.getElementById('close-ai-btn');
  const messagesContainer = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const micBtn = document.getElementById('chat-mic-btn');
  const promptPills = document.querySelectorAll('.chat-prompt-pill');

  let isGenerating = false;

  function scrollToBottom(smooth = true) {
    if (!messagesContainer) return;
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  function open() {
    if (drawer) {
      drawer.classList.add('active');
      setTimeout(() => {
        if (input) input.focus();
        scrollToBottom(false);
      }, 100);
    }
  }

  function close() {
    if (drawer) drawer.classList.remove('active');
  }

  if (openBtn) openBtn.onclick = open;
  if (closeBtn) closeBtn.onclick = close;

  // Append user message with immediate slide & fade in
  function appendUserMessage(text) {
    if (!messagesContainer) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg user animate-msg-user';
    msg.innerHTML = `<div>${escapeHtml(text)}</div>`;
    messagesContainer.appendChild(msg);
    scrollToBottom(true);
  }

  // Append AI message with smooth typewriter / word streaming effect
  function appendAiMessage(text, reason = null, action = null, animateStream = true) {
    if (!messagesContainer) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg assistant animate-msg-ai';

    const textWrapper = document.createElement('div');
    textWrapper.className = 'chat-msg-body';
    msg.appendChild(textWrapper);

    messagesContainer.appendChild(msg);
    scrollToBottom(true);

    if (animateStream && text && text.length > 0) {
      // Split by words for natural, fluid reading rhythm
      const words = text.split(' ');
      let currentWordIndex = 0;
      textWrapper.textContent = '';

      const streamTimer = setInterval(() => {
        if (currentWordIndex < words.length) {
          textWrapper.textContent += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex];
          currentWordIndex++;
          scrollToBottom(false);
        } else {
          clearInterval(streamTimer);
          finalizeAiMessage(msg, reason, action);
        }
      }, 18);
    } else {
      textWrapper.textContent = text;
      finalizeAiMessage(msg, reason, action);
    }
  }

  function finalizeAiMessage(msg, reason, action) {
    if (reason) {
      const reasonDiv = document.createElement('div');
      reasonDiv.className = 'chat-msg-reason animate-fade-in';
      reasonDiv.textContent = reason;
      msg.appendChild(reasonDiv);
    }

    if (action && action.label) {
      const btn = document.createElement('button');
      btn.className = 'chat-action-btn animate-fade-in';
      btn.setAttribute('data-action-type', action.type);
      btn.setAttribute('data-action-payload', JSON.stringify(action.payload || {}));
      btn.innerHTML = `${escapeHtml(action.label)} →`;
      btn.onclick = () => {
        const type = btn.getAttribute('data-action-type');
        const payload = JSON.parse(btn.getAttribute('data-action-payload') || '{}');
        close();
        if (onActionClick) onActionClick(type, payload);
      };
      msg.appendChild(btn);
    }
    scrollToBottom(true);
  }

  function showThinkingIndicator() {
    if (!messagesContainer) return null;
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-msg assistant chat-thinking-row animate-msg-ai';
    typingIndicator.id = 'chat-thinking-indicator';
    typingIndicator.innerHTML = `
      <div class="chat-typing-dots">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
      <span class="chat-thinking-label">Trackey AI is analyzing subscriptions...</span>
    `;
    messagesContainer.appendChild(typingIndicator);
    scrollToBottom(true);
    return typingIndicator;
  }

  async function handleSend(text) {
    if (isGenerating) return;
    const query = text || (input ? input.value.trim() : '');
    if (!query) return;

    if (input) {
      input.value = '';
      input.blur();
    }

    isGenerating = true;
    if (sendBtn) sendBtn.classList.add('loading');

    appendUserMessage(query);
    const thinkingIndicator = showThinkingIndicator();

    try {
      const response = await api.chatAdvisor(query);
      if (thinkingIndicator) thinkingIndicator.remove();
      appendAiMessage(response.answer, response.reason, response.action, true);
    } catch (err) {
      if (thinkingIndicator) thinkingIndicator.remove();
      appendAiMessage(
        'Based on your Trackey records, I am ready to advise you on your subscriptions.',
        'Unable to connect to the advisor service momentarily.',
        null,
        false
      );
    } finally {
      isGenerating = false;
      if (sendBtn) sendBtn.classList.remove('loading');
      if (input) input.focus();
    }
  }

  // Send button listener
  if (sendBtn) {
    sendBtn.onclick = () => handleSend();
  }

  // Input key listener
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
  }

  // Mic button voice-note simulation with rich interaction
  if (micBtn) {
    micBtn.onclick = () => {
      micBtn.classList.add('active-listening');
      if (input) {
        const originalPlaceholder = input.placeholder;
        input.placeholder = '🎙️ Listening for query...';
        setTimeout(() => {
          micBtn.classList.remove('active-listening');
          input.placeholder = originalPlaceholder;
          const sampleQueries = [
            'How can I save ₹500 this month?',
            'Compare Netflix and Prime Video',
            'What subscriptions are renewing soon?',
            'Which service has low usage?'
          ];
          const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
          input.value = randomQuery;
          input.focus();
        }, 850);
      }
    };
  }

  // Suggested prompt pills click handlers
  promptPills.forEach(pill => {
    pill.onclick = () => {
      const promptText = pill.getAttribute('data-prompt') || pill.textContent.trim();
      pill.classList.add('pill-pressed');
      setTimeout(() => pill.classList.remove('pill-pressed'), 180);
      handleSend(promptText);
    };
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return { open, close, send: handleSend };
}
