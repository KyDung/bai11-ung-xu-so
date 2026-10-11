/* Điều phối ứng dụng: trạng thái, điều hướng theo hash, các màn hình, nộp bài.
   4 hoạt động theo Công văn 5512: Khởi động → Hình thành kiến thức → Luyện tập → Vận dụng. */
const STAGES = ['home', 'warmup', 'learning', 'practice', 'final'];
const STAGE_LABEL = { warmup: 'Khởi động', learning: 'Hình thành kiến thức', practice: 'Luyện tập', final: 'Vận dụng' };

const App = {
  state: null, submitting: false,

  fresh() {
    return { student: null, studentId: null, warmup: null, drafts: {}, learning: [], practice: [], final: Final.fresh(), part1SubmittedAt: null, finalSubmittedAt: null };
  },
  save() { Store.write(this.state); },
  saveSoon: Util.debounce(() => App.save(), 400),

  acts(kind) { return Content[kind]; },
  rec(kind, act) { return this.state[kind].find(r => r.activityId === act.id); },
  passed(kind, act) { return !!this.rec(kind, act)?.passed; },
  completed(kind) { return this.acts(kind).every(a => this.passed(kind, a)); },
  availableIndex(kind) { const a = this.acts(kind), i = a.findIndex(x => !this.passed(kind, x)); return i < 0 ? a.length - 1 : i; },
  frontier() {
    if (!this.state.student) return 'home';
    if (!this.state.warmup) return 'warmup';
    if (!this.completed('learning')) return 'learning';
    if (!this.completed('practice')) return 'practice';
    return 'final';
  },
  canAccess(stage) { return STAGES.indexOf(stage) <= STAGES.indexOf(this.frontier()); },

  // Khi tải lại trang: chấm lại đáp án đã lưu, hoạt động nào không còn đúng thì khóa các hoạt động sau
  verifyState() {
    const s = this.state;
    if (s.warmup && !Quiz.verify(Content.warmup.questions, s.warmup.answers)) s.warmup = null;
    let prev = !!s.warmup;
    for (const kind of ['learning', 'practice']) {
      for (const act of this.acts(kind)) {
        const r = this.rec(kind, act);
        const ok = !!r && prev && r.passed && Quiz.verify(act.questions, r.answers);
        if (r) r.passed = ok;
        prev = ok;
      }
    }
  },

  /* ---------- Thanh bên ---------- */
  progress() {
    const total = 1 + this.acts('learning').length + this.acts('practice').length + 1;
    const done = (this.state.warmup ? 1 : 0) + this.state.learning.filter(r => r.passed).length + this.state.practice.filter(r => r.passed).length + (this.state.finalSubmittedAt ? 1 : 0);
    return { done, total, pct: Math.round(done / total * 100) };
  },
  nav(stage = (location.hash.slice(1) || 'home').split('/')[0]) {
    const items = [['home', 'Tổng quan', null], ['warmup', 'Khởi động', Content.warmup.minutes], ['learning', 'Hình thành kiến thức', this.sum('learning')], ['practice', 'Luyện tập', this.sum('practice')], ['final', 'Vận dụng', Content.final.minutes]];
    const cur = Number.parseInt((location.hash.slice(1).split('/')[1]), 10);
    document.querySelector('#steps').innerHTML = items.map(([s, label, min], i) => {
      const ok = this.canAccess(s);
      let sub = '';
      if ((s === 'learning' || s === 'practice') && stage === s && ok) {
        const av = this.availableIndex(s);
        sub = `<ul class="subnav">${this.acts(s).map((a, n) => {
          const done = this.passed(s, a), reach = n <= av;
          return `<li><a href="#${s}/${n}" class="${n === cur ? 'on' : ''} ${done ? 'done' : ''} ${reach ? '' : 'locked'}" ${reach ? '' : 'tabindex="-1" aria-disabled="true"'}><i>${done ? '✓' : n + 1}</i>${Util.esc(a.name)}</a></li>`;
        }).join('')}</ul>`;
      }
      return `<div class="step"><a href="#${s}" class="${stage === s ? 'active' : ''} ${ok ? '' : 'locked'}" ${stage === s ? 'aria-current="step"' : ''}><span class="num">${i === 0 ? '⌂' : i}</span><span class="lbl">${label}${min ? `<small>~${min} phút</small>` : ''}</span></a>${sub}</div>`;
    }).join('');
    const p = this.progress();
    document.querySelector('#progress').innerHTML = `<div class="bar"><span style="width:${p.pct}%"></span></div><small>Tiến độ: ${p.done}/${p.total} hoạt động</small>`;
    document.querySelector('#student-badge').innerHTML = this.state.student
      ? `<strong>${Util.esc(this.state.student.name)}</strong><br>Lớp ${Util.esc(this.state.student.className)}<br><button id="switch-student" class="secondary small">Đổi học sinh</button>` : '';
    document.querySelector('#switch-student')?.addEventListener('click', () => {
      if (confirm('Đổi học sinh sẽ bắt đầu lượt học mới trên máy này. Em sẽ được tải một bản sao bài làm hiện tại. Tiếp tục?')) {
        Util.download('bai-11-ban-sao.json', JSON.stringify(this.state, null, 2), 'application/json');
        this.state = this.fresh(); this.save(); location.hash = 'home'; this.route();
      }
    });
  },
  sum(kind) { return this.acts(kind).reduce((n, a) => n + (a.minutes || 0), 0); },

  route() {
    let [stage, index] = location.hash.slice(1).split('/'); stage = stage || 'home';
    if (!STAGES.includes(stage) || !this.canAccess(stage)) {
      const next = this.frontier();
      if (stage !== next) Util.toast('Em hãy làm xong hoạt động hiện tại trước khi sang phần tiếp theo nhé.');
      location.hash = next; return;
    }
    this.nav(stage); window.scrollTo(0, 0);
    document.body.dataset.stage = stage;
    if (stage === 'home') this.home();
    if (stage === 'warmup') this.warmup();
    if (stage === 'learning' || stage === 'practice') {
      if (index === undefined && this.completed(stage)) { this.stageDone(stage); return; }
      const i = Math.max(0, Math.min(Number.parseInt(index, 10) || 0, this.availableIndex(stage)));
      if (String(i) !== index) history.replaceState(null, '', `#${stage}/${i}`);
      this.nav(stage); this.activity(stage, i);
    }
    if (stage === 'final') Final.render();
  },

  /* ---------- Tổng quan ---------- */
  home() {
    const s = this.state.student, c = Content;
    document.querySelector('#main').innerHTML = `<section class="hero">
  <div class="hero-text"><span class="tag">TIN HỌC 10 · BÀI 11</span>
  <h1>Công dân số: <em>ứng xử đúng</em>, tôn trọng bản quyền.</h1>
  <p>Một dòng bình luận, một đoạn clip, một phần mềm “lậu” đều có thể gây hậu quả thật. Trong một tiết học, em sẽ biết điều gì được làm, điều gì không nên làm và vì sao khi dùng mạng.</p>
  <a class="hero-link" href="#join" onclick="document.querySelector('#join').scrollIntoView({behavior:'smooth'});return false">Bắt đầu bên dưới ↓</a></div>
  <div class="hero-art"><img src="assets/img/social-phone.jpg" alt="Tay cầm điện thoại đang xem mạng xã hội"><span class="bubble b1">Đăng gì?</span><span class="bubble b2">Chia sẻ gì?</span><span class="bubble b3">© Bản quyền</span></div></section>
<div class="section-head"><h2>Bốn hoạt động trong một tiết</h2><span class="muted">Khoảng 40 phút, tự học trên máy</span></div>
<section class="journey">
  <article class="s1"><span>1 · ${c.warmup.minutes} phút</span><h3>Khởi động</h3><p>Một tình huống clip bạo lực lan truyền trên mạng. Em chọn theo suy nghĩ của mình.</p></article>
  <article class="s2"><span>2 · ${this.sum('learning')} phút</span><h3>Hình thành kiến thức</h3><p>4 phần ngắn: đạo đức và pháp luật, quy định đưa tin, quyền tác giả, bản quyền tin học.</p></article>
  <article class="s3"><span>3 · ${this.sum('practice')} phút</span><h3>Luyện tập</h3><p>Không có thẻ kiến thức. Em tự vận dụng và nộp phần 1.</p></article>
  <article class="s4"><span>4 · ${c.final.minutes} phút</span><h3>Vận dụng</h3><p>Xử lí tình huống trong nhóm chat lớp 10A và viết quy tắc ứng xử.</p></article>
</section>
<section class="panel" id="join"><h3>${s ? 'Chào mừng em quay lại' : 'Sẵn sàng chưa?'}</h3>${s
      ? `<p>${Util.esc(s.name)} · lớp ${Util.esc(s.className)}: tiến độ của em vẫn được lưu ở máy này.</p><button id="continue">Tiếp tục học →</button>`
      : `<form id="join-form" class="join"><label>Họ và tên<input name="name" required maxlength="60" autocomplete="name" placeholder="Ví dụ: Nguyễn Minh An"></label><label>Lớp<input name="className" required maxlength="15" placeholder="Ví dụ: 10A5"></label><button type="submit">Bắt đầu →</button></form>
        <p class="connection">Bài làm của em được tự lưu trên máy này. Chỉ khi em bấm “Nộp”, họ tên, lớp và câu trả lời của em mới được gửi cho giáo viên.</p>`}</section>`;
    document.querySelector('#continue')?.addEventListener('click', () => { location.hash = this.frontier(); });
    document.querySelector('#join-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target), name = fd.get('name').trim(), className = fd.get('className').trim();
      const a = Util.id(className).slice(0, 15), b = Util.id(name).slice(0, 40);
      if (!a || !b) { Util.toast('Em nhập họ tên và lớp có chữ hoặc số nhé.'); return; }
      this.state.student = { name, className }; this.state.studentId = a + '_' + b; this.save(); Api.warmUp();
      location.hash = 'warmup';
    });
  },

  /* ---------- Khởi động ---------- */
  warmup() {
    const w = Content.warmup;
    document.querySelector('#main').innerHTML = `<div class="eyebrow stage-1">KHỞI ĐỘNG · khoảng ${w.minutes} phút</div>
<header class="banner tall"><img src="${w.img}" alt="${Util.esc(w.imgAlt)}"><div><h1>${Util.esc(w.title)}</h1><p class="lead">${Util.esc(w.lead)}</p></div></header>
<section class="panel story"><span class="card-label">TÌNH HUỐNG</span>${w.story}</section>
<section class="panel qpanel"><div id="quiz"></div></section><div id="after"></div>`;
    const st = this.state.drafts[w.id] || (this.state.drafts[w.id] = Quiz.newState());
    Quiz.mount(document.querySelector('#quiz'), w.questions, st, {
      checkLabel: 'Xem gợi ý của thầy cô',
      onChange: () => this.saveSoon(),
      onAllDone: () => {
        if (!this.state.warmup) {
          this.state.warmup = { activityId: w.id, attempts: st.attempts, passed: true, startedAt: st.startedAt, completedAt: new Date().toISOString(), answers: st.answers, studentCode: Quiz.summary(w.questions, st.answers) };
          this.save(); this.nav();
        }
        document.querySelector('#after').innerHTML = `<div class="done-banner"><div><b>Cảm ơn em đã chia sẻ suy nghĩ!</b><p>${w.wrap}</p></div><button id="go-learning">Vào học kiến thức →</button></div>`;
        document.querySelector('#go-learning').onclick = () => { location.hash = 'learning/0'; };
      }
    });
  },

  /* ---------- Hình thành kiến thức và Luyện tập: mỗi hoạt động một màn hình ---------- */
  activity(kind, i) {
    const acts = this.acts(kind), a = acts[i], learning = kind === 'learning';
    const label = learning ? 'HÌNH THÀNH KIẾN THỨC' : 'LUYỆN TẬP';
    document.querySelector('#main').innerHTML = `<div class="eyebrow ${learning ? 'stage-2' : 'stage-3'}">${label} · phần ${i + 1}/${acts.length} · khoảng ${a.minutes} phút</div>
<header class="banner${a.img ? '' : ' plain'}">${a.img ? `<img src="${a.img}" alt="${Util.esc(a.imgAlt)}">` : `<div class="big-icon" aria-hidden="true">${a.icon}</div>`}<div><h1>${Util.esc(a.title)}</h1><p class="lead">${Util.esc(a.lead)}</p></div></header>
${learning ? `<section class="panel knowledge">${a.content}</section>` : ''}
<section class="panel qpanel"><h2>${learning ? 'Kiểm tra hiểu bài' : 'Em tự làm'}</h2><div id="quiz"></div></section><div id="after"></div>`;
    const st = this.state.drafts[a.id] || (this.state.drafts[a.id] = Quiz.newState());
    // Hoạt động đã đạt: khóa toàn bộ đáp án để xem lại
    if (this.passed(kind, a)) { const r = this.rec(kind, a); st.answers = r.answers; a.questions.forEach(q => { st.locked[q.id] = true; }); }
    Quiz.mount(document.querySelector('#quiz'), a.questions, st, {
      onChange: () => this.saveSoon(),
      onAllDone: () => this.complete(kind, a, i, st)
    });
  },
  complete(kind, a, i, st) {
    const old = this.rec(kind, a), now = new Date().toISOString();
    const r = { activityId: a.id, attempts: st.attempts || old?.attempts || 0, passed: true, startedAt: old?.startedAt || st.startedAt, completedAt: old?.completedAt || now, firstTry: Object.keys(st.first).length ? Quiz.firstTryCount(a.questions, st) : (old?.firstTry ?? 0), total: a.questions.length, answers: st.answers, studentCode: Quiz.summary(a.questions, st.answers) };
    if (old) Object.assign(old, r); else this.state[kind].push(r);
    this.save(); this.nav();
    const last = i === this.acts(kind).length - 1;
    document.querySelector('#after').innerHTML = `<div class="done-banner"><div><b>${Util.esc(a.success)}</b><p>${last ? 'Em đã xong hoạt động này.' : 'Em sang phần tiếp theo khi sẵn sàng.'}</p></div><button id="go-next">${last ? 'Hoàn thành →' : 'Phần tiếp theo →'}</button></div>`;
    document.querySelector('#go-next').onclick = () => { location.hash = last ? kind : `${kind}/${i + 1}`; };
    if (!old || !old.passed) document.querySelector('#after').scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  /* ---------- Trang tổng kết mỗi giai đoạn ---------- */
  stageDone(kind) {
    this.nav(kind);
    const acts = this.acts(kind), recs = this.state[kind];
    const first = recs.reduce((n, r) => n + (r.firstTry || 0), 0), total = recs.reduce((n, r) => n + (r.total || 0), 0);
    const stat = `<p class="stat">Em trả lời đúng ngay lần đầu <b>${first}/${total}</b> câu. Những câu chưa đúng ngay là cơ hội để em nhớ lâu hơn.</p>`;
    const main = document.querySelector('#main');
    main.innerHTML = kind === 'learning'
      ? `<div class="eyebrow stage-2">HOÀN THÀNH HÌNH THÀNH KIẾN THỨC</div><h1>Em đã nắm các kiến thức chính của bài.</h1>
<p class="lead">Em đã học xong: vấn đề đạo đức, pháp luật, văn hoá trên mạng; quy định pháp lí khi đưa tin; quyền tác giả; vi phạm bản quyền trong tin học.</p>${stat}
<div class="panel"><h2>Sẵn sàng luyện tập?</h2><p>Phần Luyện tập không có thẻ kiến thức. Em tự nhớ và vận dụng. Em có thể xem lại từng phần bên dưới trước khi vào làm.</p><button id="next-stage">Vào Luyện tập →</button></div>`
      : `<div class="eyebrow stage-3">LUYỆN TẬP · HOÀN THÀNH</div><h1>Em đã luyện tập xong!</h1>${stat}
<div class="panel"><span class="tag">PHẦN 1</span><h2>Nộp phần 1 cho giáo viên</h2><p>Phần 1 gồm Khởi động, Hình thành kiến thức và Luyện tập. Em nộp ngay bây giờ nhé.</p><button id="submit-part1">Nộp phần 1 cho giáo viên →</button><div id="submit-status" role="status"></div></div>
<button id="next-stage" class="secondary">Tiếp tục sang Vận dụng →</button><p class="muted">Nếu mạng lỗi, bài vẫn được lưu trên máy. Khi nộp bài Vận dụng, phần 1 sẽ được gửi bù.</p>`;
    main.insertAdjacentHTML('beforeend', `<div class="panel"><h3>Xem lại các phần đã làm</h3><div class="review-list">${acts.map((t, i) => `<a class="review-link" href="#${kind}/${i}"><b>${i + 1}</b> ${Util.esc(t.name)}</a>`).join('')}</div></div>`);
    document.querySelector('#next-stage').onclick = () => { location.hash = kind === 'learning' ? 'practice/0' : 'final'; };
    document.querySelector('#submit-part1')?.addEventListener('click', () => this.submit('part1'));
    if (kind === 'practice' && this.state.part1SubmittedAt) document.querySelector('#submit-status').textContent = 'Em đã nộp phần 1 lúc ' + new Date(this.state.part1SubmittedAt).toLocaleTimeString('vi-VN') + '. Bấm nộp lại nếu muốn gửi bản mới.';
  },

  /* ---------- Nộp bài ---------- */
  async submit(type) {
    if (this.submitting) return;
    const status = document.querySelector('#submit-status'), say = t => { if (status) status.textContent = t; };
    if (!this.completed('learning') || !this.completed('practice')) { say('Em cần hoàn thành Hình thành kiến thức và Luyện tập trước khi nộp.'); return; }
    if (type === 'final' && !Final.passed()) { say('Bài Vận dụng còn thiếu yêu cầu. Em xem danh sách bên trên.'); return; }
    this.submitting = true; say('Đang gửi bài, em chờ xác nhận từ máy chủ…');
    try {
      if (type === 'final' && !this.state.part1SubmittedAt) { await Api.send({ type: 'part1' }); this.state.part1SubmittedAt = new Date().toISOString(); this.save(); }
      await Api.send({ type });
      this.state[type === 'part1' ? 'part1SubmittedAt' : 'finalSubmittedAt'] = new Date().toISOString(); this.save(); this.nav();
      const name = type === 'part1' ? 'phần 1' : 'bài Vận dụng';
      say(`Đã gửi ${name} thành công. Giáo viên có thể xem bài của em.`); Util.toast(`Đã nộp ${name} thành công ✓`);
      if (type === 'final') document.querySelector('#submit-card').classList.add('sent');
      setTimeout(() => { this.submitting = false; }, 5000);        // chống bấm liên tục
    } catch (e) {
      this.submitting = false;
      say('Không thể gửi bài. Bài vẫn được lưu trên máy. ' + (e.code === 'permission-denied' ? 'Giáo viên cần kiểm tra Firestore Rules.' : e.message || 'Em kiểm tra kết nối rồi thử lại.'));
    }
  },

  init() {
    const saved = Store.read();
    this.state = saved && Array.isArray(saved.learning) && Array.isArray(saved.practice) ? { ...this.fresh(), ...saved } : this.fresh();
    this.state.drafts = this.state.drafts || {};
    this.state.final = Final.normalize(this.state.final);
    this.verifyState();
    window.addEventListener('hashchange', () => this.route());
    this.route();
  }
};
App.init();
