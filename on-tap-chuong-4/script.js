let db = null;
let firebaseApi = null;
let auth = null;
let authApi = null;
let currentUser = null;
let currentView = "home";
let questionBank = [];
let timerId = null;
const firebaseSettings = window.TRUTH_FIREBASE_SETTINGS || { enabled: false, config: {} };

const QUESTION_BANK = [
  [
    "personnel",
    "Theo giáo trình, yếu tố nào góp phần làm thay đổi quan hệ nhân sự trong bộ máy chính quyền nhà nước ở xã hội tư bản ngày nay?",
    [
      "Sự phát triển của trình độ dân trí và quy luật cạnh tranh",
      "Sự xóa bỏ hoàn toàn cạnh tranh",
      "Sự biến mất của các tổ chức độc quyền",
      "Sự thay thế hoàn toàn bằng kinh tế tự cấp tự túc"
    ],
    0,
    "Giáo trình nêu sự phát triển trình độ dân trí và quy luật cạnh tranh dẫn đến thay đổi quan hệ nhân sự trong bộ máy chính quyền nhà nước."
  ],
  [
    "personnel",
    "Thể chế nào trở thành phổ biến trong phân chia quyền lực nhà nước ở các nước tư bản phát triển theo giáo trình?",
    [
      "Thể chế một quyền lực tuyệt đối",
      "Thể chế đa nguyên",
      "Thể chế không có cơ quan lập pháp",
      "Thể chế xóa bỏ mọi đảng phái"
    ],
    1,
    "Biểu hiện mới là thể chế đa nguyên trong phân chia quyền lực nhà nước."
  ],
  [
    "personnel",
    "Cơ chế thỏa hiệp giữa các thế lực tư bản độc quyền nhằm mục đích trực tiếp nào?",
    [
      "Cho phép một thế lực độc tôn",
      "Cùng tồn tại và cùng phân chia quyền lực",
      "Xóa bỏ bộ máy nhà nước",
      "Thay thế cạnh tranh bằng kinh tế tự nhiên"
    ],
    1,
    "Theo giáo trình, cơ chế thỏa hiệp cho phép các thế lực cùng tồn tại, cùng phân chia quyền lực và không để một thế lực độc tôn."
  ],
  [
    "personnel",
    "Nhận định nào KHÔNG phù hợp với biểu hiện mới về quan hệ nhân sự?",
    [
      "Có cơ chế thỏa hiệp giữa các thế lực tư bản độc quyền",
      "Một thế lực tư bản luôn được phép chuyên quyền tuyệt đối",
      "Quyền lực có thể được phân chia giữa các thế lực",
      "Thể chế đa nguyên trở nên phổ biến"
    ],
    1,
    "Giáo trình nhấn mạnh cơ chế thỏa hiệp không cho phép bất kỳ một thế lực nào độc tôn, chuyên quyền."
  ],
  [
    "personnel",
    "Trong không ít trường hợp, trọng tâm quyền lực nhà nước thuộc về lực lượng nào?",
    [
      "Một thế lực trung dung có vị thế cân bằng",
      "Mọi công dân trực tiếp điều hành hằng ngày",
      "Một doanh nghiệp nhỏ không có ảnh hưởng",
      "Một lực lượng quân sự duy nhất"
    ],
    0,
    "Giáo trình cho biết trọng tâm quyền lực có thể thuộc về một thế lực trung dung, giữ vị thế cân bằng giữa các thế lực đối địch."
  ],
  [
    "personnel",
    "Vị thế cân bằng của một thế lực trung dung có thể tạo ra các thể chế như thế nào?",
    [
      "Cực đoan hơn mọi thời kỳ trước",
      "Ôn hòa hơn và ít cực đoan hơn",
      "Không có tính kinh tế, chính trị hay xã hội",
      "Không chịu tác động của quyền lực"
    ],
    1,
    "Theo giáo trình, vị thế cân bằng này có thể tạo ra thể chế kinh tế, chính trị, xã hội ôn hòa hơn và ít cực đoan hơn."
  ],
  [
    "personnel",
    "Hai nhóm lợi ích lớn thỏa thuận cùng tham gia một liên minh cầm quyền để không bên nào chi phối toàn bộ. Tình huống này minh họa rõ nhất cho:",
    [
      "Cơ chế thỏa hiệp và phân chia quyền lực",
      "Xóa bỏ hoàn toàn độc quyền",
      "Sở hữu công cộng tuyệt đối",
      "Cạnh tranh hoàn hảo"
    ],
    0,
    "Đây là tình huống vận dụng ý về cơ chế thỏa hiệp giữa các thế lực tư bản độc quyền."
  ],
  [
    "personnel",
    "“Thể chế đa nguyên trong phân chia quyền lực” chủ yếu nói đến phương diện nào?",
    [
      "Cơ chế nhân sự và phân bổ quyền lực nhà nước",
      "Kỹ thuật sản xuất hàng hóa",
      "Cách tính lượng giá trị hàng hóa",
      "Tốc độ lưu thông tiền tệ"
    ],
    0,
    "Nội dung này thuộc phần biểu hiện mới về cơ chế quan hệ nhân sự trong bộ máy chính quyền."
  ],
  [
    "personnel",
    "Theo giáo trình, cơ chế thỏa hiệp giữa các thế lực tư bản độc quyền được ghi nhận chủ yếu tại:",
    [
      "Các nước tư bản phát triển nhất",
      "Các cộng đồng tự cấp tự túc",
      "Mọi xã hội tiền tư bản",
      "Các xí nghiệp nhỏ riêng lẻ"
    ],
    0,
    "Giáo trình mô tả cơ chế này trong các nước tư bản phát triển nhất."
  ],
  [
    "personnel",
    "Một đề xuất khẳng định “quyền lực nhà nước nhất thiết do một tập đoàn duy nhất nắm trọn và không có thỏa hiệp” mâu thuẫn trực tiếp với ý nào của giáo trình?",
    [
      "Thể chế đa nguyên và cơ chế thỏa hiệp",
      "Vai trò của thuế",
      "Khái niệm ngân sách",
      "Quy luật giá trị"
    ],
    0,
    "Đề xuất này trái với mô tả về đa nguyên, thỏa hiệp và phân chia quyền lực."
  ],
  [
    "state_ownership",
    "Theo giáo trình, chi tiêu ngân sách nhà nước thuộc quyền chủ yếu của:",
    [
      "Giới hành pháp",
      "Giới lập pháp",
      "Các cổ đông nhỏ",
      "Công đoàn doanh nghiệp"
    ],
    1,
    "Giáo trình nêu chi tiêu ngân sách nhà nước là công việc thuộc quyền của giới lập pháp."
  ],
  [
    "state_ownership",
    "Giới hành pháp bị giới hạn hoặc quản lý chặt chẽ trong chi tiêu ngân sách bằng:",
    [
      "Luật ngân sách nhà nước",
      "Quy luật giá trị",
      "Tỷ suất lợi nhuận bình quân",
      "Luật cung - cầu"
    ],
    0,
    "Giáo trình chỉ rõ giới hành pháp có thể bị quản lý chặt chẽ bằng luật ngân sách nhà nước."
  ],
  [
    "state_ownership",
    "Hai mục tiêu được ưu tiên trong biểu hiện mới về sở hữu nhà nước là:",
    [
      "Tăng lạm phát và tăng thất nghiệp",
      "Chống lạm phát và chống thất nghiệp",
      "Giảm toàn bộ chi tiêu công",
      "Xóa bỏ mọi dự trữ quốc gia"
    ],
    1,
    "Giáo trình nêu chống lạm phát và chống thất nghiệp được ưu tiên."
  ],
  [
    "state_ownership",
    "Dự trữ quốc gia được mô tả là nguồn vốn chỉ có thể sử dụng trong:",
    [
      "Mọi giao dịch thương mại thường ngày",
      "Tình huống đặc biệt",
      "Mọi hoạt động của doanh nghiệp tư nhân",
      "Các khoản đầu tư cá nhân"
    ],
    1,
    "Theo giáo trình, dự trữ quốc gia chỉ có thể được sử dụng trong tình huống đặc biệt."
  ],
  [
    "state_ownership",
    "Biểu hiện phổ biến về sở hữu nhà nước trong nền kinh tế tư bản hiện đại là:",
    [
      "Nhà nước nắm cổ phần trong ngân hàng và công ty lớn",
      "Nhà nước xóa bỏ mọi ngân hàng",
      "Mọi công ty đều là doanh nghiệp tư nhân nhỏ",
      "Không tồn tại đầu tư công"
    ],
    0,
    "Cổ phần của nhà nước trong các ngân hàng và công ty lớn trở thành phổ biến theo giáo trình."
  ],
  [
    "state_ownership",
    "Đầu tư nhà nước có vai trò tăng lên trong lĩnh vực nào sau đây?",
    [
      "Nghiên cứu khoa học cơ bản",
      "Chỉ các hoạt động có lợi nhuận tức thời",
      "Chỉ kinh doanh đầu cơ ngắn hạn",
      "Chỉ quảng cáo thương hiệu cá nhân"
    ],
    0,
    "Nhà nước tăng đầu tư để khắc phục chi phí tốn kém trong nghiên cứu khoa học cơ bản."
  ],
  [
    "state_ownership",
    "Ngoài nghiên cứu khoa học cơ bản, đầu tư nhà nước còn gia tăng trong:",
    [
      "Kết cấu hạ tầng và các nhu cầu xã hội",
      "Chỉ hoạt động giải trí tư nhân",
      "Chỉ thị trường hàng xa xỉ",
      "Chỉ sản xuất thủ công gia đình"
    ],
    0,
    "Giáo trình nêu xây dựng kết cấu hạ tầng và giải quyết nhu cầu mang tính xã hội."
  ],
  [
    "state_ownership",
    "Trong mô tả của giáo trình, nhà nước thường sử dụng ngân sách để:",
    [
      "Tạo cơ sở vật chất và gánh chịu rủi ro lớn",
      "Chỉ chia lợi nhuận cho cổ đông tư nhân",
      "Xóa bỏ mọi doanh nghiệp lớn",
      "Không can thiệp vào hạ tầng"
    ],
    0,
    "Nhà nước dùng ngân sách tạo cơ sở vật chất và gánh chịu rủi ro lớn."
  ],
  [
    "state_ownership",
    "Theo giáo trình, khi nhà nước gánh chi phí và rủi ro lớn, các công ty tư nhân có xu hướng tập trung vào:",
    [
      "Lĩnh vực có lợi nhuận hấp dẫn",
      "Các hoạt động không tạo lợi nhuận",
      "Việc phân phối dự trữ quốc gia",
      "Công việc lập pháp"
    ],
    0,
    "Giáo trình mô tả các công ty tư nhân tập trung vào lĩnh vực có lợi nhuận hấp dẫn."
  ],
  [
    "state_ownership",
    "Vì sao các tập đoàn độc quyền lớn thường thu lợi nhuận lớn trong các dự án dùng ngân sách nhà nước?",
    [
      "Nhờ lợi thế về tiềm lực khi tham gia đấu thầu",
      "Vì không cần năng lực kỹ thuật hay tài chính",
      "Vì không phải ký hợp đồng",
      "Vì mọi doanh nghiệp nhỏ bị cấm tham gia"
    ],
    0,
    "Giáo trình nhấn mạnh lợi thế vượt trội về tiềm lực trong quá trình đấu thầu."
  ],
  [
    "state_ownership",
    "Nhận định nào đúng về sở hữu nhà nước trong phần lý luận nền tảng của Chương 4?",
    [
      "Chỉ gồm trụ sở bộ máy hành chính",
      "Có thể gồm doanh nghiệp nhà nước và cơ sở hạ tầng kinh tế - xã hội",
      "Không liên quan đến bất kỳ doanh nghiệp nào",
      "Chỉ tồn tại dưới dạng tiền mặt"
    ],
    1,
    "Giáo trình nêu sở hữu nhà nước không chỉ là tài sản cho bộ máy nhà nước mà còn gồm doanh nghiệp và hạ tầng kinh tế - xã hội."
  ],
  [
    "state_ownership",
    "Hình thức nào sau đây có thể tạo lập sở hữu nhà nước?",
    [
      "Nhà nước mua cổ phần của doanh nghiệp tư nhân",
      "Chỉ phát hành phiếu giảm giá cho người tiêu dùng",
      "Chỉ giảm lãi suất ngân hàng",
      "Chỉ ký hợp đồng lao động"
    ],
    0,
    "Một hình thức là nhà nước mua cổ phần của doanh nghiệp tư nhân."
  ],
  [
    "state_ownership",
    "Một chức năng của sở hữu nhà nước theo giáo trình là:",
    [
      "Mở rộng địa bàn cho sự phát triển của độc quyền",
      "Xóa bỏ hoàn toàn mọi doanh nghiệp tư nhân",
      "Loại bỏ mọi hoạt động đầu tư",
      "Chuyển nền kinh tế về tự cấp tự túc"
    ],
    0,
    "Giáo trình nêu sở hữu nhà nước có thể mở rộng sản xuất tư bản chủ nghĩa và tạo địa bàn phát triển cho độc quyền."
  ],
  [
    "state_ownership",
    "Sở hữu nhà nước có thể tạo điều kiện cho các tổ chức độc quyền làm gì?",
    [
      "Di chuyển tư bản từ ngành ít lãi sang ngành hiệu quả hơn",
      "Xóa bỏ hoàn toàn cạnh tranh quốc tế",
      "Không thay đổi lĩnh vực đầu tư",
      "Chấm dứt lưu thông hàng hóa"
    ],
    0,
    "Một chức năng được nêu là tạo điều kiện thuận lợi cho sự di chuyển tư bản giữa các ngành."
  ],
  [
    "state_ownership",
    "Sở hữu nhà nước làm chỗ dựa cho hoạt động nào?",
    [
      "Điều tiết kinh tế của nhà nước theo các chương trình nhất định",
      "Xóa bỏ toàn bộ luật ngân sách",
      "Loại bỏ cơ quan lập pháp",
      "Chuyển toàn bộ tài sản cho cá nhân"
    ],
    0,
    "Giáo trình xác định sở hữu nhà nước là chỗ dựa cho điều tiết kinh tế của nhà nước."
  ],
  [
    "state_ownership",
    "“Thị trường nhà nước” được hình thành, phát triển thể hiện qua hành vi nào?",
    [
      "Nhà nước bao mua sản phẩm qua hợp đồng với doanh nghiệp độc quyền",
      "Người tiêu dùng ngừng mua hàng hóa",
      "Doanh nghiệp nhỏ tự sản xuất để dùng",
      "Nhà nước không ký bất kỳ hợp đồng nào"
    ],
    0,
    "Giáo trình mô tả thị trường nhà nước qua việc nhà nước bao mua sản phẩm bằng các hợp đồng."
  ],
  [
    "state_ownership",
    "Một chính phủ nắm 25% cổ phần của một ngân hàng lớn nhưng không sở hữu toàn bộ ngân hàng. Đây phù hợp nhất với biểu hiện nào?",
    [
      "Cổ phần nhà nước trong ngân hàng lớn",
      "Xóa bỏ sở hữu nhà nước",
      "Cạnh tranh hoàn hảo",
      "Sản xuất tự cấp tự túc"
    ],
    0,
    "Giáo trình nêu việc nhà nước có cổ phần trong ngân hàng và công ty lớn là biểu hiện phổ biến."
  ],
  [
    "state_ownership",
    "Cơ quan lập pháp phê chuẩn một khoản chi lớn; cơ quan hành pháp chỉ được giải ngân trong giới hạn luật ngân sách. Tình huống minh họa:",
    [
      "Vai trò của giới lập pháp trong chi tiêu ngân sách",
      "Độc quyền mua của người tiêu dùng",
      "Lao động trừu tượng",
      "Quy luật lưu thông tiền tệ"
    ],
    0,
    "Tình huống bám sát nội dung chi tiêu ngân sách thuộc quyền giới lập pháp và hành pháp bị ràng buộc bởi luật ngân sách."
  ],
  [
    "state_ownership",
    "Nhà nước đầu tư dự án hạ tầng có vốn lớn và rủi ro cao, sau đó doanh nghiệp tư nhân khai thác dịch vụ có khả năng sinh lời. Tình huống này gần nhất với nhận định:",
    [
      "Nhà nước tạo cơ sở vật chất và gánh rủi ro, tư nhân hướng vào lợi nhuận",
      "Nhà nước không có vai trò kinh tế",
      "Doanh nghiệp tư nhân luôn gánh mọi rủi ro xã hội",
      "Mọi đầu tư công đều là tiêu dùng cá nhân"
    ],
    0,
    "Đây là tình huống vận dụng trực tiếp lập luận trong giáo trình."
  ],
  [
    "state_ownership",
    "Khi một tập đoàn có năng lực tài chính và kỹ thuật vượt trội thường trúng các gói thầu công lớn, nội dung nào được minh họa?",
    [
      "Lợi thế tiềm lực của tập đoàn lớn trong đấu thầu dự án công",
      "Quy luật giá trị không còn tồn tại",
      "Sản xuất hàng hóa bị xóa bỏ",
      "Dự trữ quốc gia được dùng hằng ngày"
    ],
    0,
    "Giáo trình liên hệ lợi thế tiềm lực với khả năng thu lợi nhuận lớn từ các đơn đặt hàng của nhà nước."
  ],
  [
    "regulation",
    "Hệ thống điều tiết của nhà nước tư sản bao gồm chủ yếu:",
    [
      "Bộ máy quản lý gắn với hệ thống chính sách và công cụ",
      "Chỉ các doanh nghiệp nhỏ",
      "Chỉ thị trường tự do không có quy tắc",
      "Chỉ hoạt động sản xuất nông nghiệp"
    ],
    0,
    "Giáo trình mô tả một tổng thể thiết chế, thể chế, bộ máy quản lý, chính sách và công cụ."
  ],
  [
    "regulation",
    "Phạm vi mà hệ thống điều tiết nhà nước có thể tác động theo giáo trình là:",
    [
      "Toàn bộ nền kinh tế quốc dân và quá trình tái sản xuất xã hội",
      "Chỉ một cửa hàng bán lẻ",
      "Chỉ hoạt động tiêu dùng cá nhân",
      "Chỉ một ngành thủ công"
    ],
    0,
    "Hệ thống điều tiết có khả năng tác động tới toàn bộ nền kinh tế quốc dân và toàn bộ quá trình tái sản xuất xã hội."
  ],
  [
    "regulation",
    "Hình thức điều tiết nào được giáo trình nêu?",
    [
      "Hướng dẫn, kiểm soát và uốn nắn lệch lạc",
      "Chỉ cấm mọi giao dịch",
      "Chỉ để thị trường tự xử lý trong mọi tình huống",
      "Chỉ thay đổi tên doanh nghiệp"
    ],
    0,
    "Giáo trình nêu hướng dẫn, kiểm soát, uốn nắn những lệch lạc là các hình thức điều tiết."
  ],
  [
    "regulation",
    "Nhà nước có thể uốn nắn lệch lạc kinh tế bằng nhóm công cụ nào?",
    [
      "Công cụ kinh tế và công cụ hành chính - pháp lý",
      "Chỉ công cụ quảng cáo",
      "Chỉ hoạt động từ thiện cá nhân",
      "Chỉ lao động thủ công"
    ],
    0,
    "Giáo trình nhấn mạnh kết hợp công cụ kinh tế với công cụ hành chính - pháp lý."
  ],
  [
    "regulation",
    "Biện pháp điều tiết của nhà nước có thể gồm:",
    [
      "Ưu đãi và trừng phạt",
      "Chỉ khuyến khích, không bao giờ xử lý vi phạm",
      "Chỉ trừng phạt, không có chính sách hỗ trợ",
      "Không can thiệp bằng chính sách"
    ],
    0,
    "Giáo trình nói đến cả ưu đãi và trừng phạt."
  ],
  [
    "regulation",
    "Ví dụ nào thuộc giải pháp chiến lược dài hạn trong điều tiết kinh tế?",
    [
      "Lập chương trình, kế hoạch tổng thể phát triển khoa học - công nghệ",
      "Một quyết định mua sắm cá nhân trong ngày",
      "Thay đổi giá một món hàng ở cửa tiệm",
      "Một giao dịch chuyển khoản cá nhân"
    ],
    0,
    "Giáo trình nêu lập chương trình và kế hoạch tổng thể phát triển kinh tế, khoa học, công nghệ, môi trường, bảo hiểm xã hội."
  ],
  [
    "regulation",
    "Công cụ chủ yếu nào KHÔNG được liệt kê trong giáo trình để nhà nước tư sản điều tiết kinh tế?",
    [
      "Ngân sách",
      "Thuế",
      "Hệ thống tiền tệ và tín dụng",
      "Một sở thích tiêu dùng cá nhân"
    ],
    3,
    "Ngân sách, thuế, tiền tệ và tín dụng đều là công cụ điều tiết được giáo trình nêu."
  ],
  [
    "regulation",
    "Bên cạnh ngân sách và thuế, công cụ điều tiết còn bao gồm:",
    [
      "Doanh nghiệp nhà nước, kế hoạch hóa/chương trình hóa và công cụ hành chính - pháp lý",
      "Chỉ tin đồn thị trường",
      "Chỉ phiếu bầu của người tiêu dùng",
      "Chỉ hoạt động xuất khẩu hàng hóa"
    ],
    0,
    "Đây là nhóm công cụ được liệt kê trong giáo trình."
  ],
  [
    "regulation",
    "Bộ máy điều tiết kinh tế gồm những nhánh cơ quan nào?",
    [
      "Lập pháp, hành pháp, tư pháp",
      "Quân đội, trường học, bệnh viện",
      "Người mua, người bán, người vận chuyển",
      "Nông nghiệp, công nghiệp, dịch vụ"
    ],
    0,
    "Giáo trình nêu ba bộ phận lập pháp, hành pháp và tư pháp."
  ],
  [
    "regulation",
    "Về mặt nhân sự, bộ máy điều tiết kinh tế có sự tham gia của:",
    [
      "Đại biểu các tập đoàn tư bản độc quyền lớn và quan chức nhà nước",
      "Chỉ người tiêu dùng cá nhân",
      "Chỉ hộ nông dân tự cấp",
      "Chỉ nhà khoa học độc lập"
    ],
    0,
    "Giáo trình ghi nhận sự tham gia của đại biểu tập đoàn tư bản độc quyền lớn và quan chức nhà nước."
  ],
  [
    "regulation",
    "Các tiểu ban “tư vấn” bên cạnh bộ máy điều tiết có thể thực hiện vai trò nào theo giáo trình?",
    [
      "Tác động, “lái” đường lối kinh tế theo mục tiêu riêng của tổ chức độc quyền",
      "Xóa bỏ toàn bộ chính sách kinh tế",
      "Thay thế cơ quan tư pháp",
      "Tạo ra hàng hóa công cộng tự động"
    ],
    0,
    "Giáo trình dùng từ “tư vấn” và “lái” đường lối theo mục tiêu riêng của tổ chức độc quyền."
  ],
  [
    "regulation",
    "Cơ chế điều tiết kinh tế độc quyền nhà nước là sự dung hợp của bao nhiêu cơ chế?",
    [
      "Hai cơ chế",
      "Ba cơ chế",
      "Bốn cơ chế",
      "Năm cơ chế"
    ],
    1,
    "Giáo trình xác định sự dung hợp ba cơ chế."
  ],
  [
    "regulation",
    "Ba cơ chế được dung hợp trong cơ chế điều tiết kinh tế độc quyền nhà nước là:",
    [
      "Thị trường, độc quyền tư nhân, điều tiết của nhà nước",
      "Sản xuất, tiêu dùng, tiết kiệm",
      "Thuế, lãi suất, tỷ giá",
      "Nông nghiệp, công nghiệp, dịch vụ"
    ],
    0,
    "Đây là ba cơ chế được giáo trình nêu trực tiếp."
  ],
  [
    "regulation",
    "Theo cách diễn đạt của giáo trình, cơ chế điều tiết này là cơ chế thị trường có sự điều tiết của nhà nước nhằm:",
    [
      "Phục vụ lợi ích của chủ nghĩa tư bản độc quyền",
      "Xóa bỏ mọi lợi ích kinh tế",
      "Thay thế hoàn toàn thị trường bằng tự cấp",
      "Bảo đảm không còn doanh nghiệp lớn"
    ],
    0,
    "Đây là kết luận được nêu trong phần cơ chế điều tiết kinh tế độc quyền nhà nước."
  ],
  [
    "regulation",
    "Vai trò hiện đại của nhà nước tư sản không chỉ là thuế và luật pháp mà còn gồm:",
    [
      "Tổ chức, quản lý khu vực kinh tế nhà nước và điều tiết toàn bộ tái sản xuất",
      "Chỉ điều hành một doanh nghiệp nhỏ",
      "Chỉ quản lý tiêu dùng cá nhân",
      "Không sử dụng đòn bẩy kinh tế"
    ],
    0,
    "Giáo trình nêu vai trò tổ chức, quản lý khu vực kinh tế nhà nước và điều tiết bằng đòn bẩy kinh tế."
  ],
  [
    "regulation",
    "Các khâu của quá trình tái sản xuất mà nhà nước có thể điều tiết gồm:",
    [
      "Sản xuất, phân phối, trao đổi, tiêu dùng",
      "Chỉ sản xuất",
      "Chỉ trao đổi",
      "Chỉ tiêu dùng"
    ],
    0,
    "Giáo trình liệt kê đầy đủ bốn khâu này."
  ],
  [
    "regulation",
    "Một chính phủ đồng thời dùng thuế ưu đãi, quy định pháp lý, tín dụng ưu đãi và chương trình công nghệ dài hạn. Đây là ví dụ của:",
    [
      "Điều tiết kinh tế bằng nhiều công cụ kết hợp",
      "Sản xuất tự cấp tự túc",
      "Xóa bỏ toàn bộ vai trò nhà nước",
      "Chỉ cạnh tranh giữa người tiêu dùng"
    ],
    0,
    "Tình huống phản ánh sự kết hợp công cụ kinh tế, hành chính - pháp lý và giải pháp dài hạn."
  ],
  [
    "regulation",
    "Đạo luật Thị trường Kỹ thuật số của EU (DMA) đặt các nghĩa vụ và điều cấm đối với “gatekeeper” là nền tảng số lớn. Ví dụ này minh họa rõ nhất cho:",
    [
      "Nhà nước/cơ quan công quyền dùng quy tắc để điều chỉnh sức mạnh thị trường",
      "Thị trường số hoàn toàn không cần điều tiết",
      "Xóa bỏ công nghệ số",
      "Sản xuất hàng hóa không còn cạnh tranh"
    ],
    0,
    "DMA là ví dụ thực tế về cơ quan công quyền đặt nghĩa vụ và điều cấm với các nền tảng số lớn để hỗ trợ thị trường công bằng, mở và có thể cạnh tranh."
  ],
  [
    "regulation",
    "Chương trình TARP của Hoa Kỳ được lập trong khủng hoảng tài chính 2008 nhằm ổn định hệ thống tài chính. Trong quiz, đây nên được hiểu thận trọng là:",
    [
      "Ví dụ về nhà nước can thiệp kinh tế khi khủng hoảng",
      "Bằng chứng mọi can thiệp nhà nước đều là độc quyền nhà nước theo nghĩa lý luận",
      "Ví dụ nhà nước không dùng ngân sách",
      "Ví dụ xóa bỏ hoàn toàn khu vực tư nhân"
    ],
    0,
    "TARP là ví dụ thực tế về can thiệp công để ổn định hệ thống tài chính; việc xếp vào “độc quyền nhà nước” phải tiếp tục phân tích bằng khung lý luận của giáo trình."
  ],
  [
    "synthesis",
    "Một trường hợp nhà nước đầu tư hạ tầng, nắm cổ phần tại doanh nghiệp lớn, ban hành thuế - tín dụng và ký hợp đồng mua sắm công. Cách nhận diện phù hợp nhất là:",
    [
      "Sự kết hợp các biểu hiện về sở hữu và điều tiết kinh tế của nhà nước",
      "Chỉ là quan hệ tiêu dùng cá nhân",
      "Chỉ là lao động cụ thể",
      "Sự biến mất của mọi độc quyền"
    ],
    0,
    "Tình huống tích hợp hai nhóm biểu hiện mới: sở hữu nhà nước và điều tiết kinh tế."
  ],
  [
    "positive_role",
    "Vai trò tích cực đầu tiên của chủ nghĩa tư bản được giáo trình nhấn mạnh là:",
    [
      "Thúc đẩy lực lượng sản xuất phát triển nhanh chóng",
      "Xóa bỏ hoàn toàn mọi mâu thuẫn xã hội",
      "Chấm dứt tiến bộ khoa học - công nghệ",
      "Duy trì sản xuất thủ công là chủ yếu"
    ],
    0,
    "Giáo trình nêu chủ nghĩa tư bản làm lực lượng sản xuất phát triển mạnh mẽ."
  ],
  [
    "positive_role",
    "Chuỗi phát triển kỹ thuật nào được giáo trình dùng để mô tả sự phát triển lực lượng sản xuất?",
    [
      "Thủ công → cơ khí → tự động hóa → tin học hóa",
      "Tin học hóa → thủ công → cơ khí",
      "Tự cấp → phong kiến → thủ công",
      "Không có thay đổi kỹ thuật"
    ],
    0,
    "Giáo trình mô tả quá trình chuyển từ kỹ thuật lao động thủ công lên cơ khí, tự động hóa và tin học hóa."
  ],
  [
    "positive_role",
    "Sự phát triển kỹ thuật và công nghệ được giáo trình liên hệ với tác động nào?",
    [
      "Giải phóng sức lao động và nâng cao hiệu quả chinh phục tự nhiên",
      "Xóa bỏ toàn bộ lao động xã hội",
      "Giảm mọi năng suất lao động",
      "Làm sản xuất nhỏ hơn"
    ],
    0,
    "Giáo trình liên hệ phát triển kỹ thuật - công nghệ với giải phóng sức lao động và nâng cao hiệu quả hoạt động của con người."
  ],
  [
    "positive_role",
    "Theo giáo trình, sự xuất hiện của cuộc cách mạng công nghiệp lần thứ tư chuyển nền kinh tế nhân loại vào:",
    [
      "Thời đại kinh tế tri thức",
      "Thời đại tự cấp tự túc",
      "Thời đại không dùng công nghệ",
      "Thời đại chỉ sản xuất thủ công"
    ],
    0,
    "Giáo trình gắn CMCN lần thứ tư với thời đại kinh tế tri thức."
  ],
  [
    "positive_role",
    "Vai trò tích cực thứ hai của chủ nghĩa tư bản là:",
    [
      "Chuyển nền sản xuất nhỏ thành nền sản xuất lớn hiện đại",
      "Xóa bỏ mọi quan hệ hàng hóa",
      "Ngăn cản cải tiến kỹ thuật",
      "Không tạo ra hàng hóa"
    ],
    0,
    "Đây là vai trò tích cực được giáo trình nêu trực tiếp."
  ],
  [
    "positive_role",
    "Sự ra đời của chủ nghĩa tư bản thúc đẩy kinh tế hàng hóa giản đơn chuyển lên:",
    [
      "Kinh tế hàng hóa tư bản chủ nghĩa phát triển",
      "Kinh tế tự nhiên khép kín",
      "Kinh tế không có trao đổi",
      "Kinh tế không có phân công lao động"
    ],
    0,
    "Giáo trình mô tả sự chuyển từ kinh tế hàng hóa giản đơn lên kinh tế hàng hóa tư bản chủ nghĩa phát triển."
  ],
  [
    "positive_role",
    "Nền sản xuất lớn hiện đại do chủ nghĩa tư bản thúc đẩy có đặc điểm nào?",
    [
      "Tập trung quy mô lớn, hiện đại và năng suất cao",
      "Quy mô nhỏ hơn, năng suất thấp hơn",
      "Không dùng kỹ thuật",
      "Chỉ phục vụ tự tiêu dùng"
    ],
    0,
    "Giáo trình mô tả nền sản xuất tập trung quy mô lớn, hiện đại, năng suất cao."
  ],
  [
    "positive_role",
    "Dưới tác động của quy luật kinh tế thị trường, chủ nghĩa tư bản đã kích thích:",
    [
      "Cải tiến kỹ thuật và tăng năng suất lao động",
      "Xóa bỏ mọi đổi mới",
      "Giảm sản lượng hàng hóa xuống bằng 0",
      "Xóa bỏ phân công lao động"
    ],
    0,
    "Giáo trình nêu quy luật thị trường kích thích cải tiến kỹ thuật và tăng năng suất."
  ],
  [
    "positive_role",
    "Kết quả về hàng hóa của quá trình phát triển sản xuất lớn được giáo trình nêu là:",
    [
      "Tạo ra khối lượng sản phẩm hàng hóa khổng lồ, phong phú",
      "Làm hàng hóa biến mất",
      "Chỉ còn một loại hàng hóa",
      "Giảm hoàn toàn nhu cầu xã hội"
    ],
    0,
    "Giáo trình dùng cụm “khối lượng sản phẩm hàng hóa khổng lồ, phong phú”."
  ],
  [
    "positive_role",
    "Vai trò tích cực thứ ba được nêu trong giáo trình là:",
    [
      "Thực hiện xã hội hóa sản xuất",
      "Xóa bỏ hoàn toàn trao đổi",
      "Giảm năng lực hợp tác",
      "Duy trì cô lập sản xuất"
    ],
    0,
    "Chủ nghĩa tư bản thúc đẩy xã hội hóa sản xuất cả về chiều rộng và chiều sâu."
  ],
  [
    "positive_role",
    "Xã hội hóa sản xuất theo giáo trình diễn ra:",
    [
      "Cả về chiều rộng và chiều sâu",
      "Chỉ về chiều rộng",
      "Chỉ về chiều sâu",
      "Không diễn ra"
    ],
    0,
    "Đây là cách giáo trình mô tả mức độ xã hội hóa sản xuất."
  ],
  [
    "positive_role",
    "Nhận định nào phản ánh đúng cách trình bày của giáo trình về vai trò lịch sử của chủ nghĩa tư bản?",
    [
      "Có đóng góp lớn cho phát triển xã hội nhưng cũng có giới hạn lịch sử",
      "Chỉ có tác động tiêu cực và không có đóng góp nào",
      "Không liên quan đến phát triển lực lượng sản xuất",
      "Tồn tại vĩnh viễn không có giới hạn"
    ],
    0,
    "Giáo trình trình bày đồng thời mặt tích cực và các giới hạn lịch sử."
  ],
  [
    "positive_role",
    "Theo giáo trình, quan hệ sản xuất tư bản chủ nghĩa hiện nay vẫn có:",
    [
      "Sự phù hợp nhất định với trình độ phát triển cao của lực lượng sản xuất",
      "Sự phù hợp tuyệt đối và vĩnh viễn",
      "Không có bất kỳ sự phù hợp nào",
      "Khả năng xóa bỏ mọi mâu thuẫn ngay lập tức"
    ],
    0,
    "Giáo trình nêu sự phù hợp nhất định, giúp chủ nghĩa tư bản thích nghi trong điều kiện lịch sử mới."
  ],
  [
    "positive_role",
    "Sự phù hợp nhất định của quan hệ sản xuất tư bản chủ nghĩa với lực lượng sản xuất có ý nghĩa gì theo giáo trình?",
    [
      "Giúp chủ nghĩa tư bản vẫn thích nghi và tiếp tục phát triển trong điều kiện mới",
      "Chứng minh không còn giới hạn lịch sử",
      "Làm mọi độc quyền biến mất",
      "Chấm dứt điều tiết của nhà nước"
    ],
    0,
    "Giáo trình dùng ý này để giải thích vì sao chủ nghĩa tư bản vẫn tiếp tục phát triển."
  ],
  [
    "positive_role",
    "Một doanh nghiệp đưa robot và hệ thống tự động vào dây chuyền, làm năng suất tăng mạnh. Tình huống minh họa gần nhất cho:",
    [
      "Sự phát triển lực lượng sản xuất nhờ kỹ thuật - công nghệ",
      "Sự biến mất của sản xuất hàng hóa",
      "Sản xuất tự cấp tự túc",
      "Sự xóa bỏ hoàn toàn lao động xã hội"
    ],
    0,
    "Đây là ví dụ vận dụng nội dung về cơ khí hóa, tự động hóa và tăng năng suất."
  ],
  [
    "positive_role",
    "Một cơ sở sản xuất gia đình được mở rộng thành nhà máy hiện đại, sản xuất số lượng lớn và phân phối rộng. Đây minh họa trực tiếp cho:",
    [
      "Chuyển sản xuất nhỏ thành sản xuất lớn hiện đại",
      "Xóa bỏ sản xuất hàng hóa",
      "Giảm năng suất lao động",
      "Xóa bỏ xã hội hóa sản xuất"
    ],
    0,
    "Tình huống bám sát vai trò chuyển nền sản xuất nhỏ thành sản xuất lớn hiện đại."
  ],
  [
    "positive_role",
    "Nhiều doanh nghiệp ở các địa phương khác nhau cùng tham gia các công đoạn nghiên cứu, sản xuất, vận chuyển và phân phối một sản phẩm. Hiện tượng này phù hợp nhất với:",
    [
      "Xu hướng xã hội hóa sản xuất",
      "Sản xuất tự cấp tự túc",
      "Xóa bỏ phân công lao động",
      "Tách rời hoàn toàn các chủ thể"
    ],
    0,
    "Đây là câu vận dụng để nhận diện sự liên kết và phụ thuộc lẫn nhau trong sản xuất xã hội hóa."
  ],
  [
    "positive_role",
    "Một doanh nghiệp cải tiến công nghệ để giảm chi phí và tăng năng suất trước sức ép cạnh tranh. Câu nào phù hợp nhất?",
    [
      "Cạnh tranh thị trường có thể kích thích cải tiến kỹ thuật",
      "Cạnh tranh luôn làm công nghệ ngừng phát triển",
      "Năng suất không liên quan kỹ thuật",
      "Cải tiến kỹ thuật không làm thay đổi sản xuất"
    ],
    0,
    "Câu vận dụng bám vào nhận định về tác động kích thích cải tiến kỹ thuật và tăng năng suất."
  ],
  [
    "positive_role",
    "Các công nghệ như AI, dữ liệu lớn, IoT và in 3D thường được nhắc đến khi nói về Cách mạng công nghiệp lần thứ tư. Trong bài học, ví dụ này giúp liên hệ với:",
    [
      "Vai trò thúc đẩy lực lượng sản xuất và kinh tế tri thức",
      "Sự trở lại hoàn toàn của lao động thủ công",
      "Xóa bỏ khoa học - công nghệ",
      "Không có thay đổi về năng suất"
    ],
    0,
    "Đây là liên hệ thực tế với lập luận của giáo trình về CMCN lần thứ tư và kinh tế tri thức."
  ],
  [
    "limits",
    "Nguồn gốc sâu xa của các giới hạn lịch sử của chủ nghĩa tư bản là mâu thuẫn giữa:",
    [
      "Tính chất xã hội hóa cao của lực lượng sản xuất và chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất",
      "Người mua và người bán trong một giao dịch đơn lẻ",
      "Nông nghiệp và công nghiệp",
      "Tiết kiệm và tiêu dùng cá nhân"
    ],
    0,
    "Đây là mâu thuẫn cơ bản được giáo trình xác định."
  ],
  [
    "limits",
    "Cơ sở kinh tế của chủ nghĩa tư bản được giáo trình xác định là:",
    [
      "Chế độ chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất",
      "Sở hữu cộng đồng tuyệt đối về mọi tư liệu sản xuất",
      "Không tồn tại sở hữu tư liệu sản xuất",
      "Chỉ sở hữu tiêu dùng cá nhân"
    ],
    0,
    "Giáo trình gắn các giới hạn lịch sử với chế độ chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất."
  ],
  [
    "limits",
    "Trong mô tả của giáo trình, giai cấp công nhân cơ bản không có tư liệu sản xuất nên phải:",
    [
      "Bán sức lao động cho nhà tư bản",
      "Quyết định toàn bộ phân phối sản phẩm xã hội",
      "Nắm quyền sở hữu mọi tập đoàn",
      "Không tham gia hoạt động kinh tế"
    ],
    0,
    "Giáo trình nêu công nhân phải bán sức lao động và bị bóc lột giá trị thặng dư."
  ],
  [
    "limits",
    "Hệ quả đối với công nhân được giáo trình nêu sau việc bán sức lao động là:",
    [
      "Bị bóc lột giá trị thặng dư",
      "Tự động sở hữu tư liệu sản xuất",
      "Tự động quyết định giá cả độc quyền",
      "Không còn quan hệ với sản xuất"
    ],
    0,
    "Đây là cách giáo trình mô tả quan hệ giữa công nhân và nhà tư bản."
  ],
  [
    "limits",
    "Trong chủ nghĩa tư bản hiện đại, tư liệu sản xuất tập trung chủ yếu trong tay:",
    [
      "Các nhà tư bản, đặc biệt là tập đoàn tư bản độc quyền",
      "Mọi người lao động với tỷ lệ ngang nhau",
      "Chỉ người tiêu dùng",
      "Các hộ tự cấp tự túc"
    ],
    0,
    "Giáo trình nhấn mạnh sự tập trung trong tay nhà tư bản và đặc biệt là tập đoàn tư bản độc quyền."
  ],
  [
    "limits",
    "Việc tư liệu sản xuất tập trung trong tay tập đoàn độc quyền dẫn đến khả năng nào?",
    [
      "Chi phối phân phối sản phẩm xã hội vì lợi ích thiểu số",
      "Phân phối hoàn toàn đồng đều cho mọi người",
      "Xóa bỏ mọi lợi ích riêng",
      "Chấm dứt hoàn toàn cạnh tranh"
    ],
    0,
    "Giáo trình nhận định nhóm này chi phối phân phối sản phẩm xã hội vì lợi ích thiểu số giai cấp tư sản."
  ],
  [
    "limits",
    "Để đạt lợi nhuận độc quyền cao, tập đoàn độc quyền có thể:",
    [
      "Áp đặt giá bán cao và giá mua thấp",
      "Luôn giảm giá bán xuống bằng 0",
      "Không quan tâm đến sản lượng",
      "Chia toàn bộ lợi nhuận cho người tiêu dùng"
    ],
    0,
    "Giáo trình nêu việc áp đặt giá bán cao, giá mua thấp."
  ],
  [
    "limits",
    "Ngoài áp đặt giá bán cao và giá mua thấp, các tập đoàn độc quyền có thể:",
    [
      "Hạn chế sản lượng hàng hóa",
      "Tự động mở rộng sản lượng vô hạn",
      "Xóa bỏ toàn bộ thị trường",
      "Không cần quan tâm lợi nhuận"
    ],
    0,
    "Hạn chế sản lượng là một biểu hiện được giáo trình nêu."
  ],
  [
    "limits",
    "Việc áp đặt giá và hạn chế sản lượng có thể tạo ra:",
    [
      "Cung - cầu giả tạo và thiệt hại cho người tiêu dùng, xã hội",
      "Cạnh tranh hoàn hảo tự động",
      "Phân phối hoàn toàn công bằng",
      "Xóa bỏ mọi chênh lệch thu nhập"
    ],
    0,
    "Giáo trình gắn hành vi độc quyền với cung - cầu giả tạo và thiệt hại xã hội."
  ],
  [
    "limits",
    "Mặc dù có nguồn lực lớn, độc quyền có thể kìm hãm tiến bộ kỹ thuật vì:",
    [
      "Nghiên cứu và sáng chế chỉ được làm khi vị thế độc quyền không bị lung lay",
      "Không hề có nguồn lực tài chính",
      "Kỹ thuật không liên quan sản xuất",
      "Mọi sáng chế đều bị cấm"
    ],
    0,
    "Giáo trình cho rằng lợi ích độc quyền có thể làm hoạt động sáng chế chỉ diễn ra khi vị thế độc quyền được bảo đảm."
  ],
  [
    "limits",
    "Xu thế trì trệ hoặc kìm hãm của nền kinh tế được giáo trình giải thích chủ yếu do:",
    [
      "Sự thống trị của độc quyền tạo nhân tố ngăn cản tiến bộ kỹ thuật và phát triển sản xuất",
      "Mọi người lao động không muốn sản xuất",
      "Không còn bất kỳ công nghệ nào",
      "Chỉ do thời tiết"
    ],
    0,
    "Đây là nhận định trực tiếp của giáo trình về xu thế kìm hãm."
  ],
  [
    "limits",
    "Khi độc quyền nhà nước bị chi phối bởi nhóm lợi ích cục bộ hoặc độc quyền tư nhân chi phối quan hệ kinh tế - xã hội, hệ quả nào có thể xảy ra?",
    [
      "Tăng phân hóa giàu - nghèo",
      "Xóa bỏ hoàn toàn bất bình đẳng",
      "Tăng phân phối đồng đều tự động",
      "Chấm dứt mọi xung đột lợi ích"
    ],
    0,
    "Giáo trình nêu khả năng làm tăng sự phân hóa giàu - nghèo."
  ],
  [
    "limits",
    "Theo giáo trình, chủ nghĩa tư bản đã và đang tiếp tục tham gia gây ra:",
    [
      "Chiến tranh và xung đột ở nhiều nơi trên thế giới",
      "Sự biến mất hoàn toàn của xung đột",
      "Hòa bình tuyệt đối không điều kiện",
      "Chấm dứt cạnh tranh quốc tế"
    ],
    0,
    "Đây là một giới hạn lịch sử được giáo trình nêu."
  ],
  [
    "limits",
    "Giáo trình giải thích các cường quốc tư bản đã ra sức chiếm lĩnh thuộc địa và thị trường chủ yếu vì:",
    [
      "Nhu cầu tồn tại và phát triển",
      "Muốn giảm mọi ảnh hưởng quốc tế",
      "Không quan tâm đến thị trường",
      "Muốn xóa bỏ phân chia lãnh thổ"
    ],
    0,
    "Giáo trình liên hệ việc chiếm lĩnh thuộc địa, thị trường với sự tồn tại và phát triển của các cường quốc tư bản."
  ],
  [
    "limits",
    "Tại sao sự phân chia lãnh thổ và thị trường thế giới có thể dẫn tới đấu tranh đòi phân chia lại?",
    [
      "Do phát triển không đều về kinh tế và chính trị giữa các nước tư bản",
      "Do mọi nước phát triển hoàn toàn giống nhau",
      "Do không còn bất kỳ cạnh tranh nào",
      "Do thị trường không tồn tại"
    ],
    0,
    "Giáo trình nêu sự phát triển không đều là một căn nguyên dẫn tới đấu tranh đòi phân chia lại."
  ],
  [
    "limits",
    "Theo giáo trình, các cuộc chạy đua vũ trang và chiến tranh lạnh có thể gây hậu quả nào?",
    [
      "Kéo tụt lùi kinh tế thế giới trong nhiều năm",
      "Tự động nâng năng suất toàn cầu",
      "Xóa bỏ cạnh tranh thị trường",
      "Tạo phân phối hoàn toàn bình đẳng"
    ],
    0,
    "Giáo trình cho rằng các hiện tượng này đã kéo tụt lùi kinh tế thế giới hàng chục năm."
  ],
  [
    "limits",
    "Việc nguy cơ chiến tranh thế giới bị đẩy lùi vào đầu thế kỷ XXI có đồng nghĩa với:",
    [
      "Chiến tranh bị loại trừ hoàn toàn",
      "Chiến tranh không bị loại trừ hoàn toàn",
      "Mọi xung đột kinh tế đã chấm dứt",
      "Không còn cạnh tranh giữa các cường quốc"
    ],
    1,
    "Giáo trình nhấn mạnh nguy cơ bị đẩy lùi không có nghĩa chiến tranh bị loại trừ hoàn toàn."
  ],
  [
    "limits",
    "Nhận định nào phản ánh đúng quan điểm của giáo trình về quan hệ sản xuất tư bản chủ nghĩa hiện đại?",
    [
      "Có thể điều chỉnh và thích nghi nhất định nhưng không xóa bỏ mâu thuẫn cơ bản",
      "Đã xóa bỏ hoàn toàn mâu thuẫn cơ bản",
      "Không còn liên quan đến sở hữu tư liệu sản xuất",
      "Tự động chuyển thành sản xuất tự cấp"
    ],
    0,
    "Giáo trình thừa nhận khả năng thích nghi nhất định, đồng thời nêu các giới hạn lịch sử không tự vượt qua được."
  ],
  [
    "limits",
    "Kết luận lý luận của giáo trình về tương lai lịch sử của chủ nghĩa tư bản là:",
    [
      "Không tồn tại vĩnh viễn; đến trình độ nhất định sẽ bị thay thế bởi hình thái tiến bộ hơn",
      "Tồn tại vĩnh viễn không thay đổi",
      "Không có bất kỳ mâu thuẫn nào",
      "Tự động xóa bỏ mọi độc quyền"
    ],
    0,
    "Đây là kết luận được nêu ở phần cuối Chương 4."
  ],
  [
    "limits",
    "Một nhóm doanh nghiệp thỏa thuận giữ giá bán cao, ép giá mua đầu vào thấp và giảm sản lượng. Tình huống này minh họa:",
    [
      "Hành vi nhằm thu lợi nhuận độc quyền cao",
      "Cạnh tranh hoàn hảo",
      "Xóa bỏ khả năng thao túng giá",
      "Phân phối công bằng tự động"
    ],
    0,
    "Tình huống khớp với mô tả về giá cả độc quyền và hạn chế sản lượng."
  ],
  [
    "limits",
    "Một tập đoàn giữ bằng sáng chế nhưng trì hoãn triển khai công nghệ mới vì lo làm suy yếu sản phẩm đang độc quyền. Đây phù hợp nhất với:",
    [
      "Khả năng độc quyền kìm hãm tiến bộ kỹ thuật",
      "Vai trò giải phóng sức lao động",
      "Xóa bỏ lợi nhuận độc quyền",
      "Cạnh tranh hoàn hảo"
    ],
    0,
    "Đây là tình huống vận dụng ý độc quyền chỉ ưu tiên sáng chế khi vị thế của mình được bảo đảm."
  ],
  [
    "real_world",
    "Bộ Tư pháp Hoa Kỳ cho biết tòa án liên bang đã kết luận Google vi phạm luật chống độc quyền khi độc quyền hóa một số thị trường quảng cáo web mở. Bài học phù hợp nhất cho quiz là:",
    [
      "Sức mạnh thị trường số có thể trở thành đối tượng của kiểm soát cạnh tranh",
      "Mọi nền tảng số đều tự động là độc quyền nhà nước",
      "Không cần luật cạnh tranh trong thị trường số",
      "Quảng cáo số không liên quan đến cạnh tranh"
    ],
    0,
    "Đây là ví dụ thực tế về việc cơ quan công quyền áp dụng luật cạnh tranh trước hành vi bị xem là độc quyền hóa."
  ],
  [
    "real_world",
    "EU DMA yêu cầu các nền tảng “gatekeeper” tuân thủ nghĩa vụ và điều cấm nhằm bảo đảm thị trường số mở, công bằng và có thể cạnh tranh. Điều này thể hiện:",
    [
      "Phản ứng quản lý trước quyền lực thị trường của nền tảng lớn",
      "Xóa bỏ mọi công nghệ số",
      "Chấm dứt mọi cạnh tranh giữa doanh nghiệp",
      "Sản xuất hàng hóa không cần pháp luật"
    ],
    0,
    "Câu hỏi dùng DMA như một ví dụ thực tế về kiểm soát sức mạnh “gatekeeper”."
  ],
  [
    "real_world",
    "Trong vụ Google Android, Ủy ban châu Âu đã xử phạt Google vì các hạn chế bị xác định là trái quy tắc cạnh tranh. Tình huống này gần nhất với chủ đề:",
    [
      "Kiểm soát hành vi lạm dụng vị thế thống lĩnh trên thị trường",
      "Xóa bỏ hoàn toàn mọi hệ điều hành",
      "Sản xuất tự cấp tự túc",
      "Chấm dứt vai trò của công nghệ"
    ],
    0,
    "Đây là ví dụ thực tế về thực thi cạnh tranh đối với hành vi bị cho là lạm dụng vị thế thống lĩnh."
  ],
  [
    "real_world",
    "OECD nêu rằng doanh nghiệp nhà nước niêm yết có thể có sở hữu hỗn hợp, trong đó nhà nước là một chủ sở hữu cùng với các nhóm khác. Ví dụ này giúp hiểu rằng:",
    [
      "Sở hữu nhà nước có thể tồn tại dưới dạng nắm cổ phần, không nhất thiết 100% vốn",
      "Sở hữu nhà nước chỉ tồn tại khi nhà nước nắm 100% vốn",
      "Doanh nghiệp không thể có nhiều chủ sở hữu",
      "Ngân sách không liên quan đến sở hữu"
    ],
    0,
    "Câu hỏi thực tế bổ trợ cho ý trong giáo trình về cổ phần nhà nước tại ngân hàng và công ty lớn."
  ],
  [
    "real_world",
    "TARP được Bộ Tài chính Hoa Kỳ thiết lập để ổn định hệ thống tài chính trong khủng hoảng 2008. Về mặt phân tích, đây là ví dụ phù hợp nhất của:",
    [
      "Vai trò can thiệp kinh tế của nhà nước trong khủng hoảng",
      "Việc nhà nước không dùng bất kỳ công cụ nào",
      "Sự biến mất của khu vực tài chính",
      "Cạnh tranh hoàn hảo tuyệt đối"
    ],
    0,
    "TARP là ví dụ lịch sử về chương trình can thiệp công để ổn định hệ thống tài chính."
  ],
  [
    "critical",
    "Khi dùng một vụ việc thực tế để trả lời bài học, cách làm nào đúng nhất?",
    [
      "Nêu rõ đó là ví dụ minh họa, sau đó đối chiếu với tiêu chí lý luận của giáo trình",
      "Khẳng định mọi vụ việc đều hoàn toàn trùng khớp khái niệm lý luận",
      "Chỉ kể tin tức mà không giải thích khái niệm",
      "Bỏ qua hoàn toàn nguồn chính thống"
    ],
    0,
    "Câu hỏi giúp phân biệt giữa tình huống thực tế và kết luận lý luận."
  ],
  [
    "synthesis",
    "Có mâu thuẫn không khi giáo trình vừa nêu chủ nghĩa tư bản thúc đẩy khoa học - công nghệ, vừa nêu độc quyền có thể kìm hãm tiến bộ kỹ thuật?",
    [
      "Không; hai nhận định nói về các khuynh hướng và điều kiện khác nhau",
      "Có; một trong hai luôn sai",
      "Không liên quan đến nhau",
      "Chỉ vì công nghệ không tác động kinh tế"
    ],
    0,
    "Vai trò thúc đẩy phát triển thuộc mặt tích cực; sự kìm hãm là giới hạn có thể xuất hiện do lợi ích độc quyền."
  ],
  [
    "synthesis",
    "Nhà nước đầu tư nghiên cứu nền tảng rủi ro cao, sau đó doanh nghiệp tư nhân khai thác ứng dụng sinh lời. Tình huống này dùng để thảo luận tốt nhất về:",
    [
      "Mối quan hệ giữa đầu tư công, sở hữu/điều tiết nhà nước và lợi ích doanh nghiệp",
      "Lao động cụ thể tạo ra giá trị sử dụng",
      "Tiền tệ không có chức năng",
      "Sản xuất tự cấp không cần trao đổi"
    ],
    0,
    "Tình huống liên hệ biểu hiện mới về sở hữu nhà nước với lợi ích doanh nghiệp."
  ],
  [
    "synthesis",
    "Một nền tảng có khả năng quyết định điều kiện tiếp cận khách hàng cho nhiều doanh nghiệp nhỏ. Câu hỏi phân tích phù hợp nhất là:",
    [
      "Nền tảng có tạo ra quyền lực thị trường cần được đánh giá và kiểm soát hay không?",
      "Nền tảng có làm mọi cạnh tranh biến mất ngay lập tức hay không?",
      "Có nên bỏ qua mọi quy tắc cạnh tranh?",
      "Có phải mọi công nghệ đều xấu?"
    ],
    0,
    "Đây là câu hỏi mở theo hướng nhận diện quyền lực thị trường, không kết luận sẵn mọi nền tảng là độc quyền."
  ],
  [
    "synthesis",
    "Kết luận nào khái quát đúng nhất về vai trò lịch sử của chủ nghĩa tư bản theo giáo trình?",
    [
      "Đã thúc đẩy lực lượng sản xuất, sản xuất lớn và xã hội hóa sản xuất; đồng thời có các giới hạn lịch sử bắt nguồn từ mâu thuẫn cơ bản",
      "Chỉ tạo ra tác động tiêu cực và không có đóng góp phát triển",
      "Đã xóa bỏ hoàn toàn mọi mâu thuẫn xã hội",
      "Tồn tại vĩnh viễn vì luôn tự khắc phục mọi giới hạn"
    ],
    0,
    "Đây là tổng hợp của hai phần: vai trò tích cực và giới hạn lịch sử của chủ nghĩa tư bản."
  ]
].map(([category, question, options, answer, explanation], index) => ({
  id: index + 1,
  category,
  question,
  options,
  answer,
  explanation
}));

