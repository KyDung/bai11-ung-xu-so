# Công dân số — Tin học 10, Bài 11: Ứng xử trên môi trường số. Nghĩa vụ tôn trọng bản quyền

Web học tương tác cho một tiết học, HTML/CSS/JavaScript thuần, không cần npm hay build.
Dùng chung Firebase project `db-web-dayhoc` và tài khoản giáo viên với các bài khác.

- Học sinh: `index.html`
- Giáo viên: `teacher.html` (gõ tên đăng nhập, ví dụ `dung`, tự thêm `@linklab.edu.vn`)
- Mã bài (`LESSON.id`): `tin10-bai11-ung-xu-so`
- Nơi lưu: `lessons/tin10-bai11-ung-xu-so/students/<lop_hoten-khong-dau>`

## Chạy thử

Dùng Live Server với `index.html`, hoặc `python -m http.server 8080` rồi mở http://localhost:8080. Không mở bằng `file://` vì Firebase cần địa chỉ http(s).

## Bốn hoạt động (Công văn 5512), khoảng 40 phút

1. **Khởi động** (5 phút): tình huống clip bạo lực học đường lan truyền trên mạng (Hoạt động 1 SGK). 3 câu hỏi mở, chưa chấm đúng sai, mỗi câu hiện gợi ý của giáo viên sau khi trả lời.
2. **Hình thành kiến thức** (4 phần, ~15 phút): thẻ kiến thức ngắn + câu hỏi kiểm tra. Phải đúng hết mới sang phần sau.
   - Đạo đức, pháp luật, văn hoá khi giao tiếp qua mạng
   - Quy định pháp lí khi đưa tin lên mạng
   - Quyền tác giả (quyền nhân thân, quyền tài sản)
   - Vi phạm và tôn trọng bản quyền trong tin học
3. **Luyện tập** (3 phần, ~11 phút): không có thẻ kiến thức; dùng các câu Luyện tập và Vận dụng của SGK. Cuối phần có nút **Nộp phần 1**.
4. **Vận dụng** (~10 phút): hồ sơ tình huống nhóm chat lớp 10A. Phần A xếp hành vi (chấm tự động), phần B lời khuyên cho bạn Hải (≥ 25 từ), phần C ba quy tắc ứng xử của lớp. Có danh sách yêu cầu trực tiếp, chặn dán, nộp riêng. Phần B, C chỉ kiểm tra độ dài, giáo viên đọc trên `teacher.html`.

Mỗi phần chỉ kiểm tra một lần, bấm Kiểm tra là khóa (xem mục Cách tính điểm). Điểm từng phần được gửi cho giáo viên.

## Cách tính điểm phần 1

- Khởi động: 3 câu, chấm đúng sai, khóa sau khi kiểm tra, chỉ ghi nhận (không cộng vào điểm phần 1).
- Hình thành kiến thức (14 câu): mỗi phần làm **một lần**, bấm Kiểm tra là khóa; câu sai hiện đáp án đúng và giải thích để sửa hiểu nhầm.
- Luyện tập (9 câu): làm một lần, bấm Kiểm tra là khóa; câu sai chỉ hiện gợi ý, không lộ đáp án.
- Điểm phần 1 = (điểm Hình thành + điểm Luyện tập) ÷ 23 × 10, mỗi câu 1 điểm, câu xếp nhóm tính theo tỉ lệ mục đúng. Phải **trên 7** mới được nộp phần 1 và sang Vận dụng; không đạt thì làm lại Hình thành + Luyện tập (hằng `PASS_SCORE` trong `js/app.js`).
- Vận dụng: không tính điểm; phần A tự chấm, phần B, C giáo viên đọc.

## Sửa nội dung

Toàn bộ nội dung nằm trong `js/content.js` (thẻ kiến thức, câu hỏi, đáp án, gợi ý, đề Vận dụng). Ba kiểu câu hỏi: `single`, `multi`, `assign` (xếp mục vào nhóm). Bộ máy câu hỏi ở `js/quiz.js`, điều hướng và nộp bài ở `js/app.js`, bài Vận dụng ở `js/final.js`.

## Firebase

`js/firebase-config.js` và `firestore.rules` dùng chung với các bài khác (Rules đã publish một lần, bài này không thêm trường mới). Dữ liệu gửi lên đúng cấu trúc `learning[]`, `practice[]`, `progress`, `final`. Giáo viên đăng nhập bằng email/mật khẩu có UID trong collection `teachers`, hoặc Google email quản trị. Khi đưa lên GitHub Pages cần thêm domain vào Authentication → Settings → Authorized domains.

## Ảnh và bản quyền ảnh

Ảnh trong `assets/img` lấy từ [Unsplash](https://unsplash.com) (giấy phép Unsplash cho phép dùng miễn phí). Font Be Vietnam Pro lưu cục bộ (SIL OFL, `assets/fonts/OFL.txt`). Chỉ Firebase cần mạng.

## Lưu ý đáp án

Câu “Phá khoá phần mềm chỉ để thử, không dùng” (Luyện tập 3, câu 1) được xem là **vi phạm** vì Nghị định 131/2013 xử phạt hành vi cố ý vô hiệu hoá biện pháp kĩ thuật bảo vệ quyền tác giả. Nếu đáp án sách giáo viên của thầy/cô khác, sửa `answer` trong `js/content.js`.
