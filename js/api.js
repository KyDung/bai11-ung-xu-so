/* Gửi bài lên Firestore: lessons/{LESSON.id}/students/{lớp_họtên}. SDK nạp lười từ gstatic.
   Dữ liệu khớp firestore.rules dùng chung (learning[], practice[], progress, final). */
const Api = {
  promise: null,
  sdk() {
    if (!this.promise) {
      this.promise = (async () => {
        const base = 'https://www.gstatic.com/firebasejs/11.10.0/';
        const [app, fs, auth] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-firestore.js'), import(base + 'firebase-auth.js')]);
        const instance = app.getApps().length ? app.getApp() : app.initializeApp(FIREBASE_CONFIG);
        return { fs, auth, db: fs.getFirestore(instance), login: auth.getAuth(instance) };
      })().catch(e => { this.promise = null; throw e; });
    }
    return this.promise;
  },
  warmUp() { this.sdk().catch(() => {}); },

  async send(payload) {
    let timer;
    try {
      return await Promise.race([
        this.write(payload),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Quá 20 giây chưa nhận được xác nhận từ máy chủ. Bài vẫn được giữ trên máy; em có thể thử gửi lại.')), 20000); })
      ]);
    } finally { clearTimeout(timer); }
  },

  async write(payload) {
    const { fs, db } = await this.sdk();
    const s = App.state, now = new Date().toISOString();
    const isPart1 = payload.type === 'part1', isFinal = payload.type === 'final';
    const data = {
      lessonId: LESSON.id,
      student: s.student,
      learning: [...(s.warmup ? [s.warmup] : []), ...s.learning],
      practice: s.practice,
      progress: {
        practiceScore: App.practiceScore(),
        practiceTries: s.practiceTries || 1,
        learningCompleted: App.completed('learning'),
        practiceCompleted: App.completed('practice'),
        part1Submitted: !!s.part1SubmittedAt || isPart1,
        part1SubmittedAt: s.part1SubmittedAt || (isPart1 ? now : null),
        finalSubmitted: isFinal || !!s.finalSubmittedAt,
        finalSubmittedAt: isFinal ? now : s.finalSubmittedAt || null
      },
      updatedAt: fs.serverTimestamp()
    };
    if (isFinal) data.final = { ...Final.payload(), submittedAt: now };
    const batch = fs.writeBatch(db);
    batch.set(fs.doc(db, 'lessons', LESSON.id), { title: LESSON.title.slice(0, 100), updatedAt: fs.serverTimestamp() }, { merge: true });
    batch.set(fs.doc(db, 'lessons', LESSON.id, 'students', s.studentId), data, { merge: true });
    await batch.commit();
    return true;
  }
};