const CATEGORIES = {
  personnel: "Cơ chế quan hệ nhân sự",
  state_ownership: "Sở hữu nhà nước",
  regulation: "Điều tiết kinh tế",
  positive_role: "Vai trò tích cực",
  limits: "Giới hạn lịch sử",
  real_world: "Tình huống thực tế",
  critical: "Tư duy phản biện",
  synthesis: "Tổng hợp"
};

const CATEGORY_THEORY = {
  personnel: "Biểu hiện mới về quan hệ nhân sự thể hiện ở cơ chế thỏa hiệp, phân chia quyền lực và thể chế đa nguyên trong bộ máy nhà nước tư sản.",
  state_ownership: "Sở hữu nhà nước trong chủ nghĩa tư bản hiện đại gồm ngân sách, dự trữ, cổ phần nhà nước và đầu tư công vào hạ tầng, nghiên cứu, nhu cầu xã hội.",
  regulation: "Điều tiết kinh tế của nhà nước tư sản dùng pháp luật, ngân sách, chính sách tài chính - tiền tệ và các công cụ can thiệp để ổn định, hỗ trợ tái sản xuất tư bản.",
  positive_role: "Chủ nghĩa tư bản có vai trò lịch sử trong thúc đẩy lực lượng sản xuất, sản xuất lớn, thị trường và xã hội hóa sản xuất.",
  limits: "Giới hạn lịch sử bắt nguồn từ mâu thuẫn cơ bản của chủ nghĩa tư bản, độc quyền, bất bình đẳng, khủng hoảng và xung đột phân chia thị trường.",
  real_world: "Tình huống thực tế giúp liên hệ lý thuyết với kiểm soát cạnh tranh, nền tảng số, doanh nghiệp nhà nước và can thiệp kinh tế trong khủng hoảng.",
  critical: "Tư duy phản biện yêu cầu phân biệt ví dụ minh họa với kết luận lý luận, đối chiếu sự kiện với tiêu chí trong giáo trình.",
  synthesis: "Tổng hợp giúp nối phần biểu hiện mới của độc quyền nhà nước với vai trò tích cực và giới hạn lịch sử của chủ nghĩa tư bản."
};

