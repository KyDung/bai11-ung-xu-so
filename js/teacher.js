/* Trang giáo viên: đăng nhập email/mật khẩu (tự thêm @linklab.edu.vn), xem realtime bài học sinh.
   Dùng chung Firebase và Rules với các bài khác; chọn bài ở danh sách "Bài học". */
const TEACHER_EMAIL_DOMAIN = 'linklab.edu.vn';

// Tên hoạt động của bài này (bài khác sẽ hiện mã hoạt động)
const ACTIVITY_NAMES = Object.fromEntries([
  [Content.warmup.id, 'Khởi động · ' + Content.warmup.title],
  ...Content.learning.map((a, i) => [a.id, `Hình thành ${i + 1} · ${a.name}`]),
  ...Content.practice.map((a, i) => [a.id, `Luyện tập ${i + 1} · ${a.name}`])
]);

const Teacher = {
  rows: [], unsubscribe: null, lessonUnsubscribe: null,
  toEmail(v) { const s = String(v || '').trim().toLowerCase(); return s.includes('@') ? s : s + '@' + TEACHER_EMAIL_DOMAIN; },
  classKey(r) { return String(r.student?.className || '').trim().toLowerCase(); },
  fmt(t) { return t ? new Date(t).toLocaleString('vi-VN') : ''; },

  // Số câu đúng ngay lần đầu / tổng số câu (chỉ tính các hoạt động có chấm)
  firstTry(r) {
    const recs = [...(r.learning || []), ...(r.practice || [])].filter(x => x.total);
    return { ok: recs.reduce((n, x) => n + (x.firstTry || 0), 0), total: recs.reduce((n, x) => n + x.total, 0) };
  },

  render() {
    const filter = document.querySelector('#student-filter').value.trim().toLowerCase();
    const select = document.querySelector('#class-filter');
    const classes = new Map();
    this.rows.forEach(r => { const k = this.classKey(r); if (k && !classes.has(k)) classes.set(k, String(r.student.className).trim().toUpperCase()); });
    const chosen = select.value;
    select.innerHTML = '<option value="">Tất cả các lớp</option>' + [...classes].sort((a, b) => a[1].localeCompare(b[1], 'vi', { numeric: true })).map(([k, l]) => `<option value="${Util.esc(k)}">${Util.esc(l)}</option>`).join('');
    select.value = classes.has(chosen) ? chosen : '';
    const rows = this.rows.filter(x => (!select.value || this.classKey(x) === select.value) && `${x.student?.name} ${x.student?.className}`.toLowerCase().includes(filter));
    document.querySelector('#student-count').textContent = `Hiển thị ${rows.length}/${this.rows.length} bài`;
    document.querySelector('#students').innerHTML = rows.length ? rows.map((r, i) => {
      const ft = this.firstTry(r);
      return `<div class="student-row"><div><strong>${Util.esc(r.student?.name)}</strong> · ${Util.esc(r.student?.className)}<br>
        <span class="pill ${r.progress?.part1Submitted ? 'ok' : ''}">${r.progress?.part1Submitted ? '✓ Phần 1' : 'Chưa nộp phần 1'}</span>
        <span class="pill ${r.progress?.finalSubmitted ? 'ok' : ''}">${r.progress?.finalSubmitted ? '✓ Vận dụng' : 'Chưa nộp vận dụng'}</span>
        ${r.progress?.part1Score !== undefined ? `<span class="muted"> · Điểm phần 1: ${r.progress.part1Score}/10 (lần ${r.progress.practiceTries || 1})</span>` : ''}</div>
        <div class="row-actions"><button data-row="${i}" class="secondary">Xem bài →</button><button data-del="${i}" class="danger" title="Xóa bài này khỏi Firebase">Xóa</button></div></div>`;
    }).join('') : '<p>Chưa có bài nộp phù hợp.</p>';
    document.querySelectorAll('[data-row]').forEach(b => { b.onclick = () => this.detail(rows[Number(b.dataset.row)]); });
    document.querySelectorAll('[data-del]').forEach(b => { b.onclick = () => this.remove(rows[Number(b.dataset.del)]); });
  },

  async remove(row) {
    const name = (row.student?.name || 'học sinh') + ' · ' + (row.student?.className || '');
    if (!confirm('Xóa bài của ' + name + '? Bài bị xóa khỏi Firebase và không khôi phục được.')) return;
    const status = document.querySelector('#teacher-status');
    try {
      await this.fs.deleteDoc(this.fs.doc(this.db, 'lessons', document.querySelector('#lesson-select').value, 'students', row._id));
      Util.toast('Đã xóa bài của ' + name); document.querySelector('#student-detail').innerHTML = '';
    } catch (e) { status.textContent = 'Không xóa được (' + e.code + '). Kiểm tra quyền giáo viên trong Firestore Rules.'; }
  },

  detail(row) {
    const records = [...(row.learning || []), ...(row.practice || [])];
    const f = row.final, t = f?.typingStats || {};
    // Mọi nội dung học sinh gõ đều qua Util.esc, không chèn HTML thô
    document.querySelector('#student-detail').innerHTML = `<div class="panel"><h2>${Util.esc(row.student?.name)} · ${Util.esc(row.student?.className)}</h2>
      <p class="muted">Nộp phần 1: ${Util.esc(this.fmt(row.progress?.part1SubmittedAt)) || '—'} · Nộp Vận dụng: ${Util.esc(this.fmt(row.progress?.finalSubmittedAt)) || '—'}</p>
      ${records.map(r => `<details><summary>${Util.esc(ACTIVITY_NAMES[r.activityId] || r.activityId)} · ${r.passed ? 'Đạt' : 'Chưa đạt'} · ${Number(r.attempts) || 0} lần kiểm tra${r.score !== undefined ? ` · điểm ${Math.round(r.score * 10) / 10}/${r.total}` : ''}</summary><pre>${Util.esc(r.studentCode)}</pre></details>`).join('')}
      <h3 style="margin-top:24px">Vận dụng</h3>
      ${f ? `<p class="muted">Phần A: ${Number(f.partAAttempts) || 0} lần kiểm tra · Phím gõ: ${Number(t.keyCount) || 0} · Ký tự gõ: ${Number(t.charsTyped) || 0} · Lần dán bị chặn: ${Number(t.pasteBlocked) || 0}</p>
        <p>${Object.entries(f.requirements || {}).map(([k, v]) => `<span class="pill ${v ? 'ok' : ''}">${Util.esc(k)}: ${v ? 'đạt' : 'chưa'}</span>`).join(' ')}</p>
        <pre>${Util.esc(f.code)}</pre><button id="download-student" class="secondary">Tải bài làm (.txt)</button>` : '<p>Học sinh chưa nộp bài Vận dụng.</p>'}</div>`;
    if (f) document.querySelector('#download-student').onclick = () => Util.download('van-dung-' + Util.id(row.student?.name || 'hoc-sinh') + '.txt', f.code || '');
    document.querySelector('#student-detail').scrollIntoView({ behavior: 'smooth' });
  },

  async init() {
    const status = document.querySelector('#teacher-status');
    try {
      const { auth, login, fs, db } = await Api.sdk();
      this.fs = fs; this.db = db;
      const nameInput = document.querySelector('#login-name'), hint = document.querySelector('#login-hint');
      nameInput.oninput = () => { hint.textContent = nameInput.value.trim() ? 'Đăng nhập bằng: ' + Teacher.toEmail(nameInput.value) : ''; };
      document.querySelector('#login-form').onsubmit = async e => {
        e.preventDefault();
        const button = e.target.querySelector('button'); button.disabled = true; status.textContent = 'Đang đăng nhập…';
        try {
          const fd = new FormData(e.target);
          await auth.signInWithEmailAndPassword(login, Teacher.toEmail(fd.get('email')), fd.get('password'));
          e.target.reset();
        } catch { status.textContent = 'Không đăng nhập được. Kiểm tra tên đăng nhập, mật khẩu và kết nối mạng.'; }
        finally { button.disabled = false; }
      };
      document.querySelector('#logout').onclick = () => auth.signOut(login);
      document.querySelector('#student-filter').oninput = () => this.render();
      document.querySelector('#class-filter').onchange = () => this.render();

      const subscribe = id => {
        this.unsubscribe?.(); document.querySelector('#student-detail').innerHTML = '';
        this.unsubscribe = fs.onSnapshot(fs.collection(db, 'lessons', id, 'students'),
          snap => { this.rows = snap.docs.map(d => ({ ...d.data(), _id: d.id })); this.render(); },
          e => { status.textContent = 'Không thể đọc bài: ' + e.code + '. Kiểm tra quyền giáo viên trong Firestore.'; });
      };
      document.querySelector('#lesson-select').onchange = e => subscribe(e.target.value);

      auth.onAuthStateChanged(login, async user => {
        this.unsubscribe?.(); this.lessonUnsubscribe?.();
        document.querySelector('#teacher-data').hidden = true;
        document.querySelector('#login-panel').hidden = !!user;
        if (!user) { status.textContent = ''; this.rows = []; document.querySelector('#students').innerHTML = ''; document.querySelector('#student-detail').innerHTML = ''; return; }
        document.querySelector('#teacher-data').hidden = false;
        status.textContent = 'Đã đăng nhập: ' + user.email;
        this.lessonUnsubscribe = fs.onSnapshot(fs.collection(db, 'lessons'), snap => {
          const select = document.querySelector('#lesson-select'), previous = select.value;
          const lessons = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          if (!lessons.some(x => x.id === LESSON.id)) lessons.unshift({ id: LESSON.id, title: LESSON.title });
          select.innerHTML = lessons.map(l => `<option value="${Util.esc(l.id)}">${Util.esc(l.title || l.id)}</option>`).join('');
          select.value = lessons.some(l => l.id === previous) ? previous : LESSON.id;
          subscribe(select.value);
        }, e => {
          status.textContent = 'Tài khoản chưa được cấp quyền giáo viên hoặc Rules chưa được cập nhật (' + e.code + '). UID tài khoản: ' + user.uid;
          document.querySelector('#students').innerHTML = '<p>Hãy thêm UID này vào collection teachers theo README.</p>';
        });
      });
    } catch { status.textContent = 'Không tải được kết nối Firebase. Kiểm tra mạng rồi tải lại trang.'; }
  }
};
Teacher.init();
