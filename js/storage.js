const Util = {
  esc: v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  debounce: (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; },
  // Bỏ dấu, chỉ giữ chữ và số: dùng làm khóa document trên Firestore
  id: v => v.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^a-z0-9]/gi, ''),
  words: s => (String(s || '').trim().match(/\S+/g) || []).length,
  toast(message) {
    const el = document.querySelector('#toast');
    if (!el) return;
    el.textContent = message; el.classList.add('show');
    clearTimeout(this.timer); this.timer = setTimeout(() => el.classList.remove('show'), 4500);
  },
  download(name, text, type = 'text/plain') {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a'); a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};

// Khóa gắn LESSON.id vì các bài trên cùng github.io dùng chung origin
const Store = {
  key: `info-learning-${LESSON.id}::state-v1`,
  read() { try { return JSON.parse(localStorage.getItem(this.key)); } catch { return null; } },
  write(state) {
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
      const s = document.querySelector('#save-status'); if (s) s.textContent = 'Đã lưu trên máy';
    } catch { Util.toast('Không thể lưu trên máy. Em hãy giữ nguyên trang này cho tới khi nộp bài.'); }
  }
};