const STUDY_PATH = ["personnel", "state_ownership", "regulation", "positive_role", "limits"];
const TEST_DURATION_MINUTES = 60;

const MODES = [
  { id: "practice", name: "Luyện tập tổng hợp", desc: "Làm 10 câu ngẫu nhiên về Chương 4: cạnh tranh, độc quyền và chủ nghĩa tư bản hiện đại.", pool: Object.keys(CATEGORIES) },
  { id: "case", name: "Phân tích tình huống", desc: "Đi theo 5 bước nhận diện: nhân sự, sở hữu nhà nước, điều tiết, vai trò tích cực và giới hạn lịch sử.", pool: Object.keys(CATEGORIES) },
  { id: "test", name: `Kiểm tra ${TEST_DURATION_MINUTES} phút`, desc: "Làm toàn bộ câu trong bộ đã chọn với đồng hồ đếm ngược để tự đánh giá mức độ nắm kiến thức.", pool: Object.keys(CATEGORIES), timed: true }
];

const CASES = [
  {
    title: "Hồ sơ nền tảng số",
    claim: "Một nền tảng lớn bị cơ quan cạnh tranh xem xét vì có khả năng kiểm soát điều kiện tiếp cận thị trường.",
    context: "Hãy liên hệ quyền lực thị trường, độc quyền và vai trò điều tiết của nhà nước trong kinh tế tư bản hiện đại."
  },
  {
    title: "Hồ sơ đầu tư công",
    claim: "Nhà nước tài trợ nghiên cứu nền tảng rủi ro cao, sau đó doanh nghiệp tư nhân khai thác ứng dụng sinh lời.",
    context: "Tình huống này gợi mối quan hệ giữa sở hữu/đầu tư nhà nước và lợi ích của khu vực tư nhân."
  },
  {
    title: "Hồ sơ khủng hoảng tài chính",
    claim: "Chính phủ dùng chương trình cứu trợ để ổn định hệ thống tài chính khi khủng hoảng lan rộng.",
    context: "Cần nhận diện công cụ điều tiết, mục tiêu ổn định và giới hạn của cơ chế thị trường tư bản chủ nghĩa."
  },
  {
    title: "Hồ sơ liên minh quyền lực",
    claim: "Nhiều nhóm lợi ích lớn thỏa hiệp cùng tham gia quá trình ra quyết định để không bên nào chi phối tuyệt đối.",
    context: "Đây là điểm nối giữa cơ chế quan hệ nhân sự và biểu hiện mới của độc quyền nhà nước."
  }
];

