/* Bộ máy câu hỏi dùng chung cho Khởi động, Hình thành, Luyện tập và Vận dụng.
   Một "st" (trạng thái) cho mỗi hoạt động: { answers:{qid:giá trị}, locked:{qid:true}, attempts, first:{qid:bool}, startedAt }.
   Giá trị đáp án: single = số, multi = mảng số, assign = { chỉ-số-mục: chỉ-số-nhóm }. */
const Quiz = {
  newState() { return { answers: {}, locked: {}, attempts: 0, first: {}, firstScore: {}, startedAt: new Date().toISOString() }; },

  // Em đã trả lời đủ chưa (chưa xét đúng sai)
  answered(q, v) {
    if (q.type === 'single') return Number.isInteger(v);
    if (q.type === 'multi') return Array.isArray(v) && v.length > 0;
    if (q.type === 'assign') return !!v && q.items.every((_, i) => Number.isInteger(v[i]));
    return false;
  },
  // Điểm của một câu: 0..1 (câu xếp nhóm tính theo tỉ lệ mục đúng)
  scoreOf(q, v) {
    if (!this.answered(q, v)) return 0;
    if (q.type === 'assign') return (q.items.length - this.wrongItems(q, v).length) / q.items.length;
    return this.correct(q, v) ? 1 : 0;
  },
  // Đáp án đúng dạng chữ (chỉ dùng sau khi học sinh đã nộp, để sửa hiểu nhầm)
  answerText(q, v) {
    if (q.type === 'single') return q.options[q.answer];
    if (q.type === 'multi') return q.answer.map(i => q.options[i]).join('; ');
    return this.wrongItems(q, v).map(i => `“${q.items[i].t}” → ${q.groups[q.items[i].g]}`).join(' | ');
  },
  wrongItems(q, v) { return q.items.map((it, i) => (v?.[i] === it.g ? -1 : i)).filter(i => i >= 0); },
  correct(q, v) {
    if (!this.answered(q, v)) return false;
    if (q.soft) return true;
    if (q.type === 'single') return v === q.answer;
    if (q.type === 'multi') return v.length === q.answer.length && q.answer.every(a => v.includes(a));
    return this.wrongItems(q, v).length === 0;
  },
  // Chấm lại toàn bộ đáp án đã lưu (chống sửa localStorage)
  // once = hoạt động chỉ làm một lần: chỉ cần đã trả lời đủ, không cần đúng hết
  verify(questions, answers, once = false) { return questions.every(q => once ? this.answered(q, answers?.[q.id]) : this.correct(q, answers?.[q.id])); },
  total(questions, answers) { return questions.reduce((n, q) => n + this.scoreOf(q, answers?.[q.id]), 0); },
  allLocked(questions, st) { return questions.every(q => st.locked[q.id]); },
  firstTryCount(questions, st) { return questions.filter(q => st.first[q.id]).length; },

  // Tóm tắt dạng chữ để giáo viên đọc
  summary(questions, answers) {
    return questions.map((q, n) => {
      const v = answers?.[q.id]; let a = '(chưa trả lời)';
      if (q.type === 'single' && Number.isInteger(v)) a = q.options[v];
      if (q.type === 'multi' && Array.isArray(v)) a = v.map(i => q.options[i]).join(' | ');
      if (q.type === 'assign' && v) a = q.items.map((it, i) => `${it.t} → ${q.groups[v[i]] ?? '?'}`).join('\n      ');
      return `${n + 1}. ${q.text}\n   → ${a}`;
    }).join('\n');
  },

  /* ---------- Hiển thị ---------- */
  qHTML(q, n, st, bad, o = {}) {
    const locked = !!st.locked[q.id], v = st.answers[q.id], dis = locked ? 'disabled' : '';
    const frac = locked && o.once ? this.scoreOf(q, v) : null;
    const letters = 'ABCDEFGH';
    let body = '';
    if (q.type === 'single' || q.type === 'multi') {
      body = `<div class="opts ${q.type}">` + q.options.map((o, i) => {
        const on = q.type === 'single' ? v === i : Array.isArray(v) && v.includes(i);
        return `<button type="button" class="opt${on ? ' on' : ''}" data-q="${q.id}" data-i="${i}" aria-pressed="${on}" ${dis}><span class="mark">${q.type === 'single' ? letters[i] : ''}</span><span>${Util.esc(o)}</span></button>`;
      }).join('') + '</div>';
    } else {
      const select = q.ui === 'select';
      body = `<div class="assign">` + q.items.map((it, i) => {
        const cur = v?.[i], isBad = Array.isArray(bad) && bad.includes(i);
        const ctl = select
          ? `<select data-q="${q.id}" data-item="${i}" ${dis} aria-label="Chọn cho: ${Util.esc(it.t)}"><option value="">Chọn…</option>${q.groups.map((g, gi) => `<option value="${gi}"${cur === gi ? ' selected' : ''}>${Util.esc(g)}</option>`).join('')}</select>`
          : `<div class="chips" role="group">${q.groups.map((g, gi) => `<button type="button" class="chip g${gi}${cur === gi ? ' on' : ''}" data-q="${q.id}" data-item="${i}" data-g="${gi}" aria-pressed="${cur === gi}" ${dis}>${Util.esc(g)}</button>`).join('')}</div>`;
        return `<div class="arow${isBad ? ' wrong' : ''}${locked && !o.once ? ' right' : ''}"><div class="at">${Util.esc(it.t)}</div>${ctl}</div>`;
      }).join('') + '</div>';
    }
    let msg = '';
    if (frac !== null) {
      const part = q.type === 'assign' && frac < 1 ? `Đúng ${q.items.length - this.wrongItems(q, v).length}/${q.items.length} mục. ` : '';
      msg = frac === 1 ? `<div class="q-msg good" role="status">✓ ${Util.esc(q.explain)}</div>`
        : o.reveal
          ? `<div class="q-msg bad" role="status">✗ Chưa đúng. ${part}<b>Đáp án đúng:</b> ${Util.esc(this.answerText(q, v))}.<br>${Util.esc(String(q.explain || '').replace(/^Chính xác!\s*/, ''))}</div>`
          : `<div class="q-msg bad" role="status">✗ Chưa đúng. ${part}${Util.esc(q.hint)}</div>`;
    } else if (locked) msg = `<div class="q-msg good" role="status">✓ ${Util.esc(q.soft ? q.reveal : q.explain)}</div>`;
    else if (bad) msg = `<div class="q-msg bad" role="status">💡 ${Util.esc(q.hint)}</div>`;
    return `<article class="q${frac !== null ? (frac === 1 ? ' ok' : ' no') : locked ? ' ok' : ''}${!locked && bad ? ' no' : ''}" data-qid="${q.id}"><div class="q-head"><span class="q-num">${n + 1}</span><p class="q-text">${Util.esc(q.text)}</p></div>${body}${msg}</article>`;
  },

  /* mount: vẽ câu hỏi vào root, gắn sự kiện.
     opts = { onChange(st), onAllDone(), checkLabel, soft } */
  mount(root, questions, st, opts = {}) {
    const bad = {};                                         // câu nào vừa kiểm tra sai (không lưu)
    // Chỉ giữ khóa của câu thật sự đúng
    st.firstScore = st.firstScore || {};
    if (!opts.once) questions.forEach(q => { if (st.locked[q.id] && !this.correct(q, st.answers[q.id])) delete st.locked[q.id]; });
    root.innerHTML = `<div class="qs">${questions.map((q, n) => this.qHTML(q, n, st, bad[q.id], opts)).join('')}</div>
      <div class="q-actions"><button type="button" class="check">${opts.checkLabel || 'Kiểm tra đáp án'}</button><span class="q-status" role="status"></span></div>`;
    const btn = root.querySelector('.check'), status = root.querySelector('.q-status');
    const redraw = q => {
      const el = root.querySelector(`[data-qid="${q.id}"]`);
      el.outerHTML = this.qHTML(q, questions.indexOf(q), st, bad[q.id], opts);
    };
    const refresh = () => {
      const open = questions.filter(q => !st.locked[q.id]);
      const missing = open.filter(q => !this.answered(q, st.answers[q.id])).length;
      btn.hidden = open.length === 0;
      btn.setAttribute('aria-disabled', String(missing > 0));
      status.textContent = open.length === 0 ? '' : missing > 0 ? `Còn ${missing} câu chưa trả lời xong` : 'Em có thể bấm kiểm tra';
    };
    // Vẽ lại câu hỏi nhưng giữ vị trí con trỏ bàn phím
    const changed = (q, from) => {
      const sel = from ? ['q', 'i', 'item', 'g'].filter(k => from.dataset[k] !== undefined).map(k => `[data-${k}="${from.dataset[k]}"]`).join('') : '';
      delete bad[q.id]; redraw(q); refresh(); opts.onChange?.(st);
      if (sel) root.querySelector(`${from.tagName.toLowerCase()}${sel}`)?.focus();
    };
    const find = id => questions.find(q => q.id === id);

    root.onclick = e => {
      const opt = e.target.closest('.opt'), chip = e.target.closest('.chip');
      if (opt && !opt.disabled) {
        const q = find(opt.dataset.q), i = Number(opt.dataset.i);
        if (q.type === 'single') st.answers[q.id] = i;
        else { const cur = new Set(st.answers[q.id] || []); cur.has(i) ? cur.delete(i) : cur.add(i); st.answers[q.id] = [...cur].sort((a, b) => a - b); }
        changed(q, opt);
      } else if (chip && !chip.disabled) {
        const q = find(chip.dataset.q);
        st.answers[q.id] = { ...(st.answers[q.id] || {}), [chip.dataset.item]: Number(chip.dataset.g) };
        changed(q, chip);
      }
    };
    root.onchange = e => {
      const sel = e.target.closest('select'); if (!sel) return;
      const q = find(sel.dataset.q), cur = { ...(st.answers[q.id] || {}) };
      if (sel.value === '') delete cur[sel.dataset.item]; else cur[sel.dataset.item] = Number(sel.value);
      st.answers[q.id] = cur; changed(q, sel);
    };
    btn.onclick = () => {
      const open = questions.filter(q => !st.locked[q.id]);
      if (open.some(q => !this.answered(q, st.answers[q.id]))) { Util.toast('Em trả lời hết các câu trước khi kiểm tra nhé.'); return; }
      if (opts.once && !confirm('Sau khi kiểm tra, em KHÔNG sửa được đáp án nữa. Em chắc chắn muốn kiểm tra?')) return;
      st.attempts++;
      open.forEach(q => {
        if (opts.once) { st.first[q.id] = this.correct(q, st.answers[q.id]); st.firstScore[q.id] = this.scoreOf(q, st.answers[q.id]); st.locked[q.id] = true; redraw(q); return; }
        const ok = this.correct(q, st.answers[q.id]);
        if (st.first[q.id] === undefined) { st.first[q.id] = ok; st.firstScore[q.id] = this.scoreOf(q, st.answers[q.id]); }
        if (ok) { st.locked[q.id] = true; delete bad[q.id]; }
        else bad[q.id] = q.type === 'assign' ? this.wrongItems(q, st.answers[q.id]) : true;
        redraw(q);
      });
      refresh(); opts.onChange?.(st);
      const firstBad = opts.once ? null : root.querySelector('.q.no');
      if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (this.allLocked(questions, st)) opts.onAllDone?.();
    };
    refresh();
    if (this.allLocked(questions, st)) opts.onAllDone?.();
  }
};
