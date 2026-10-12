/* Vận dụng: hồ sơ tình huống. Phần A chấm tự động; phần B, C chỉ kiểm tra độ dài tối thiểu,
   web không chấm nội dung cá nhân (giáo viên đọc trên teacher.html). */
const Final = {
  cfg: Content.final,
  fresh() {
    return { partA: Quiz.newState(), partB: '', typing: { keyCount: 0, charsTyped: 0, pasteBlocked: 0, firstInputAt: null, lastInputAt: null } };
  },
  // Đảm bảo state cũ (từ localStorage) có đủ trường
  normalize(f) {
    const d = this.fresh(), o = { ...d, ...(f || {}) };
    o.partA = { ...d.partA, ...(o.partA || {}) };
    delete o.partC;
    o.partB = String(o.partB || '');
    o.typing = { ...d.typing, ...(o.typing || {}) };
    return o;
  },
  partAQuestion() {
    const a = this.cfg.partA;
    return { id: 'a', type: 'assign', ui: a.ui, text: a.text, groups: a.groups, items: a.items, hint: a.hint, explain: 'Chính xác! Em đã phân loại đúng cả các hành vi trong hồ sơ.' };
  },
  checks(f = App.state.final) {
    const { partB } = this.cfg;
    const a = !!f.partA.locked.a;
    const bw = Util.words(f.partB);
    return [
      { id: 'partA', ok: a, label: 'Phần A: xếp đúng tất cả hành vi vào nhóm', hint: 'Bấm “Kiểm tra phần A” và sửa các mục có viền đỏ.' },
      { id: 'partB', ok: bw >= partB.minWords, label: `Phần B: lời khuyên cho Hải (${Math.min(bw, partB.minWords)}/${partB.minWords} từ)`, hint: `Viết thêm cho đủ ${partB.minWords} từ.` },
    ];
  },
  passed(f = App.state.final) { return this.checks(f).every(c => c.ok); },

  // Dữ liệu gửi lên Firestore (khớp rules: final.code là chuỗi)
  payload() {
    const f = App.state.final, a = this.partAQuestion();
    const code = `${Quiz.summary([a], { a: f.partA.answers.a })}

PHẦN B
${f.partB}`;
    const requirements = Object.fromEntries(this.checks(f).map(c => [c.id, c.ok]));
    return {
      code, characters: code.length, requirements,
      answers: { partA: f.partA.answers.a || {}, partB: f.partB },
      partAAttempts: f.partA.attempts, typingStats: { ...f.typing }
    };
  },

  render() {
    const c = this.cfg, f = App.state.final;
    const main = document.querySelector('#main');
    main.innerHTML = `<div class="eyebrow stage-4">VẬN DỤNG · khoảng ${c.minutes} phút</div>
<header class="banner"><img src="${c.img}" alt="${Util.esc(c.imgAlt)}"><div><h1>${Util.esc(c.title)}</h1><p class="lead">Em dùng điều đã học để xử lí một tình huống thật trong nhóm chat lớp. Đây là bài làm của riêng em, hãy tự viết bằng lời của mình.</p></div></header>
<section class="panel scenario">${c.scenario}</section>
<section class="panel part"><h2>${Util.esc(c.partA.text)}</h2><div id="final-a"></div></section>
<section class="panel part"><h2>${Util.esc(c.partB.text)}</h2>
  <textarea id="final-b" rows="6" placeholder="${Util.esc(c.partB.placeholder)}" aria-label="Phần B"></textarea>
  <div class="count" id="count-b"></div></section>
<section class="panel submit-card" id="submit-card"><h2>Danh sách yêu cầu</h2><ul id="final-checks" class="checks"></ul>
  <button id="submit-final" type="button" aria-disabled="true">Nộp bài vận dụng →</button>
  <div id="submit-status" role="status"></div></section>`;

    // Phần A: dùng bộ máy câu hỏi
    Quiz.mount(document.querySelector('#final-a'), [this.partAQuestion()], f.partA, {
      checkLabel: 'Kiểm tra phần A', onChange: () => { App.save(); this.refresh(); }
    });

    const b = document.querySelector('#final-b'); b.value = f.partB;
    const track = (el, set) => {
      let before = el.value.length;
      el.addEventListener('keydown', () => { f.typing.keyCount++; });
      el.addEventListener('input', () => {
        const now = new Date().toISOString();
        f.typing.charsTyped += Math.max(0, el.value.length - before); before = el.value.length;
        f.typing.firstInputAt = f.typing.firstInputAt || now; f.typing.lastInputAt = now;
        set(el.value); App.save(); this.refresh();
      });
      // Chặn dán: em phải tự viết bằng lời của mình
      const block = e => { e.preventDefault(); f.typing.pasteBlocked++; App.save(); Util.toast('Em hãy tự viết bằng lời của mình, không dán nhé.'); };
      el.addEventListener('paste', block); el.addEventListener('drop', block);
    };
    track(b, v => { f.partB = v; });

    document.querySelector('#submit-final').onclick = () => {
      const missing = this.checks().filter(x => !x.ok);
      const status = document.querySelector('#submit-status');
      if (missing.length) { status.textContent = 'Còn thiếu: ' + missing.map(x => x.label.split(':')[0]).join(', ') + '. Xem danh sách bên trên.'; return; }
      App.submit('final');
    };
    this.refresh();
  },

  // Cập nhật danh sách yêu cầu và bộ đếm từ (không vẽ lại ô nhập)
  refresh() {
    const list = document.querySelector('#final-checks'); if (!list) return;
    const f = App.state.final, c = this.cfg, checks = this.checks();
    list.innerHTML = checks.map(x => `<li class="${x.ok ? 'ok' : ''}">${Util.esc(x.label)}</li>`).join('');
    const cb = document.querySelector('#count-b'); if (cb) cb.textContent = `${Util.words(f.partB)} từ`;
    const btn = document.querySelector('#submit-final');
    btn.setAttribute('aria-disabled', String(!this.passed()));
    const done = App.state.finalSubmittedAt;
    if (done && !App.submitting) document.querySelector('#submit-status').textContent = 'Đã nộp lúc ' + new Date(done).toLocaleTimeString('vi-VN') + '. Nếu em sửa bài, bấm nộp lại để gửi bản mới.';
  }
};