const CASE_STEPS = [
  {
    title: "Bước 1: Nhận diện quan hệ nhân sự",
    category: "personnel",
    question: "Khi nhiều thế lực tư bản độc quyền cùng thỏa hiệp và phân chia quyền lực, nội dung nào được minh họa rõ nhất?",
    options: ["Cơ chế thỏa hiệp trong bộ máy nhà nước", "Xóa bỏ hoàn toàn độc quyền", "Sản xuất tự cấp tự túc", "Cạnh tranh hoàn hảo"],
    answer: 0,
    explanation: "Đây là biểu hiện mới về quan hệ nhân sự: các thế lực cùng tồn tại, thỏa hiệp và phân chia quyền lực."
  },
  {
    title: "Bước 2: Xem xét sở hữu nhà nước",
    category: "state_ownership",
    question: "Việc nhà nước nắm cổ phần hoặc dùng ngân sách cho hạ tầng, nghiên cứu cơ bản thuộc nhóm biểu hiện nào?",
    options: ["Sở hữu và đầu tư nhà nước", "Tư nhân hóa tuyệt đối", "Kinh tế tự nhiên", "Xóa bỏ ngân sách"],
    answer: 0,
    explanation: "Sở hữu nhà nước có thể tồn tại qua cổ phần, ngân sách, dự trữ và đầu tư công."
  },
  {
    title: "Bước 3: Phân tích điều tiết kinh tế",
    category: "regulation",
    question: "Khi nhà nước dùng chính sách tài chính - tiền tệ để ổn định kinh tế, đó là biểu hiện của điều gì?",
    options: ["Điều tiết kinh tế của nhà nước tư sản", "Nhà nước rút hoàn toàn khỏi thị trường", "Không còn khủng hoảng", "Xóa bỏ mọi doanh nghiệp"],
    answer: 0,
    explanation: "Nhà nước tư sản hiện đại can thiệp bằng nhiều công cụ để ổn định và hỗ trợ tái sản xuất tư bản."
  },
  {
    title: "Bước 4: Đánh giá vai trò tích cực",
    category: "positive_role",
    question: "Vai trò lịch sử tích cực nổi bật của chủ nghĩa tư bản là gì?",
    options: ["Thúc đẩy lực lượng sản xuất và sản xuất lớn", "Loại bỏ mọi mâu thuẫn xã hội", "Chấm dứt cạnh tranh", "Tồn tại vĩnh viễn không đổi"],
    answer: 0,
    explanation: "Chủ nghĩa tư bản đã thúc đẩy sản xuất lớn, thị trường và xã hội hóa sản xuất."
  },
  {
    title: "Bước 5: Nhận diện giới hạn lịch sử",
    category: "limits",
    question: "Kết luận nào đúng nhất về chủ nghĩa tư bản theo giáo trình?",
    options: ["Có vai trò phát triển nhưng vẫn mang giới hạn lịch sử", "Đã tự xóa bỏ mọi mâu thuẫn", "Không có độc quyền", "Chỉ tạo tác động tiêu cực"],
    answer: 0,
    explanation: "Cần nhìn cả mặt tích cực và giới hạn lịch sử bắt nguồn từ mâu thuẫn cơ bản của chủ nghĩa tư bản."
  }
];

