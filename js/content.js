/* Toàn bộ nội dung bài học (đổi file này khi làm bài mới).
   Kiểu câu hỏi:
   - single: chọn 1 đáp án            { options, answer: số }
   - multi : chọn nhiều đáp án        { options, answer: [số...] }
   - assign: xếp từng mục vào một nhóm { groups, items: [{t, g: số}], ui: 'chips' | 'select' }
   soft:true  = câu khởi động, không chấm đúng/sai, chỉ cần trả lời rồi hiện `reveal`. */

const Content = {};

/* ---------------- 1. KHỞI ĐỘNG ---------------- */
Content.warmup = {
  id: 'warmup',
  name: 'Khởi động',
  minutes: 5,
  img: 'assets/img/sad-phone.jpg',
  imgAlt: 'Một học sinh buồn bã ôm mặt, tay cầm điện thoại',
  title: 'Một đoạn clip lan truyền trên mạng',
  lead: 'Em đọc tình huống rồi chọn theo suy nghĩ của mình. Ở bước này chưa có đúng hay sai, chỉ cần em trả lời thật.',
  story: `<p>Do mâu thuẫn ở một diễn đàn trên mạng, một nhóm nữ sinh đánh một bạn nữ khác. Các bạn ở xung quanh <strong>không can ngăn</strong> mà còn <strong>quay phim rồi đưa lên mạng xã hội</strong>.</p>
<p>Có rất nhiều <strong>bình luận thiếu thiện ý</strong> dưới đoạn clip. Quá xấu hổ với bạn bè, nạn nhân đã <strong>bỏ nhà ra đi</strong>, không để lại lời nhắn.</p>`,
  questions: [
    {
      id: 'w1', type: 'multi', soft: true,
      text: 'Theo em, những hành vi nào trong tình huống trên là chưa đúng? (chọn nhiều đáp án)',
      options: ['Nhóm nữ sinh đánh bạn', 'Các bạn xung quanh đứng xem, không can ngăn', 'Quay phim rồi đưa clip lên mạng xã hội', 'Viết bình luận thiếu thiện ý dưới clip', 'Nạn nhân buồn bã và bỏ nhà ra đi'],
      reveal: 'Bốn hành vi đầu đều không đúng. Nạn nhân buồn và bỏ đi là hậu quả mà bạn ấy phải chịu, không phải lỗi của bạn ấy. Có hành vi chỉ vi phạm đạo đức, có hành vi đã vi phạm pháp luật. Hôm nay em sẽ biết cách phân biệt.'
    },
    {
      id: 'w2', type: 'multi', soft: true,
      text: 'Vì sao một clip đưa lên mạng thường gây hậu quả nặng nề hơn so với chuyện xảy ra ngoài đời? (chọn nhiều đáp án)',
      options: ['Clip được chia sẻ rất nhanh, đến rất nhiều người', 'Người bình luận có thể giấu tên thật', 'Clip được lưu lại, lúc nào cũng có thể xem lại', 'Vì mạng Internet có tốc độ cao nên clip rõ nét hơn'],
      reveal: 'Ba lý do đầu là đặc điểm của không gian mạng: lan nhanh và rộng, có thể ẩn danh, lưu trữ lâu dài. Tốc độ đường truyền không phải là nguyên nhân.'
    },
    {
      id: 'w3', type: 'single', soft: true,
      text: 'Nếu em nhận được đoạn clip này, em sẽ làm gì?',
      options: ['Chia sẻ tiếp để mọi người cùng biết', 'Bình luận chê trách các bạn trong clip', 'Không chia sẻ, báo cáo nội dung và nói với thầy cô hoặc người lớn', 'Xem xong rồi bỏ qua'],
      reveal: 'Lựa chọn nên làm là không chia sẻ, báo cáo nội dung xấu và báo cho thầy cô hoặc người lớn đáng tin cậy. Chia sẻ hay bình luận thiếu thiện ý đều làm nạn nhân tổn thương thêm.'
    }
  ],
  wrap: 'Hôm nay em sẽ: <b>nêu được</b> các vấn đề đạo đức, pháp luật, văn hoá khi giao tiếp qua mạng và <b>giải thích được</b> các quy định pháp lí về đưa tin, tôn trọng bản quyền.'
};