const app = document.querySelector("#app");
const playerNameView = document.querySelector("#playerNameView");
const roleView = document.querySelector("#roleView");
const playsView = document.querySelector("#playsView");
const lastScoreView = document.querySelector("#lastScoreView");
const themeToggle = document.querySelector("#themeToggle");
const adminNav = document.querySelector("#adminNav");

let profile = load("truthProfile", { name: "Khách", className: "", role: "player", plays: 0, lastScore: 0 });
let leaderboard = load("truthLeaderboard", []);
let selectedMode = MODES[0].id;
let selectedCategory = "all";
let quiz = null;

function hasFirebaseConfig() {
  const config = firebaseSettings?.config || {};
  return Boolean(
    firebaseSettings?.enabled &&
    config.apiKey &&
    config.projectId &&
    !String(config.apiKey).includes("YOUR_") &&
    !String(config.projectId).includes("YOUR_")
  );
}

async function initFirebase() {
  if (!hasFirebaseConfig()) return;

  try {
    const [appModule, firestoreModule, authModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js")
    ]);

    firebaseApi = firestoreModule;
    authApi = authModule;
    const appInstance = appModule.initializeApp(firebaseSettings.config);
    db = firestoreModule.getFirestore(appInstance);
    auth = authModule.getAuth(appInstance);
    authModule.onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      try {
        if (user) {
          await loadCloudProfile(user);
        } else {
          profile = load("truthProfile", { name: "Khách", className: "", role: "player", plays: 0, lastScore: 0 });
        }
      } catch (error) {
        console.warn("Could not load cloud profile, using local profile.", error);
        profile = load("truthProfile", getDefaultProfile(user));
      }
      syncHud();
      if (currentView === "profile") renderProfile();
      if (currentView === "home") renderHome();
    });
  } catch (error) {
    console.warn("Firebase init failed, using local fallback.", error);
    db = null;
    auth = null;
    authApi = null;
  }
}

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getDefaultProfile(user = null) {
  return {
    name: user?.displayName || user?.email?.split("@")[0] || "Khách",
    className: "",
    email: user?.email || "",
    role: "player",
    plays: 0,
    lastScore: 0
  };
}

function isAdmin() {
  return profile.role === "admin";
}

async function loadCloudProfile(user) {
  if (!db || !firebaseApi || !user) return;

  const ref = firebaseApi.doc(db, "users", user.uid);
  const snapshot = await firebaseApi.getDoc(ref);

  if (snapshot.exists()) {
    profile = { ...getDefaultProfile(user), ...snapshot.data(), email: user.email || "" };
  } else {
    profile = getDefaultProfile(user);
    await firebaseApi.setDoc(ref, {
      ...profile,
      createdAt: firebaseApi.serverTimestamp(),
      updatedAt: firebaseApi.serverTimestamp()
    });
  }
}

async function saveCloudProfile() {
  if (!db || !firebaseApi || !currentUser) {
    save("truthProfile", profile);
    return;
  }

  try {
    await firebaseApi.setDoc(
      firebaseApi.doc(db, "users", currentUser.uid),
      {
        name: profile.name,
        className: profile.className,
        email: currentUser.email || profile.email || "",
        plays: profile.plays,
        lastScore: profile.lastScore || 0,
        updatedAt: firebaseApi.serverTimestamp()
      },
      { merge: true }
    );

    if (authApi && auth && auth.currentUser && auth.currentUser.displayName !== profile.name) {
      await authApi.updateProfile(auth.currentUser, { displayName: profile.name });
    }
  } catch (error) {
    console.warn("Could not save cloud profile, using local fallback.", error);
    save("truthProfile", profile);
  }
}

function normalizeQuestion(question, index = 0) {
  return {
    id: question.id || `cloud-${Date.now()}-${index}`,
    category: question.category,
    question: question.question,
    options: question.options,
    answer: Number(question.answer),
    explanation: question.explanation || "Hãy đối chiếu đáp án với khái niệm lý thuyết liên quan.",
    source: question.source || "local"
  };
}

async function loadCloudQuestions() {
  questionBank = QUESTION_BANK.map((item) => ({ ...item, source: "local" }));

  if (!db || !firebaseApi) return;

  try {
    const snapshot = await firebaseApi.getDocs(
      firebaseApi.query(firebaseApi.collection(db, "questions"), firebaseApi.limit(80))
    );
    const cloudQuestions = snapshot.docs
      .map((doc, index) => normalizeQuestion({ id: doc.id, ...doc.data(), source: "cloud" }, index))
      .filter((item) => item.category && item.question && Array.isArray(item.options) && item.options.length === 4);
    questionBank = [...questionBank, ...cloudQuestions];
  } catch (error) {
    console.warn("Could not load cloud questions, using local bank.", error);
  }
}

async function saveCloudQuestion(question) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.addDoc(firebaseApi.collection(db, "questions"), {
    ...question,
    createdBy: currentUser.uid,
    createdAt: firebaseApi.serverTimestamp()
  });
  await loadCloudQuestions();
}

async function updateCloudQuestion(questionId, question) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.updateDoc(firebaseApi.doc(db, "questions", questionId), {
    ...question,
    updatedAt: firebaseApi.serverTimestamp()
  });
  await loadCloudQuestions();
}

async function deleteCloudQuestion(questionId) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.deleteDoc(firebaseApi.doc(db, "questions", questionId));
  await loadCloudQuestions();
}

async function saveLeaderboardResult(result) {
  const normalizedResult = {
    name: result.name.slice(0, 28),
    className: (profile.className || "").slice(0, 36),
    userId: currentUser?.uid || "local",
    mode: result.mode,
    score: result.score,
    total: result.total,
    percent: result.percent,
    rank: result.rank,
    elapsed: result.elapsed,
    date: result.date,
    createdAtMs: Date.now()
  };

  leaderboard.unshift(normalizedResult);
  leaderboard = sortResultEntries(leaderboard).slice(0, 20);
  save("truthLeaderboard", leaderboard);

}

async function saveAttempt(result) {
  const attempt = {
    userId: currentUser?.uid || "local",
    name: result.name.slice(0, 28),
    mode: result.mode,
    score: result.score,
    total: result.total,
    percent: result.percent,
    rank: result.rank,
    elapsed: result.elapsed,
    date: result.date,
    categoryStats: getCategoryStats(quiz.answers),
    createdAtMs: Date.now()
  };

  if (db && firebaseApi && currentUser) {
    try {
      await firebaseApi.addDoc(firebaseApi.collection(db, "users", currentUser.uid, "attempts"), {
        ...attempt,
        createdAt: firebaseApi.serverTimestamp()
      });
      return;
    } catch (error) {
      console.warn("Could not save cloud attempt, using local fallback.", error);
    }
  }

  const localAttempts = load("truthAttempts", []);
  localAttempts.unshift(attempt);
  save("truthAttempts", localAttempts.slice(0, 30));
}

async function getAttemptEntries() {
  if (db && firebaseApi && currentUser) {
    try {
      const snapshot = await firebaseApi.getDocs(
        firebaseApi.query(
          firebaseApi.collection(db, "users", currentUser.uid, "attempts"),
          firebaseApi.orderBy("createdAtMs", "desc"),
          firebaseApi.limit(12)
        )
      );
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn("Could not load cloud attempts, using local fallback.", error);
    }
  }

  return load("truthAttempts", []).slice(0, 12);
}

async function getAdminData() {
  if (!db || !firebaseApi || !isAdmin()) {
    return { users: [], questions: [] };
  }

  const [usersSnapshot, questionsSnapshot] = await Promise.all([
    firebaseApi.getDocs(
      firebaseApi.query(firebaseApi.collection(db, "users"), firebaseApi.limit(100))
    ),
    firebaseApi.getDocs(
      firebaseApi.query(firebaseApi.collection(db, "questions"), firebaseApi.limit(50))
    )
  ]);

  return {
    users: usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    questions: questionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  };
}

async function updateUserRole(userId, role) {
  if (!db || !firebaseApi || !isAdmin()) return;
  await firebaseApi.updateDoc(firebaseApi.doc(db, "users", userId), {
    role,
    updatedAt: firebaseApi.serverTimestamp()
  });
}

function getAggregateStats(attempts) {
  const aggregate = {};

  attempts.forEach((attempt) => {
    Object.entries(attempt.categoryStats || {}).forEach(([category, stat]) => {
      aggregate[category] ||= { total: 0, correct: 0 };
      aggregate[category].total += stat.total || 0;
      aggregate[category].correct += stat.correct || 0;
    });
  });

  return aggregate;
}

function getWrongQuestionIds() {
  return load("truthWrongQuestionIds", []);
}

function saveWrongQuestionIds(ids) {
  save("truthWrongQuestionIds", [...new Set(ids)].slice(0, 30));
}

function getQuestionById(id) {
  return questionBank.find((item) => String(item.id) === String(id));
}

function getConceptTips(categoryStats) {
  const sorted = Object.entries(categoryStats).sort((a, b) => percent(a[1].correct, a[1].total) - percent(b[1].correct, b[1].total));
  const weakest = sorted[0]?.[0] || "personnel";
  const strongest = sorted.at(-1)?.[0] || "personnel";
  const reading = `Nên đọc lại chủ đề ${CATEGORIES[weakest]} và đối chiếu với ví dụ trong giáo trình Chương 4.`;
  return {
    weakest: CATEGORIES[weakest],
    strongest: CATEGORIES[strongest],
    reading,
    concepts: [
      "Độc quyền và độc quyền nhà nước luôn gắn với quan hệ lợi ích, quyền lực và điều tiết.",
      "Sở hữu/đầu tư nhà nước có thể hỗ trợ tái sản xuất tư bản và xử lý rủi ro lớn.",
      "Chủ nghĩa tư bản có vai trò phát triển nhưng vẫn mang giới hạn lịch sử."
    ]
  };
}

function renderKnowledgeMap(categoryStats) {
  const hasStudyData = STUDY_PATH.some((category) => categoryStats[category]?.total);
  return `
    <div class="knowledge-map">
      ${STUDY_PATH.map((category, index) => {
        const stat = categoryStats[category] || { total: 0, correct: 0 };
        const value = percent(stat.correct, stat.total);
        return `
          <div class="knowledge-step">
            <span>${index + 1}</span>
            <strong>${CATEGORIES[category]}</strong>
            <div class="meter"><span style="width:${value}%"></span></div>
            <small>${stat.total ? `${value}% đúng` : "Chưa có dữ liệu"}</small>
          </div>
        `;
      }).join("")}
    </div>
    ${hasStudyData ? "" : `<p class="muted" style="margin-top: 12px;">Lượt này chưa có câu thuộc 4 bước lý thuyết. Nếu muốn xem đủ bản đồ, hãy chọn "Trộn tất cả chủ đề" hoặc ôn từng chủ đề lý thuyết.</p>`}
  `;
}

function renderCategoryMeters(categoryStats) {
  const entries = Object.entries(categoryStats);
  if (!entries.length) {
    return `<p class="muted">Chưa có dữ liệu thống kê cho lượt này.</p>`;
  }

  return `
    <div class="category-meter">
      ${entries.map(([category, stat]) => {
        const value = percent(stat.correct, stat.total);
        return `
          <div class="meter-row">
            <span>${CATEGORIES[category]}</span>
            <div class="meter"><span style="width:${value}%"></span></div>
            <strong>${value}%</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderDeepExplanation(item, selectedIndex) {
  return `
    <div class="deep-explain">
      <p><strong>Vì sao đáp án đúng?</strong> ${item.explanation}</p>
      <p><strong>Vì sao các đáp án còn lại chưa đúng?</strong> Các lựa chọn khác không đúng trọng tâm lý thuyết, nhầm biểu hiện hoặc không phù hợp với chủ đề ${CATEGORIES[item.category]}.</p>
      <p><strong>Liên hệ lý thuyết:</strong> ${CATEGORY_THEORY[item.category]}</p>
    </div>
  `;
}

async function getLeaderboardEntries() {
  return getLocalLeaderboardEntries().slice(0, 10);
}

function getLocalLeaderboardEntries() {
  leaderboard = load("truthLeaderboard", []);
  return sortResultEntries(leaderboard);
}

function sortResultEntries(entries) {
  return [...entries].sort((a, b) => b.percent - a.percent || a.elapsed - b.elapsed || (b.createdAtMs || 0) - (a.createdAtMs || 0));
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function percent(value, total) {
  return total ? Math.round((value / total) * 100) : 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function getRank(scorePercent) {
  if (scorePercent >= 90) return "Nắm chắc Chương 4";
  if (scorePercent >= 70) return "Nắm khá Chương 4";
  if (scorePercent >= 50) return "Đang tiến bộ";
  return "Cần kiểm chứng thêm";
}

function syncHud() {
  playerNameView.textContent = profile.name || "Khách";
  roleView.textContent = isAdmin() ? "Quản lý" : "Người học";
  playsView.textContent = profile.plays || 0;
  lastScoreView.textContent = `${profile.lastScore || 0}%`;
  if (adminNav) adminNav.hidden = !isAdmin();
}

function setView(view) {
  currentView = view;
  if (view === "admin") return renderAdmin();
  if (view === "profile") return renderProfile();
  if (view === "leaderboard") return renderLeaderboard();
  renderHome();
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("truthTheme", isDark ? "dark" : "light");
});

if (localStorage.getItem("truthTheme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀";
}

function renderHome() {
  currentView = "home";
  const modeCards = MODES.map((mode) => `
    <button class="mode-card ${mode.id === selectedMode ? "active" : ""}" data-mode="${mode.id}">
      <strong>${mode.name}</strong>
      <span>${mode.desc}</span>
    </button>
  `).join("");

  app.innerHTML = `
    <div class="hero-grid">
      <section class="hero-copy">
      <p class="eyebrow">Chương 4: Cạnh tranh và độc quyền</p>
      <h1>ĐỘC QUYỀN & TƯ BẢN</h1>
        <p class="lead">Luyện câu hỏi về biểu hiện mới của độc quyền nhà nước và vai trò lịch sử của chủ nghĩa tư bản trong điều kiện hiện nay.</p>
        <div class="chip-row">
          <span class="chip good">100 câu hỏi</span>
          <span class="chip">8 chủ đề</span>
          <span class="chip">Câu hỏi ngẫu nhiên</span>
          <span class="chip warn">Bảng kết quả cá nhân</span>
          <span class="chip ${currentUser ? "good" : "warn"}">${currentUser ? "Đã đăng nhập" : "Đăng nhập để lưu điểm"}</span>
        </div>
        <div class="hero-actions">
          <button class="primary-btn" id="quickStart">Bắt đầu làm câu hỏi</button>
          <button class="secondary-btn" id="reviewWrongBtn">Ôn câu sai</button>
          <button class="secondary-btn" data-jump="profile">Cập nhật hồ sơ</button>
        </div>
      </section>

      <aside class="panel">
        <h2>Chọn hình thức học</h2>
        <p class="muted">Mỗi hình thức có mục đích riêng: luyện tổng hợp, phân tích tình huống, hoặc kiểm tra có giới hạn thời gian.</p>
        <div class="mode-grid">${modeCards}</div>

        <h3 style="margin-top: 20px;">Bộ câu hỏi</h3>
        <label class="field">
          <span>Chủ đề luyện tập</span>
          <select id="categorySelect">
            <option value="all">Trộn tất cả chủ đề</option>
            ${Object.entries(CATEGORIES).map(([id, name]) => `<option value="${id}" ${selectedCategory === id ? "selected" : ""}>${name}</option>`).join("")}
          </select>
        </label>
      </aside>
    </div>
  `;

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMode = button.dataset.mode;
      renderHome();
    });
  });
  document.querySelector("#categorySelect").addEventListener("change", (event) => {
    selectedCategory = event.target.value;
  });
  document.querySelector("#quickStart").addEventListener("click", startQuiz);
  document.querySelector("#reviewWrongBtn").addEventListener("click", startWrongReview);
  document.querySelector("[data-jump='profile']").addEventListener("click", renderProfile);
}

function startQuiz() {
  currentView = "quiz";
  const mode = MODES.find((item) => item.id === selectedMode);

  if (mode.id === "case") {
    startCaseInvestigation(mode);
    return;
  }

  let pool = questionBank.filter((question) => mode.pool.includes(question.category));

  if (selectedCategory !== "all") {
    pool = questionBank.filter((question) => question.category === selectedCategory);
  }

  const questionCount = mode.id === "test" ? pool.length : Math.min(10, pool.length);

  quiz = {
    mode,
    questions: shuffle(pool).slice(0, questionCount),
    index: 0,
    score: 0,
    answers: [],
    startedAt: Date.now(),
    deadline: mode.timed ? Date.now() + TEST_DURATION_MINUTES * 60 * 1000 : null,
    caseFile: null
  };

  startTimer();
  renderQuestion();
}

function startCaseInvestigation(mode) {
  const caseFile = CASES[Math.floor(Math.random() * CASES.length)];
  quiz = {
    mode,
    questions: CASE_STEPS.map((step, index) => normalizeQuestion({
      id: `case-${index}`,
      category: step.category,
      question: step.question,
      options: step.options,
      answer: step.answer,
      explanation: step.explanation,
      source: "case"
    }, index)),
    steps: CASE_STEPS,
    index: 0,
    score: 0,
    answers: [],
    startedAt: Date.now(),
    deadline: mode.timed ? Date.now() + TEST_DURATION_MINUTES * 60 * 1000 : null,
    caseFile
  };
  startTimer();
  renderQuestion();
}

function startWrongReview() {
  const wrongQuestions = getWrongQuestionIds().map(getQuestionById).filter(Boolean);
  if (!wrongQuestions.length) {
    alert("Chưa có câu sai để ôn. Hãy làm một lượt câu hỏi trước.");
    return;
  }

  quiz = {
    mode: { id: "review", name: "Ôn lại câu sai", pool: [] },
    questions: shuffle(wrongQuestions).slice(0, 10),
    index: 0,
    score: 0,
    answers: [],
    startedAt: Date.now(),
    deadline: null,
    caseFile: { title: "Ôn lại câu sai", claim: "Luyện lại đúng những câu từng trả lời sai.", context: "" }
  };
  currentView = "quiz";
  renderQuestion();
}

function startTimer() {
  if (timerId) clearInterval(timerId);
  if (!quiz?.deadline) return;
  timerId = setInterval(() => {
    const left = quiz.deadline - Date.now();
    const timer = document.querySelector("#timerView");
    if (timer) timer.textContent = formatTime(left);
    if (left <= 0) {
      clearInterval(timerId);
      timerId = null;
      finishQuiz();
    }
  }, 1000);
}