/* ---------------- 2. HÌNH THÀNH KIẾN THỨC ---------------- */
Content.learning = [
  /* ---- 1. Vấn đề đạo đức, pháp luật, văn hoá ---- */
  {
    id: 'learn-van-de', name: 'Đạo đức, pháp luật, văn hoá', icon: '🧭', minutes: 4,
    title: 'Những vấn đề đạo đức, pháp luật và văn hoá khi giao tiếp qua mạng',
    img: 'assets/img/anonymous.jpg', imgAlt: 'Mặt nạ trắng tượng trưng cho việc ẩn danh trên mạng',
    lead: 'Em đọc ba thẻ kiến thức bên dưới, sau đó trả lời 3 câu hỏi.',
    content: `
<div class="duo">
  <div class="def law"><b>⚖️ Pháp luật</b><p>Quy định rõ hành vi nào là <em>vi phạm pháp luật</em>. Nhà nước sẽ <em>cưỡng chế</em> người vi phạm.</p></div>
  <div class="def moral"><b>🤝 Đạo đức</b><p>Hệ thống quy tắc, chuẩn mực xã hội mà con người <em>tự giác</em> thực hiện vì lợi ích của cộng đồng. Được điều chỉnh bằng dư luận xã hội và giáo dục.</p></div>
</div>
<h3 class="sub">Bảy loại hành vi xấu thường gặp khi giao tiếp trên mạng</h3>
<ol class="facts">
  <li><b>Đưa tin không phù hợp lên mạng</b> (đăng và chia sẻ). Tuỳ nội dung và hậu quả mà vi phạm pháp luật hay đạo đức.</li>
  <li><b>Công bố thông tin cá nhân hoặc tổ chức</b> khi chưa được phép, ảnh hưởng đến uy tín, danh dự: <em>vi phạm pháp luật</em>.</li>
  <li><b>Gửi thư rác, tin nhắn rác</b>: quảng cáo người nhận không muốn nhận. Đã bị từ chối mà vẫn gửi nhiều là hành vi <em>quấy nhiễu</em>.</li>
  <li><b>Vi phạm bản quyền</b> khi sử dụng dữ liệu và phần mềm.</li>
  <li><b>Bắt nạt qua mạng</b> (đã học ở Bài 9).</li>
  <li><b>Lừa đảo qua mạng</b>: rất tinh vi, có thể gây thiệt hại lớn.</li>
  <li><b>Ứng xử thiếu văn hoá</b>: tranh luận không tôn trọng người đối thoại, chửi tục, công kích, sỉ nhục.</li>
</ol>
<h3 class="sub">Vì sao hành vi xấu trên mạng thường nghiêm trọng hơn?</h3>
<div class="quad">
  <div><span>🎭</span><b>Có thể ẩn danh</b><p>Kẻ xấu mạnh bạo hơn, khó kiểm soát hơn.</p></div>
  <div><span>⚡</span><b>Lan nhanh, lan rộng</b><p>Tin đưa lên mạng đến rất nhiều người trong chốc lát.</p></div>
  <div><span>🌐</span><b>Mọi lúc, mọi nơi</b><p>Chỉ cần có kết nối Internet là gặp được nhau.</p></div>
  <div><span>🗄️</span><b>Lưu trữ lâu dài</b><p>Tin bài đã lưu thì lúc nào cũng xem lại được.</p></div>
</div>
<div class="callout"><b>Quay lại tình huống mở đầu.</b> Đánh bạn ít nhất là vi phạm đạo đức. Nếu người đánh đủ 16 tuổi và gây thương tích nặng thì bị xử lí hình sự. Quay clip đưa lên mạng là gián tiếp cổ vũ bạo lực học đường: vi phạm đạo đức.</div>`,
    questions: [
      {
        id: 'q1', type: 'assign', ui: 'select',
        text: 'Mỗi tình huống dưới đây là loại hành vi xấu nào khi giao tiếp trên mạng?',
        groups: ['Công bố thông tin cá nhân khi chưa được phép', 'Gửi thư rác, tin nhắn rác', 'Lừa đảo qua mạng', 'Ứng xử thiếu văn hoá', 'Bắt nạt qua mạng'],
        items: [
          { t: 'Đăng ảnh và số điện thoại của một bạn lên nhóm chat mà chưa hỏi ý kiến bạn ấy', g: 0 },
          { t: 'Cửa hàng liên tục nhắn quảng cáo cho người đã nhiều lần nói không muốn nhận', g: 1 },
          { t: 'Nhắn tin giả làm người thân đang gặp nạn, nhờ chuyển tiền gấp', g: 2 },
          { t: 'Tranh luận trên diễn đàn bằng cách chửi tục và sỉ nhục người đối thoại', g: 3 },
          { t: 'Lập nhóm chat để chế giễu và cô lập một bạn trong lớp', g: 4 }
        ],
        hint: 'Những mục có viền đỏ chưa đúng. Em đọc lại bảy loại hành vi ở trên và so sánh với từng tình huống.',
        explain: 'Chính xác! Nhận ra đúng loại hành vi là bước đầu để tránh vi phạm và biết cách phản ứng.'
      },
      {
        id: 'q2', type: 'multi',
        text: 'Những đặc điểm nào của không gian mạng làm hậu quả của một hành vi xấu trở nên nghiêm trọng hơn? (chọn nhiều đáp án)',
        options: ['Người dùng có thể giao tiếp ẩn danh', 'Người dùng chỉ giao tiếp trực tiếp, mặt đối mặt', 'Tin bài đưa lên được phát tán nhanh và rộng', 'Tin bài được lưu trữ lâu dài, lúc nào cũng xem lại được'],
        answer: [0, 2, 3],
        hint: 'Chưa đúng hoàn toàn. Em xem lại bốn ô “Vì sao hành vi xấu trên mạng thường nghiêm trọng hơn?”. Có đáp án chọn thừa hoặc còn thiếu.',
        explain: 'Chính xác! Ẩn danh, lan nhanh và rộng, lưu trữ lâu dài làm cho hành vi xấu trên mạng khó kiểm soát hơn.'
      },
      {
        id: 'q3', type: 'single',
        text: 'Một bạn quay clip cảnh bạn khác bị đánh rồi đăng lên mạng xã hội. Việc đăng clip đó ít nhất là:',
        options: ['Không vi phạm điều gì vì chỉ là đăng lại sự thật', 'Vi phạm đạo đức vì gián tiếp cổ vũ bạo lực học đường', 'Chắc chắn là tội hình sự'],
        answer: 1,
        hint: 'Chưa đúng. Em xem lại thẻ “Quay lại tình huống mở đầu” ở cuối phần kiến thức.',
        explain: 'Chính xác! Việc đưa clip bạo lực lên mạng ít nhất là vi phạm đạo đức.'
      }
    ],
    success: 'Tuyệt vời! Em đã nhận ra các vấn đề đạo đức, pháp luật và văn hoá khi giao tiếp trên mạng.'
  },

  /* ---- 2. Quy định pháp lí khi đưa tin ---- */
  {
    id: 'learn-dua-tin', name: 'Quy định pháp lí khi đưa tin', icon: '⚖️', minutes: 4,
    title: 'Một số quy định pháp lí đối với người dùng trên mạng',
    img: 'assets/img/fake-news.jpg', imgAlt: 'Con dấu “fake news” đóng lên tờ giấy',
    lead: 'Một trách nhiệm quan trọng nhất của người đưa tin lên Internet là đảm bảo thông tin đúng đắn.',
    content: `
<h3 class="sub">Các văn bản pháp lí cần nhớ</h3>
<div class="laws">
  <div><b>Luật Giao dịch điện tử</b><span>2005</span></div>
  <div><b>Luật Công nghệ thông tin</b><span>2006</span></div>
  <div><b>Bộ luật Hình sự</b><span>2017</span></div>
  <div><b>Luật An ninh mạng</b><span>2018</span></div>
  <div class="nd"><b>Nghị định 90/2008/NĐ-CP</b><span>chống thư rác</span></div>
  <div class="nd"><b>Nghị định 72/2013/NĐ-CP</b><span>quản lí, cung cấp, sử dụng dịch vụ Internet</span></div>
  <div class="nd"><b>Nghị định 15/2020/NĐ-CP</b><span>xử phạt vi phạm hành chính trong lĩnh vực bưu chính, viễn thông, CNTT, giao dịch điện tử</span></div>
  <div class="qd"><b>Quyết định 874/QĐ-BTTTT</b><span>6/2021: Bộ quy tắc ứng xử trên mạng xã hội</span></div>
</div>
<h3 class="sub">Cấm đưa lên mạng những thông tin nào?</h3>
<p class="small">Theo Điều 12 Luật CNTT, Điều 8 Luật An ninh mạng và Điều 101 Nghị định 15/2020, những nội dung sau là <em>vi phạm</em>, kể cả khi em chỉ <em>chia sẻ lại</em>:</p>
<ul class="chips-list">
  <li>Thông tin giả mạo, sai sự thật, xuyên tạc, vu khống, xúc phạm uy tín, danh dự</li>
  <li>Thông tin bịa đặt gây hoang mang trong nhân dân</li>
  <li>Kích động bạo lực, tội ác, tệ nạn xã hội, đánh bạc</li>
  <li>Cổ suý hủ tục, mê tín dị đoan, dâm ô, đồi truỵ</li>
  <li>Miêu tả tỉ mỉ hành động chém giết, tai nạn, kinh dị</li>
  <li>Chia sẻ tác phẩm báo chí, văn học, nghệ thuật khi chưa được chủ sở hữu đồng ý</li>
  <li>Quảng cáo hàng hoá, dịch vụ bị cấm; chia sẻ đường dẫn đến nội dung bị cấm</li>
  <li>Hình ảnh bản đồ Việt Nam không thể hiện hoặc thể hiện sai chủ quyền quốc gia</li>
  <li>Tiết lộ bí mật nhà nước, quân sự, an ninh, kinh tế, đối ngoại</li>
</ul>
<h3 class="sub">Nguyên tắc an toàn khi chia sẻ thông tin</h3>
<ol class="facts">
  <li>Trước khi đăng, <b>kiểm tra</b> tin có vi phạm pháp luật không và có chính xác không.</li>
  <li><b>Không chia sẻ</b> tin vi phạm pháp luật. Chia sẻ tin giả là tiếp tay cho hành vi tung tin giả.</li>
  <li>Tin không phạm luật vẫn phải cân nhắc <b>hậu quả về đạo đức</b>: tin vô hại với người này có thể là tai hoạ với người khác.</li>
  <li>Quyết định 874 khuyến khích dùng tên thật, chia sẻ thông tin tích cực, tấm gương người tốt việc tốt, quảng bá hình ảnh đất nước và văn hoá Việt Nam.</li>
</ol>`,
    questions: [
      {
        id: 'q1', type: 'assign', ui: 'select',
        text: 'Ghép mỗi nội dung với văn bản pháp lí tương ứng.',
        groups: ['Nghị định 90/2008/NĐ-CP', 'Nghị định 15/2020/NĐ-CP', 'Luật An ninh mạng 2018', 'Quyết định 874/QĐ-BTTTT (2021)'],
        items: [
          { t: 'Quy định về chống thư rác', g: 0 },
          { t: 'Quy định xử phạt vi phạm hành chính trong lĩnh vực bưu chính, viễn thông, CNTT và giao dịch điện tử', g: 1 },
          { t: 'Cấm dùng không gian mạng để đăng thông tin sai sự thật gây hoang mang trong nhân dân', g: 2 },
          { t: 'Bộ quy tắc ứng xử trên mạng xã hội của Bộ Thông tin và Truyền thông', g: 3 }
        ],
        hint: 'Những mục có viền đỏ chưa đúng. Em xem lại bảng “Các văn bản pháp lí cần nhớ”.',
        explain: 'Chính xác! Luật quy định chung, nghị định cụ thể hoá luật, còn bộ quy tắc ứng xử là khuyến cáo cho người dùng mạng xã hội.'
      },
      {
        id: 'q2', type: 'assign', ui: 'chips',
        text: 'Mỗi hành vi dưới đây là vi phạm quy định hay được khuyến khích?',
        groups: ['Vi phạm quy định', 'Được khuyến khích'],
        items: [
          { t: 'Chia sẻ lại một bản tin bịa đặt về dịch bệnh làm nhiều người hoang mang', g: 0 },
          { t: 'Chia sẻ những tấm gương người tốt, việc tốt', g: 1 },
          { t: 'Đăng lại bài báo của người khác khi chưa được chủ sở hữu đồng ý', g: 0 },
          { t: 'Đăng ảnh bản đồ Việt Nam không thể hiện đúng chủ quyền quốc gia', g: 0 },
          { t: 'Kiểm tra nguồn tin trước khi chia sẻ', g: 1 }
        ],
        hint: 'Những mục có viền đỏ chưa đúng. Em đọc lại danh sách “Cấm đưa lên mạng những thông tin nào?”.',
        explain: 'Chính xác! Chia sẻ lại tin vi phạm cũng là vi phạm.'
      },
      {
        id: 'q3', type: 'single',
        text: 'Một người chia sẻ lại tin sai sự thật về dịch bệnh do người khác bịa ra. Người này:',
        options: ['Không vi phạm vì chỉ chia sẻ lại, không phải người bịa tin', 'Vi phạm vì chia sẻ thông tin sai sự thật cũng bị xử phạt', 'Chỉ vi phạm nếu đã thu được tiền từ việc chia sẻ'],
        answer: 1,
        hint: 'Chưa đúng. Em xem lại nguyên tắc thứ hai: không chia sẻ tin vi phạm pháp luật.',
        explain: 'Chính xác! Việc chia sẻ một tin vi phạm luật cũng là vi phạm luật.'
      }
    ],
    success: 'Rất tốt! Em đã nắm các quy định về đưa tin lên mạng.'
  },

  /* ---- 3. Quyền tác giả ---- */
  {
    id: 'learn-quyen-tac-gia', name: 'Quyền tác giả', icon: '©️', minutes: 3,
    title: 'Quyền tác giả và bản quyền',
    img: 'assets/img/gavel.jpg', imgAlt: 'Chiếc búa của thẩm phán đặt trên lá cờ',
    lead: 'Tác phẩm có thể là bài thơ, bài báo, bức tranh, hình vẽ, chương trình máy tính, sưu tập dữ liệu…',
    content: `
<div class="def moral wide"><b>Quyền tác giả</b><p>Là quyền của tổ chức, cá nhân đối với tác phẩm do mình <em>sáng tạo ra</em> hoặc <em>sở hữu</em>. Luật Sở hữu trí tuệ chia thành hai nhóm quyền.</p></div>
<div class="duo">
  <div class="rights nt"><h4>👤 Quyền nhân thân</h4><ul>
    <li>Đặt tên cho tác phẩm</li>
    <li>Đứng tên thật hoặc bút danh trên tác phẩm</li>
    <li>Được nêu tên khi tác phẩm được công bố, sử dụng</li>
    <li>Công bố tác phẩm hoặc cho phép người khác công bố</li>
    <li>Bảo vệ sự toàn vẹn: không cho người khác sửa chữa, cắt xén, xuyên tạc tác phẩm</li></ul></div>
  <div class="rights ts"><h4>💰 Quyền tài sản</h4><ul>
    <li>Làm tác phẩm phái sinh</li>
    <li>Sao chép tác phẩm</li>
    <li>Truyền đạt tác phẩm đến công chúng</li>
    <li>Cho thuê bản gốc hoặc bản sao, chương trình máy tính</li></ul></div>
</div>
<div class="callout"><b>Tác phẩm phái sinh</b> là biến thể của tác phẩm gốc, ví dụ cuốn sách được dịch sang ngôn ngữ khác, hoặc phần mềm máy tính được cải biên để dùng trên điện thoại.</div>
<div class="callout alt"><b>Bản quyền và quyền tác giả.</b> Hai từ này thường được dùng như nhau. Về bản chất, quyền tác giả lấy người sáng tạo làm trung tâm, còn bản quyền ưu tiên bảo vệ lợi ích kinh tế của người sở hữu. Các văn bản pháp luật Việt Nam dùng thuật ngữ chính thức là <b>quyền tác giả</b>.</div>`,
    questions: [
      {
        id: 'q1', type: 'assign', ui: 'chips',
        text: 'Mỗi quyền dưới đây thuộc nhóm quyền nào?',
        groups: ['Quyền nhân thân', 'Quyền tài sản'],
        items: [
          { t: 'Được nêu tên thật hoặc bút danh khi tác phẩm được công bố', g: 0 },
          { t: 'Sao chép tác phẩm', g: 1 },
          { t: 'Không cho người khác sửa chữa, cắt xén hay xuyên tạc tác phẩm', g: 0 },
          { t: 'Làm tác phẩm phái sinh', g: 1 },
          { t: 'Cho thuê bản sao của chương trình máy tính', g: 1 },
          { t: 'Đặt tên cho tác phẩm', g: 0 }
        ],
        hint: 'Những mục có viền đỏ chưa đúng. Gợi ý: quyền nhân thân gắn với con người và danh dự của tác giả, quyền tài sản gắn với lợi ích kinh tế.',
        explain: 'Chính xác! Vi phạm quyền nhân thân hay quyền tài sản đều là vi phạm bản quyền.'
      },
      {
        id: 'q2', type: 'single',
        text: 'Cuốn sách được dịch sang tiếng nước ngoài, hoặc phần mềm máy tính được cải biên để chạy trên điện thoại, được gọi là:',
        options: ['Tác phẩm gốc', 'Bản sao lậu', 'Tác phẩm phái sinh'],
        answer: 2,
        hint: 'Chưa đúng. Em xem lại thẻ màu vàng ở cuối phần kiến thức.',
        explain: 'Chính xác! Tác phẩm phái sinh được tạo ra từ tác phẩm gốc.'
      },
      {
        id: 'q3', type: 'single',
        text: 'Thuật ngữ chính thức được dùng trong các văn bản pháp luật của Việt Nam hiện nay là:',
        options: ['Bản quyền', 'Quyền tác giả', 'Quyền sở hữu phần mềm'],
        answer: 1,
        hint: 'Chưa đúng. Em đọc lại thẻ “Bản quyền và quyền tác giả”.',
        explain: 'Chính xác!'
      }
    ],
    success: 'Đúng rồi! Em đã phân biệt được quyền nhân thân và quyền tài sản.'
  },

  /* ---- 4. Vi phạm bản quyền trong tin học ---- */
  {
    id: 'learn-ban-quyen-tin-hoc', name: 'Bản quyền trong tin học', icon: '💾', minutes: 4,
    title: 'Vi phạm và tôn trọng bản quyền trong tin học',
    img: 'assets/img/code-screen.jpg', imgAlt: 'Màn hình máy tính hiển thị mã chương trình',
    lead: 'Phần mềm và dữ liệu số đặc biệt dễ bị xâm phạm bản quyền.',
    content: `
<h3 class="sub">Các hành vi vi phạm bản quyền đối với sản phẩm số</h3>
<ul class="chips-list">
  <li>Mạo danh tác giả</li>
  <li>Công bố tác phẩm khi chưa được phép</li>
  <li>Sửa chữa, chuyển thể phần mềm, dữ liệu khi chưa được phép của tác giả</li>
  <li>Sử dụng phần mềm lậu (không mua quyền sử dụng)</li>
  <li>Phá khoá phần mềm, vô hiệu hoá biện pháp kĩ thuật của chủ sở hữu</li>
  <li>Làm bản phái sinh, phân phối dữ liệu, phần mềm khi chưa được phép</li>
  <li>Chiếm đoạt mã nguồn phần mềm</li>
  <li>Đăng tải tác phẩm, kể cả bản phái sinh, khi chưa được chủ sở hữu cho phép</li>
</ul>
<h3 class="sub">Mua bản quyền hay mua quyền sử dụng?</h3>
<div class="duo">
  <div class="def law"><b>Mua bản quyền</b><p>Người mua được kinh doanh tác phẩm đó. Ví dụ: Google mua YouTube.</p></div>
  <div class="def moral"><b>Mua quyền sử dụng (licence)</b><p>Chỉ được <em>sử dụng</em>. Em mua Windows, Word, Excel, PowerPoint là mua quyền sử dụng, bản quyền vẫn thuộc Microsoft. Quyền sử dụng tính <em>theo số máy</em> được cài đặt.</p></div>
</div>
<h3 class="sub">Vì sao sản phẩm số dễ bị xâm phạm?</h3>
<div class="duo">
  <div class="def law"><b>Dễ sao chép, chi phí rất thấp</b><p>Công ty tốn nhiều năm để làm phần mềm, kẻ cắp chỉ mất vài phút để sao chép.</p></div>
  <div class="def moral"><b>Dễ phát tán trên quy mô lớn</b><p>Phần mềm bị phát tán thì công ty không bán được và có thể mất hết vốn đầu tư.</p></div>
</div>
<div class="callout"><b>Nghị định 131/2013/NĐ-CP</b> xử phạt các hành vi: truyền đạt tác phẩm đến công chúng khi chưa được phép (đưa lên mạng); sao chép tác phẩm khi chưa được phép; cố ý huỷ bỏ hoặc làm vô hiệu biện pháp kĩ thuật bảo vệ quyền tác giả (bẻ khoá, crack).</div>`,
    questions: [
      {
        id: 'q1', type: 'single',
        text: 'Lan mua phần mềm có bản quyền trên đĩa CD, cài lên máy mình rồi cài thêm lên máy của bạn thân. Việc làm của Lan:',
        options: ['Không vi phạm vì Lan đã mua phần mềm', 'Vi phạm vì quyền sử dụng chỉ tính cho số máy đã mua', 'Chỉ vi phạm nếu bạn Lan lấy phần mềm đó để kiếm tiền'],
        answer: 1,
        hint: 'Chưa đúng. Em xem lại thẻ “Mua bản quyền hay mua quyền sử dụng?”.',
        explain: 'Chính xác! Mua quyền sử dụng cho một máy rồi cài sang máy thứ hai là vi phạm bản quyền.'
      },
      {
        id: 'q2', type: 'assign', ui: 'chips',
        text: 'Hành vi nào vi phạm quyền nhân thân, hành vi nào vi phạm quyền tài sản của tác giả?',
        groups: ['Quyền nhân thân', 'Quyền tài sản'],
        items: [
          { t: 'Mạo danh là tác giả của phần mềm', g: 0 },
          { t: 'Sửa, cắt xén tác phẩm khi chưa được phép của tác giả', g: 0 },
          { t: 'Sử dụng phần mềm lậu, không trả tiền mua quyền sử dụng', g: 1 },
          { t: 'Phá khoá phần mềm để dùng mà không trả tiền', g: 1 },
          { t: 'Sao chép và bán lại đĩa phần mềm cho nhiều người', g: 1 }
        ],
        hint: 'Những mục có viền đỏ chưa đúng. Gợi ý: mạo danh và sửa tác phẩm làm tổn hại tác giả; dùng lậu, sao chép để bán làm thiệt hại lợi ích kinh tế.',
        explain: 'Chính xác! Vi phạm quyền tài sản gây thiệt hại trực tiếp cho hoạt động kinh doanh của chủ sở hữu.'
      },
      {
        id: 'q3', type: 'multi',
        text: 'Những đặc tính nào khiến sản phẩm số đặc biệt dễ bị xâm phạm bản quyền? (chọn nhiều đáp án)',
        options: ['Dễ sao chép với chi phí rất thấp', 'Chỉ bán được trên đĩa CD', 'Dễ phát tán trên quy mô lớn', 'Luôn được mã hoá nên không ai phá được'],
        answer: [0, 2],
        hint: 'Chưa đúng hoàn toàn. Em xem lại thẻ “Vì sao sản phẩm số dễ bị xâm phạm?”.',
        explain: 'Chính xác! Nếu phần mềm làm ra là bị lấy cắp mà không bị xử lí thì sẽ không ai muốn đầu tư làm phần mềm nữa.'
      },
      {
        id: 'q4', type: 'single',
        text: 'Em mua và dùng hệ điều hành Windows, bộ Word, Excel, PowerPoint. Thực chất em đã mua:',
        options: ['Quyền sử dụng (licence): bản quyền vẫn thuộc Microsoft', 'Toàn bộ bản quyền, em có thể bán lại cho người khác để kinh doanh', 'Quyền sửa mã nguồn và phát hành phiên bản riêng'],
        answer: 0,
        hint: 'Chưa đúng. Em xem lại thẻ “Mua bản quyền hay mua quyền sử dụng?”.',
        explain: 'Chính xác!'
      }
    ],
    success: 'Xuất sắc! Em đã hiểu vì sao phải tôn trọng bản quyền trong tin học.'
  }
];

/* ---------------- 3. LUYỆN TẬP ---------------- */
Content.practice = [
  {
    id: 'practice-dang-tin', name: 'Đăng tin lên mạng', icon: '📱', minutes: 4,
    title: 'Luyện tập 1: Nên đăng hay không nên đăng?',
    lead: 'Lần này không có thẻ kiến thức. Em tự vận dụng những gì đã học.',
    questions: [
      {
        id: 'q1', type: 'assign', ui: 'chips',
        text: 'Em đồng ý, không đồng ý hay chỉ đồng ý một phần với từng ý kiến sau?',
        groups: ['Đồng ý', 'Không đồng ý', 'Đồng ý một phần'],
        items: [
          { t: 'Chúng ta có quyền đưa lên mạng xã hội tất cả các tin không phải là tin giả.', g: 1 },
          { t: 'Chúng ta có quyền đưa lên mạng xã hội tất cả các tin miễn là không có hại đến cá nhân nào.', g: 1 },
          { t: 'Chúng ta có quyền đưa lên mạng xã hội tất cả các tin miễn là không vi phạm pháp luật.', g: 2 }
        ],
        hint: 'Những mục có viền đỏ chưa đúng. Gợi ý: tin thật vẫn có thể vi phạm pháp luật (ví dụ tiết lộ bí mật, xúc phạm danh dự); tin không phạm luật vẫn cần cân nhắc về đạo đức.',
        explain: 'Chính xác! Tin thật chưa chắc được phép đăng, và tin không vi phạm pháp luật vẫn có thể vi phạm đạo đức, nên ý (c) chỉ đúng một phần.'
      },
      {
        id: 'q2', type: 'single',
        text: 'Trong đại dịch, một người chia sẻ tin “Từ ngày 28/3, toàn thành phố sẽ bị phong toả 14 ngày…”. Khi bị xử phạt, người này nói: “Tôi chỉ đưa lại tin chứ không bịa ra”. Người này sai ở đâu?',
        options: ['Sai vì không có ai cho phép dùng chữ “phong toả”', 'Sai vì chia sẻ tin sai sự thật mà không kiểm chứng; chia sẻ lại cũng phải chịu trách nhiệm', 'Không sai vì tin đó không phải do người này bịa ra'],
        answer: 1,
        hint: 'Chưa đúng. Em nhớ lại: việc chia sẻ một tin vi phạm luật cũng là vi phạm luật, và phải kiểm tra tin trước khi đăng.',
        explain: 'Chính xác! Chia sẻ tin giả là tiếp tay cho hành vi tung tin giả.'
      },
      {
        id: 'q3', type: 'single',
        text: 'Nếu em đăng nhận xét có tính chất xúc phạm một người khác lên mạng xã hội, hành vi này là:',
        options: ['Chắc chắn là vi phạm pháp luật', 'Chỉ là vi phạm đạo đức', 'Tuỳ mức độ, có thể vi phạm đạo đức hoặc vi phạm pháp luật', 'Không vi phạm gì'],
        answer: 2,
        hint: 'Chưa đúng. Hãy nhớ: xúc phạm danh dự, nhân phẩm là vi phạm pháp luật, nhưng mức độ nhẹ có thể chỉ là thiếu văn hoá.',
        explain: 'Chính xác! Tuỳ nội dung và hậu quả mà hành vi đó vi phạm đạo đức hay pháp luật.'
      }
    ],
    success: 'Tốt lắm! Em đã biết cân nhắc cả pháp luật lẫn đạo đức trước khi đăng tin.'
  },
  {
    id: 'practice-dieu-luat', name: 'Tra điều luật', icon: '📜', minutes: 3,
    title: 'Luyện tập 2: Hành vi này vi phạm điều nào?',
    lead: 'Em chọn quy định phù hợp với từng tình huống.',
    questions: [
      {
        id: 'q1', type: 'single',
        text: 'Đầu năm 2021, một cá nhân đăng tin sai về hành trình đi lại của một bệnh nhân dương tính với Covid-19, gây hoang mang cho cả một khu dân cư. Cá nhân này vi phạm quy định nào?',
        options: ['Luật An ninh mạng, Điều 8 khoản 1: cấm đăng thông tin sai sự thật gây hoang mang trong nhân dân', 'Luật Công nghệ thông tin, Điều 12 khoản 2: cấm tiết lộ bí mật nhà nước', 'Luật Công nghệ thông tin, Điều 12 khoản 2: cấm quảng cáo hàng hoá thuộc danh mục cấm'],
        answer: 0,
        hint: 'Chưa đúng. Em tìm quy định nhắc đến “thông tin sai sự thật” và “gây hoang mang”.',
        explain: 'Chính xác! Đây cũng là hành vi bị xử phạt theo Nghị định 15/2020/NĐ-CP.'
      },
      {
        id: 'q2', type: 'single',
        text: 'Một trang bán hàng quảng cáo sai sự thật về tác dụng của một loại thuốc. Hành vi này thuộc điểm nào của Điều 101 khoản 1 Nghị định 15/2020/NĐ-CP?',
        options: ['Cung cấp, chia sẻ hình ảnh bản đồ Việt Nam không thể hiện đúng chủ quyền', 'Cung cấp, chia sẻ thông tin giả mạo, thông tin sai sự thật, xuyên tạc, vu khống', 'Cung cấp, chia sẻ thông tin miêu tả tỉ mỉ hành động chém, giết, tai nạn, kinh dị', 'Cung cấp, chia sẻ tác phẩm báo chí, nghệ thuật khi chưa được phép của chủ sở hữu'],
        answer: 1,
        hint: 'Chưa đúng. Quảng cáo sai về tác dụng của thuốc là cung cấp loại thông tin nào?',
        explain: 'Chính xác! Quảng cáo sai sự thật là thông tin sai sự thật.'
      },
      {
        id: 'q3', type: 'assign', ui: 'select',
        text: 'Mỗi hành vi dưới đây bị xử lí theo quy định nào?',
        groups: ['Nghị định 131/2013/NĐ-CP: truyền đạt tác phẩm đến công chúng khi chưa được phép', 'Nghị định 131/2013/NĐ-CP: cố ý vô hiệu hoá biện pháp kĩ thuật bảo vệ quyền tác giả', 'Nghị định 90/2008/NĐ-CP về chống thư rác'],
        items: [
          { t: 'Bẻ khoá (crack) phần mềm để dùng', g: 1 },
          { t: 'Gửi tin nhắn quảng cáo cho người đã từ chối nhận', g: 2 },
          { t: 'Đưa phần mềm của người khác lên mạng khi chưa được phép', g: 0 }
        ],
        hint: 'Những mục có viền đỏ chưa đúng. Em xem lại ba hành vi được Nghị định 131/2013 xử phạt và nội dung của Nghị định 90/2008.',
        explain: 'Chính xác! Em đã gắn đúng hành vi với quy định.'
      }
    ],
    success: 'Đúng rồi! Em biết tra đúng quy định cho từng hành vi.'
  },
  {
    id: 'practice-ban-quyen', name: 'Bản quyền', icon: '🛡️', minutes: 4,
    title: 'Luyện tập 3: Có vi phạm bản quyền không?',
    lead: 'Em phân tích các tình huống về bản quyền thường gặp trong học tập.',
    questions: [
      {
        id: 'q1', type: 'multi',
        text: 'Những hành vi nào sau đây là vi phạm bản quyền? (chọn nhiều đáp án)',
        options: ['Sao chép các đĩa cài đặt phần mềm', 'Một người bạn mua tài khoản học tiếng Anh trực tuyến, em mượn tài khoản đó để cùng học', 'Phá khoá phần mềm chỉ để thử khả năng phá khoá, không dùng', 'Em dùng nhờ một phần mềm đã có bản quyền trên máy tính của bạn'],
        answer: [0, 1, 2],
        hint: 'Chưa đúng hoàn toàn. Gợi ý: quyền sử dụng tính cho người hoặc máy đã mua; cố ý vô hiệu hoá biện pháp kĩ thuật là vi phạm dù em không dùng; đứng trên máy bạn dùng nhờ phần mềm đã có bản quyền thì khác.',
        explain: 'Chính xác! Sao chép lậu, dùng chung tài khoản đã mua và bẻ khoá đều xâm phạm quyền của chủ sở hữu. Dùng nhờ phần mềm đã cài hợp lệ trên máy bạn thì chưa phải vi phạm.'
      },
      {
        id: 'q2', type: 'single',
        text: 'An nhắc Bình về việc dùng phần mềm lậu và giảng giải các quy định về quyền tác giả. Bình bảo: “Trước đây mình không biết, mà không biết là không có lỗi”. Quan niệm của Bình:',
        options: ['Đúng, vì không biết thì không phải chịu trách nhiệm', 'Không đúng, dùng phần mềm lậu vẫn là hành vi vi phạm pháp luật dù Bình không biết', 'Đúng, vì phần mềm lậu thì ai cũng dùng'],
        answer: 1,
        hint: 'Chưa đúng. Việc vi phạm bản quyền là hành vi phạm pháp, bất kể người dùng có biết hay không.',
        explain: 'Chính xác! Hiểu biết pháp luật giúp em tránh vi phạm. Bình nên chuyển sang phần mềm có bản quyền hoặc phần mềm miễn phí hợp pháp.'
      },
      {
        id: 'q3', type: 'single',
        text: 'Vì sao nói vi phạm bản quyền còn làm hại cả ngành công nghệ thông tin, không chỉ riêng chủ sở hữu phần mềm?',
        options: ['Vì phần mềm lậu luôn chạy chậm hơn phần mềm thật', 'Vì nếu sản phẩm làm ra bị lấy cắp mà không bị xử lí thì sẽ không ai muốn đầu tư làm phần mềm nữa', 'Vì người dùng phần mềm lậu sẽ không bao giờ mua máy tính mới'],
        answer: 1,
        hint: 'Chưa đúng. Em nhớ lại ý ở cuối phần “Tôn trọng bản quyền trong tin học”.',
        explain: 'Chính xác! Tôn trọng bản quyền để các ngành tạo ra sản phẩm trí tuệ, trong đó có tin học, phát triển.'
      }
    ],
    success: 'Xuất sắc! Em đã sẵn sàng nộp phần 1 và sang phần Vận dụng.'
  }
];