function formatTime(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minute = Math.floor(seconds / 60);
  const second = String(seconds % 60).padStart(2, "0");
  return `${minute}:${second}`;
}

function renderQuestion() {
  const item = quiz.questions[quiz.index];
  const progress = percent(quiz.index, quiz.questions.length);
  const step = quiz.steps?.[quiz.index];

  app.innerHTML = `
    <div class="play-grid">
      <section class="question-panel">
        <div class="progress-line"><span style="width:${progress}%"></span></div>
        <div class="question-meta">
          <span class="chip">${quiz.mode.name}</span>
          <span class="chip">${CATEGORIES[item.category]}</span>
          <span class="chip">Câu ${quiz.index + 1}/${quiz.questions.length}</span>
          ${quiz.deadline ? `<span class="chip warn" id="timerView">${formatTime(quiz.deadline - Date.now())}</span>` : ""}
        </div>
        ${quiz.caseFile ? `
          <div class="case-note">
            <strong>${quiz.caseFile.title}</strong>
            <p>${quiz.caseFile.context}</p>
            <p><strong>Thông tin cần điều tra:</strong> ${quiz.caseFile.claim}</p>
            ${step ? `<p><strong>${step.title}</strong></p>` : ""}
          </div>
        ` : ""}
        <p class="question-text">${item.question}</p>
        <div class="answers">
          ${item.options.map((option, index) => `
            <button class="answer-btn" data-answer="${index}">
              <span class="answer-key">${String.fromCharCode(65 + index)}</span>
              <span>${option}</span>
            </button>
          `).join("")}
        </div>
        <div id="feedback" class="feedback"></div>
        <div class="row-actions">
          <button class="primary-btn" id="nextQuestion" disabled>${quiz.index === quiz.questions.length - 1 ? "Xem kết quả học tập" : "Câu tiếp theo"}</button>
          <button class="secondary-btn" id="quitQuiz">Dừng bài</button>
        </div>
      </section>

      <aside class="side-panel">
        <h2>Tiến trình làm bài</h2>
        <div class="stats-grid">
          <div class="stat-card"><span>Điểm</span><strong>${quiz.score}/${quiz.questions.length}</strong></div>
          <div class="stat-card"><span>Đúng</span><strong>${percent(quiz.score, Math.max(quiz.index, 1))}%</strong></div>
        </div>
        <p class="muted" style="margin-top: 16px;">Mỗi lượt lấy một bộ câu hỏi ngẫu nhiên để bạn luyện đủ 5 nhóm kiến thức.</p>
      </aside>
    </div>
  `;

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => chooseAnswer(Number(button.dataset.answer)));
  });
  document.querySelector("#nextQuestion").addEventListener("click", () => {
    if (quiz.index === quiz.questions.length - 1) return finishQuiz();
    quiz.index += 1;
    renderQuestion();
  });
  document.querySelector("#quitQuiz").addEventListener("click", () => {
    if (timerId) clearInterval(timerId);
    renderHome();
  });
}

function chooseAnswer(answerIndex) {
  const item = quiz.questions[quiz.index];
  const isCorrect = answerIndex === item.answer;
  const feedback = document.querySelector("#feedback");

  if (isCorrect) quiz.score += 1;
  quiz.answers.push({ id: item.id, category: item.category, correct: isCorrect, selected: answerIndex });

  document.querySelectorAll("[data-answer]").forEach((button) => {
    const index = Number(button.dataset.answer);
    button.disabled = true;
    if (index === item.answer) button.classList.add("correct");
    if (index === answerIndex && !isCorrect) button.classList.add("incorrect");
  });

  feedback.className = `feedback show ${isCorrect ? "good" : "bad"}`;
  feedback.innerHTML = `<strong>${isCorrect ? "Đúng rồi." : "Chưa chính xác."}</strong> ${renderDeepExplanation(item, answerIndex)}`;
  document.querySelector("#nextQuestion").disabled = false;
}

async function finishQuiz() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  const elapsed = Math.max(1, Math.round((Date.now() - quiz.startedAt) / 1000));
  const scorePercent = percent(quiz.score, quiz.questions.length);
  const result = {
    name: profile.name || "Khách",
    mode: quiz.mode.name,
    score: quiz.score,
    total: quiz.questions.length,
    percent: scorePercent,
    rank: getRank(scorePercent),
    elapsed,
    date: new Date().toLocaleDateString("vi-VN")
  };

  profile.plays += 1;
  profile.lastScore = scorePercent;
  await saveCloudProfile();

  await saveLeaderboardResult(result);
  await saveAttempt(result);
  saveWrongQuestionIds(quiz.answers.filter((answer) => !answer.correct).map((answer) => answer.id));
  syncHud();
  renderResult(result);
}

function getAchievements(result) {
  const byCategory = getCategoryStats(quiz.answers);
  const sectionTwoFull = ["personnel", "state_ownership", "regulation"].every((key) =>
    !byCategory[key]?.total || byCategory[key].correct === byCategory[key].total
  );
  const regulationFull = byCategory.regulation?.correct === byCategory.regulation?.total && byCategory.regulation?.total > 0;
  const limitsFull = byCategory.limits?.correct === byCategory.limits?.total && byCategory.limits?.total > 0;

  return [
    { name: "Nắm chắc Chương 4", desc: "Đạt trên 90%", unlocked: result.percent >= 90 },
    { name: "Vững phần biểu hiện mới", desc: "Không sai các câu thuộc độc quyền nhà nước", unlocked: sectionTwoFull },
    { name: "Hiểu điều tiết kinh tế", desc: "Đúng toàn bộ câu điều tiết đã gặp", unlocked: regulationFull },
    { name: "Nhìn rõ giới hạn lịch sử", desc: "Đúng toàn bộ câu giới hạn lịch sử đã gặp", unlocked: limitsFull }
  ];
}

function getCategoryStats(answers) {
  return answers.reduce((stats, answer) => {
    stats[answer.category] ||= { total: 0, correct: 0 };
    stats[answer.category].total += 1;
    if (answer.correct) stats[answer.category].correct += 1;
    return stats;
  }, {});
}

function renderResult(result) {
  currentView = "result";
  const achievements = getAchievements(result);
  const categoryStats = getCategoryStats(quiz.answers);
  const tips = getConceptTips(categoryStats);
  const wrongCount = quiz.answers.filter((answer) => !answer.correct).length;
  const summaryText = `Tôi đạt ${result.score}/${result.total} (${result.percent}%). Mạnh ở: ${tips.strongest}. Cần ôn: ${tips.weakest}. ${tips.reading}`;
  const shareText = `${summaryText} - ĐỘC QUYỀN & TƯ BẢN.`;

  app.innerHTML = `
    <div class="result-grid">
      <section class="panel">
        <p class="eyebrow">Kết quả học tập</p>
        <h2 class="result-title">${result.rank}</h2>
        <div class="stats-grid">
          <div class="stat-card"><span>Điểm</span><strong>${result.score}/${result.total}</strong></div>
          <div class="stat-card"><span>Tỷ lệ đúng</span><strong>${result.percent}%</strong></div>
          <div class="stat-card"><span>Thời gian</span><strong>${result.elapsed}s</strong></div>
          <div class="stat-card"><span>Nhận xét</span><strong>${result.percent >= 70 ? "Ổn" : "Cần ôn"}</strong></div>
        </div>

        <h3 style="margin-top: 22px;">Huy hiệu học tập</h3>
        <div class="achievement-grid">
          ${achievements.map((item) => `
            <div class="achievement-card ${item.unlocked ? "" : "locked"}">
              <strong>${item.unlocked ? "Đạt" : "Chưa đạt"} - ${item.name}</strong>
              <span class="muted">${item.desc}</span>
            </div>
          `).join("")}
        </div>

        <h3 style="margin-top: 22px;">Phiếu tổng kết học tập</h3>
        <div class="summary-sheet">
          <p><strong>Bạn mạnh ở:</strong> ${tips.strongest}</p>
          <p><strong>Cần ôn:</strong> ${tips.weakest}</p>
          <p><strong>3 khái niệm cần nhớ:</strong> ${tips.concepts.join(" - ")}</p>
          <p><strong>Gợi ý đọc lại:</strong> ${tips.reading}</p>
        </div>

        <div class="result-actions">
          <button class="primary-btn" id="playAgain">Làm bộ câu hỏi khác</button>
          <button class="secondary-btn" id="reviewWrongResult" ${wrongCount ? "" : "disabled"}>Ôn lại câu sai</button>
          <button class="secondary-btn" id="shareResult">Chia sẻ kết quả</button>
          <button class="secondary-btn" id="copyResult">Sao chép phiếu tổng kết</button>
        </div>
      </section>

      <aside class="panel">
        <h2>Phân tích học tập</h2>
        <h3>Bản đồ kiến thức</h3>
        ${renderKnowledgeMap(categoryStats)}
        <h3 style="margin-top: 18px;">Thống kê theo phần đã làm</h3>
        ${renderCategoryMeters(categoryStats)}
        <p class="muted" style="margin-top: 18px;">Bản đồ kiến thức bám các mảng chính của Chương 4: quan hệ nhân sự, sở hữu nhà nước, điều tiết kinh tế, vai trò tích cực và giới hạn lịch sử.</p>
      </aside>
    </div>
  `;

  document.querySelector("#playAgain").addEventListener("click", startQuiz);
  document.querySelector("#reviewWrongResult").addEventListener("click", startWrongReview);
  document.querySelector("#copyResult").addEventListener("click", () => copyShareText(summaryText));
  document.querySelector("#shareResult").addEventListener("click", async () => {
    if (navigator.share) {
      await navigator.share({ title: "ĐỘC QUYỀN & TƯ BẢN", text: shareText, url: location.href });
    } else {
      copyShareText(shareText);
    }
  });
}

async function copyShareText(text) {
  const shareValue = `${text} ${location.href}`;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(shareValue);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = shareValue;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  alert("Đã copy kết quả để chia sẻ.");
}

async function handleAuth(action) {
  const email = document.querySelector("#emailInput")?.value.trim();
  const password = document.querySelector("#passwordInput")?.value;
  const message = document.querySelector("#authMessage");

  if (!email || !password) {
    if (message) message.textContent = "Vui lòng nhập email và mật khẩu.";
    return;
  }

  try {
    if (message) message.textContent = "Đang xử lý...";

    if (action === "register") {
      const credential = await authApi.createUserWithEmailAndPassword(auth, email, password);
      const suggestedName = profile.name && profile.name !== "Khách" ? profile.name : email.split("@")[0];
      await authApi.updateProfile(credential.user, { displayName: suggestedName });
      currentUser = credential.user;
      profile = { ...getDefaultProfile(credential.user), name: suggestedName };
      await saveCloudProfile();
    } else {
      await authApi.signInWithEmailAndPassword(auth, email, password);
    }

    await loadCloudProfile(auth.currentUser);
    syncHud();
    renderProfile();
  } catch (error) {
    const friendly = {
      "auth/email-already-in-use": "Email này đã được đăng ký.",
      "auth/invalid-email": "Email không hợp lệ.",
      "auth/weak-password": "Mật khẩu nên có ít nhất 6 ký tự.",
      "auth/invalid-credential": "Email hoặc mật khẩu chưa đúng.",
      "auth/user-not-found": "Chưa có tài khoản với email này.",
      "auth/wrong-password": "Mật khẩu chưa đúng.",
      "auth/operation-not-allowed": "Chức năng đăng nhập bằng email chưa được bật.",
      "auth/configuration-not-found": "Chức năng đăng nhập chưa được cấu hình hoàn chỉnh.",
      "auth/network-request-failed": "Không kết nối được hệ thống lưu dữ liệu. Kiểm tra mạng hoặc chặn trình duyệt.",
      "auth/too-many-requests": "Hệ thống đang tạm chặn do thử quá nhiều lần. Đợi một lát rồi thử lại."
    };
    if (message) {
      message.textContent = friendly[error.code] || "Không xử lý được tài khoản. Vui lòng thử lại sau.";
    }
  }
}

async function handlePasswordReset() {
  const email = document.querySelector("#emailInput")?.value.trim();
  const message = document.querySelector("#authMessage");

  if (!email) {
    if (message) message.textContent = "Nhập email trước để nhận link đặt lại mật khẩu.";
    return;
  }

  try {
    await authApi.sendPasswordResetEmail(auth, email);
    if (message) message.textContent = "Đã gửi email đặt lại mật khẩu. Kiểm tra hộp thư của bạn.";
  } catch (error) {
    if (message) message.textContent = "Không gửi được email đặt lại mật khẩu. Kiểm tra email hoặc cấu hình Authentication.";
  }
}

async function renderProfile() {
  currentView = "profile";
  const attempts = await getAttemptEntries();
  const aggregateStats = getAggregateStats(attempts);
  const isCloudReady = Boolean(auth && db);
  const authPanel = !isCloudReady
    ? `
      <div class="panel">
        <h2>Tài khoản</h2>
        <p class="muted">Chưa thể đồng bộ tài khoản, hồ sơ đang lưu trên trình duyệt này.</p>
      </div>
    `
    : currentUser
      ? `
        <div class="panel">
          <h2>Tài khoản</h2>
          <p class="muted">Đã đăng nhập bằng <strong>${escapeHtml(currentUser.email || "")}</strong>. Hồ sơ, lịch sử luyện tập và bảng kết quả sẽ được đồng bộ.</p>
          <button class="secondary-btn" id="logoutBtn">Đăng xuất</button>
        </div>
      `
      : `
        <div class="panel">
          <h2>Đăng nhập / Đăng ký</h2>
          <p class="muted">Đăng nhập để lưu hồ sơ, lịch sử luyện tập và kết quả học tập.</p>
          <div class="profile-form">
            <label class="field">
              <span>Email</span>
              <input id="emailInput" type="email" autocomplete="email" placeholder="tenban@email.com">
            </label>
            <label class="field">
              <span>Mật khẩu</span>
              <input id="passwordInput" type="password" autocomplete="current-password" placeholder="Tối thiểu 6 ký tự">
            </label>
            <p class="muted" id="authMessage"></p>
            <div class="row-actions">
              <button class="primary-btn" id="loginBtn">Đăng nhập</button>
              <button class="secondary-btn" id="registerBtn">Đăng ký</button>
              <button class="secondary-btn" id="resetPasswordBtn">Quên mật khẩu</button>
            </div>
          </div>
        </div>
      `;

  app.innerHTML = `
    <div class="hero-grid">
      <section class="panel">
        <h2>Hồ sơ người học</h2>
        <div class="profile-form">
          <label class="field">
            <span>Tên hiển thị</span>
            <input id="nameInput" value="${escapeHtml(profile.name)}" maxlength="28" placeholder="Ví dụ: Minh Anh">
          </label>
          <label class="field">
            <span>Lớp/Nhóm</span>
            <input id="classInput" value="${escapeHtml(profile.className)}" maxlength="36" placeholder="Ví dụ: Nhóm 3 - Triết học">
          </label>
          <button class="primary-btn" id="saveProfile">Lưu hồ sơ</button>
        </div>
      </section>

      <aside>
        ${authPanel}
        <div class="panel" style="margin-top: 14px;">
          <h2>Tiến trình</h2>
          <div class="stats-grid">
            <div class="stat-card"><span>Vai trò</span><strong>${isAdmin() ? "Quản lý" : "Người học"}</strong></div>
            <div class="stat-card"><span>Điểm gần nhất</span><strong>${profile.lastScore || 0}%</strong></div>
            <div class="stat-card"><span>Tình trạng</span><strong>${(profile.lastScore || 0) >= 70 ? "Ổn" : "Cần luyện"}</strong></div>
            <div class="stat-card"><span>Lượt luyện</span><strong>${profile.plays}</strong></div>
          </div>
        </div>
      </aside>
    </div>

    <section class="panel profile-insights">
      <div>
        <h2>Lịch sử luyện tập</h2>
        <p class="muted">${currentUser ? "Lưu theo tài khoản đang đăng nhập." : "Đăng nhập để đồng bộ lịch sử giữa nhiều thiết bị."}</p>
      </div>
      <div class="history-grid">
        <div>
          <h3>12 lượt gần nhất</h3>
          <ul class="mini-list">
            ${attempts.length ? attempts.map((attempt) => `
              <li class="leader-row">
                <strong>${attempt.percent}%</strong>
                <span>
                  <strong>${attempt.mode}</strong><br>
                  <span class="muted">${attempt.rank} · ${attempt.score}/${attempt.total} · ${attempt.elapsed}s · ${attempt.date}</span>
                </span>
                <span class="chip">${attempt.percent >= 70 ? "Đạt" : "Ôn lại"}</span>
              </li>
            `).join("") : `<li><span></span><span>Chưa có lịch sử luyện tập.</span><span></span></li>`}
          </ul>
        </div>
        <div>
          <h3>Điểm mạnh/yếu theo chủ đề</h3>
          <div class="category-meter">
            ${Object.keys(aggregateStats).length ? Object.entries(aggregateStats).map(([category, stat]) => {
              const value = percent(stat.correct, stat.total);
              return `
                <div class="meter-row">
                  <span>${CATEGORIES[category]}</span>
                  <div class="meter"><span style="width:${value}%"></span></div>
                  <strong>${value}%</strong>
                </div>
              `;
            }).join("") : `<p class="muted">Chưa đủ dữ liệu để phân tích.</p>`}
          </div>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#saveProfile").addEventListener("click", async () => {
    profile.name = document.querySelector("#nameInput").value.trim() || "Khách";
    profile.className = document.querySelector("#classInput").value.trim();
    await saveCloudProfile();
    syncHud();
    renderHome();
  });

  const loginBtn = document.querySelector("#loginBtn");
  const registerBtn = document.querySelector("#registerBtn");
  const resetPasswordBtn = document.querySelector("#resetPasswordBtn");
  const logoutBtn = document.querySelector("#logoutBtn");

  if (loginBtn) loginBtn.addEventListener("click", () => handleAuth("login"));
  if (registerBtn) registerBtn.addEventListener("click", () => handleAuth("register"));
  if (resetPasswordBtn) resetPasswordBtn.addEventListener("click", handlePasswordReset);
  if (logoutBtn) logoutBtn.addEventListener("click", async () => {
    await authApi.signOut(auth);
    currentUser = null;
    profile = load("truthProfile", { name: "Khách", className: "", role: "player", plays: 0, lastScore: 0 });
    syncHud();
    renderProfile();
  });
}

async function renderLeaderboard() {
  currentView = "leaderboard";
  app.innerHTML = `
    <section class="panel">
      <h2>Bảng kết quả</h2>
      <p class="muted">Đang tải bảng kết quả...</p>
    </section>
  `;

  const entries = await getLeaderboardEntries();
  renderLeaderboardEntries(entries);
}

function renderLeaderboardEntries(entries) {
  if (currentView !== "leaderboard") return;
  app.innerHTML = `
    <section class="panel">
      <h2>Bảng kết quả</h2>
      <div class="chip-row">
        <span class="chip good">Kết quả cá nhân</span>
        <span class="chip">10 kết quả tốt nhất</span>
      </div>
      <p class="muted" style="margin-top: 12px;">Bảng này chỉ hiển thị kết quả luyện tập của bạn trên trình duyệt hiện tại.</p>
      <ul class="mini-list" style="margin-top: 18px;">
        ${entries.length ? entries.map((item, index) => `
          <li class="leader-row">
            <strong>#${index + 1}</strong>
            <span>
              <strong>${escapeHtml(item.name)}</strong><br>
              <span class="muted">${item.className ? `${escapeHtml(item.className)} · ` : ""}${item.mode} · ${item.rank} · ${item.elapsed}s · ${item.date}</span>
            </span>
            <strong>${item.percent}%</strong>
          </li>
        `).join("") : `<li><span></span><span>Chưa có lượt luyện tập nào.</span><span></span></li>`}
      </ul>
      <div class="row-actions">
        <button class="primary-btn" id="leaderPlay">Làm câu hỏi</button>
        <button class="secondary-btn" id="clearLeader">Xóa kết quả trên máy này</button>
      </div>
    </section>
  `;

  document.querySelector("#leaderPlay").addEventListener("click", startQuiz);
  const clearButton = document.querySelector("#clearLeader");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      leaderboard = [];
      save("truthLeaderboard", leaderboard);
      renderLeaderboard();
    });
  }
}

async function renderAdmin() {
  currentView = "admin";

  if (!currentUser || !isAdmin()) {
    app.innerHTML = `
      <section class="panel">
        <h2>Khu vực quản lý</h2>
        <p class="muted">Bạn cần đăng nhập bằng tài khoản quản lý để truy cập phần này.</p>
        <div class="row-actions">
          <button class="primary-btn" id="goProfile">Đăng nhập</button>
        </div>
      </section>
    `;
    document.querySelector("#goProfile").addEventListener("click", renderProfile);
    return;
  }

  app.innerHTML = `
    <section class="panel">
      <h2>Khu vực quản lý</h2>
      <p class="muted">Đang tải dữ liệu quản lý...</p>
    </section>
  `;

  try {
    const { users, questions } = await getAdminData();
    const playerCount = users.filter((user) => user.role !== "admin").length;
    const adminCount = users.filter((user) => user.role === "admin").length;

    app.innerHTML = `
      <div class="admin-grid">
        <section class="panel">
          <p class="eyebrow">Khu quản lý</p>
          <h2>Quản lý nền tảng</h2>
          <div class="stats-grid">
            <div class="stat-card"><span>Tài khoản</span><strong>${users.length}</strong></div>
            <div class="stat-card"><span>Người học</span><strong>${playerCount}</strong></div>
            <div class="stat-card"><span>Quản lý</span><strong>${adminCount}</strong></div>
            <div class="stat-card"><span>Câu hỏi thêm</span><strong>${questions.length}</strong></div>
          </div>
          <div class="admin-note">
            <strong>Người học không được can thiệp:</strong>
            <p class="muted">Không xem danh sách tài khoản, không đổi vai trò, không sửa ngân hàng câu hỏi. Hệ thống phân quyền sẽ chặn các thao tác không hợp lệ.</p>
          </div>
        </section>

        <section class="panel">
          <h2>Người dùng</h2>
          <ul class="mini-list">
            ${users.length ? users.map((user) => `
              <li class="leader-row">
                <strong>${user.role === "admin" ? "QL" : "SV"}</strong>
                <span>
                  <strong>${escapeHtml(user.name || user.email || "Người học")}</strong><br>
                  <span class="muted">${escapeHtml(user.email || "")} · ${escapeHtml(user.className || "Chưa có lớp/nhóm")} · ${user.plays || 0} lượt</span>
                </span>
                ${user.id === currentUser.uid
                  ? `<span class="chip good">Bạn</span>`
                  : `<button class="secondary-btn role-btn" data-user="${user.id}" data-role="${user.role === "admin" ? "player" : "admin"}">${user.role === "admin" ? "Hạ quyền" : "Cấp QL"}</button>`
                }
              </li>
            `).join("") : `<li><span></span><span>Chưa có tài khoản.</span><span></span></li>`}
          </ul>
        </section>

        <section class="panel admin-wide">
          <h2>Thêm câu hỏi</h2>
          <div class="question-editor">
            <input id="adminQuestionId" type="hidden">
            <label class="field"><span>Chủ đề</span><select id="adminQuestionCategory">${Object.entries(CATEGORIES).map(([id, name]) => `<option value="${id}">${name}</option>`).join("")}</select></label>
            <label class="field"><span>Câu hỏi</span><input id="adminQuestionText" placeholder="Nhập câu hỏi"></label>
            <label class="field"><span>A</span><input id="adminOption0"></label>
            <label class="field"><span>B</span><input id="adminOption1"></label>
            <label class="field"><span>C</span><input id="adminOption2"></label>
            <label class="field"><span>D</span><input id="adminOption3"></label>
            <label class="field"><span>Đáp án đúng</span><select id="adminAnswer"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></label>
            <label class="field"><span>Giải thích</span><input id="adminExplanation" placeholder="Giải thích ngắn"></label>
            <button class="primary-btn" id="saveQuestionBtn">Lưu câu hỏi</button>
            <button class="secondary-btn" id="resetQuestionFormBtn">Nhập câu mới</button>
          </div>
          <p class="muted" style="margin-top: 12px;">Câu hỏi quản lý thêm sẽ được đưa vào ngân hàng câu hỏi khi người học làm bài.</p>
          <ul class="mini-list" style="margin-top: 18px;">
            ${questions.length ? questions.map((question) => `
              <li class="leader-row">
                <strong>${CATEGORIES[question.category] || "Khác"}</strong>
                <span>
                  <strong>${escapeHtml(question.question || "")}</strong><br>
                  <span class="muted">${(question.options || []).map(escapeHtml).join(" · ")}</span>
                </span>
                <span class="row-actions compact-actions">
                  <button class="secondary-btn edit-question" data-question="${question.id}">Sửa</button>
                  <button class="secondary-btn danger-btn delete-question" data-question="${question.id}">Xóa</button>
                </span>
              </li>
            `).join("") : `<li><span></span><span>Chưa có câu hỏi thêm từ admin.</span><span></span></li>`}
          </ul>
        </section>

      </div>
    `;

    document.querySelectorAll(".role-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        await updateUserRole(button.dataset.user, button.dataset.role);
        renderAdmin();
      });
    });

    document.querySelector("#saveQuestionBtn").addEventListener("click", async () => {
      const options = [0, 1, 2, 3].map((index) => document.querySelector(`#adminOption${index}`).value.trim());
      const question = {
        category: document.querySelector("#adminQuestionCategory").value,
        question: document.querySelector("#adminQuestionText").value.trim(),
        options,
        answer: Number(document.querySelector("#adminAnswer").value),
        explanation: document.querySelector("#adminExplanation").value.trim()
      };
      if (!question.question || options.some((option) => !option) || !question.explanation) {
        alert("Vui lòng nhập đủ câu hỏi, 4 đáp án và giải thích.");
        return;
      }
      const questionId = document.querySelector("#adminQuestionId").value;
      if (questionId) {
        await updateCloudQuestion(questionId, question);
      } else {
        await saveCloudQuestion(question);
      }
      alert("Đã lưu câu hỏi.");
      renderAdmin();
    });

    document.querySelector("#resetQuestionFormBtn").addEventListener("click", () => {
      document.querySelector("#adminQuestionId").value = "";
      document.querySelector("#adminQuestionText").value = "";
      [0, 1, 2, 3].forEach((index) => document.querySelector(`#adminOption${index}`).value = "");
      document.querySelector("#adminExplanation").value = "";
    });

    document.querySelectorAll(".edit-question").forEach((button) => {
      button.addEventListener("click", () => {
        const item = questions.find((question) => question.id === button.dataset.question);
        if (!item) return;
        document.querySelector("#adminQuestionId").value = item.id;
        document.querySelector("#adminQuestionCategory").value = item.category;
        document.querySelector("#adminQuestionText").value = item.question || "";
        [0, 1, 2, 3].forEach((index) => document.querySelector(`#adminOption${index}`).value = item.options?.[index] || "");
        document.querySelector("#adminAnswer").value = String(item.answer || 0);
        document.querySelector("#adminExplanation").value = item.explanation || "";
        document.querySelector("#adminQuestionText").focus();
      });
    });

    document.querySelectorAll(".delete-question").forEach((button) => {
      button.addEventListener("click", async () => {
        await deleteCloudQuestion(button.dataset.question);
        renderAdmin();
      });
    });

  } catch (error) {
    app.innerHTML = `
      <section class="panel">
        <h2>Khu vực quản lý</h2>
        <p class="muted">Không tải được dữ liệu quản lý. Kiểm tra quyền của tài khoản này rồi thử lại.</p>
      </section>
    `;
  }
}

async function boot() {
  await initFirebase();
  await loadCloudQuestions();
  syncHud();
  renderHome();
}

boot();