/* ---------------- 4. VẬN DỤNG ---------------- */
Content.final = {
  title: 'Hồ sơ tình huống: nhóm chat lớp 10A',
  img: 'assets/img/social-phone.jpg', imgAlt: 'Tay cầm điện thoại đang xem mạng xã hội',
  minutes: 10,
  scenario: `<p>Trong nhóm chat của lớp 10A, bạn <b>Hải</b> gặp liên tiếp mấy việc:</p>
<ol class="facts">
  <li>Một thành viên đăng bài: <i>“Trường mình sắp bị phong toả 14 ngày”</i>, không có nguồn. Hải định chia sẻ tiếp cho cả khối.</li>
  <li>Một bạn đưa clip bạn L. bị đánh ở cổng trường, kèm họ tên và địa chỉ nhà của L. Hải thấy nhiều bạn quay clip rồi đăng lên nhóm.</li>
  <li>Hải làm poster cho cuộc thi của lớp. Hải lấy luôn ảnh của một nhiếp ảnh gia trên mạng, không xin phép và không ghi nguồn. Ảnh được chỉnh bằng một phần mềm bản crack tải từ diễn đàn.</li>
  <li>Một bạn trong nhóm nhắn tin quảng cáo bán hàng liên tục, dù nhiều người đã nhắn “đừng gửi nữa”.</li>
  <li>Một bạn khác kiểm tra nguồn của tin “phong toả”, thấy không có thật và nhắc cả nhóm đừng chia sẻ.</li>
</ol>`,
  partA: {
    id: 'partA',
    text: 'Phần A. Xếp mỗi hành vi vào nhóm phù hợp nhất.',
    groups: ['Vi phạm pháp luật', 'Vi phạm đạo đức, thiếu văn hoá', 'Hành vi nên làm'],
    ui: 'chips',
    items: [
      { t: 'Chia sẻ tin “phong toả 14 ngày” chưa kiểm chứng cho cả khối', g: 0 },
      { t: 'Đưa họ tên, địa chỉ nhà của bạn L. lên nhóm chat khi chưa được phép', g: 0 },
      { t: 'Quay clip bạn bị đánh rồi đăng lên mạng xã hội', g: 1 },
      { t: 'Lấy ảnh của nhiếp ảnh gia làm poster, không xin phép, không ghi nguồn', g: 0 },
      { t: 'Dùng phần mềm chỉnh ảnh bản crack tải từ diễn đàn', g: 0 },
      { t: 'Nhắn quảng cáo liên tục dù nhiều người đã từ chối nhận', g: 1 },
      { t: 'Kiểm tra nguồn tin và nhắc cả nhóm không chia sẻ tin giả', g: 2 }
    ],
    hint: 'Những mục có viền đỏ chưa đúng. Em xem lại các thẻ kiến thức và phần Luyện tập.'
  },
  partB: {
    id: 'partB', minWords: 25,
    text: 'Phần B. Em là bạn thân của Hải. Hãy viết lời khuyên cho Hải về việc làm poster (tình huống số 3): Hải đã vi phạm điều gì, và Hải nên làm gì để đúng pháp luật?',
    placeholder: 'Viết bằng lời của em, ít nhất 25 từ…'
  },
  partC: {
    id: 'partC', count: 3, minWords: 6,
    text: 'Phần C. Cùng viết “3 quy tắc ứng xử trên mạng của lớp 10A”. Mỗi quy tắc là một câu rõ ràng, ít nhất 6 từ.',
    placeholders: ['Quy tắc 1: …', 'Quy tắc 2: …', 'Quy tắc 3: …']
  }
};
