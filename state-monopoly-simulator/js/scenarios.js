const STAT_LABELS = {
  marketConcentration: "Tập trung thị trường",
  corporatePower: "Ảnh hưởng tập đoàn",
  stateBudget: "Ngân sách còn lại",
  consumerWelfare: "Phúc lợi xã hội",
  smallBusiness: "Sức sống DN nhỏ",
  employment: "Việc làm"
};

const INITIAL_STATS = {
  marketConcentration: 50,
  corporatePower: 50,
  stateBudget: 100,
  consumerWelfare: 50,
  smallBusiness: 50,
  employment: 50
};

const manifestations = [
  {
    title: "Sự kết hợp về nhân sự",
    summary: "Nhân sự và lợi ích giữa cơ quan quản lý, tập đoàn lớn, hiệp hội doanh nghiệp và tổ chức tài chính có thể đan xen.",
    diagram: ["Cơ quan quản lý", "Tập đoàn lớn", "Hiệp hội DN", "Tổ chức tài chính", "Chính sách", "Lợi ích"],
    check: "Cơ chế thỏa hiệp và phân chia quyền lực thuộc biểu hiện nào?",
    answer: "Sự kết hợp về nhân sự."
  },
  {
    title: "Điều tiết có lợi cho tổ chức độc quyền",
    summary: "Nhà nước có thể dùng thuế, trợ cấp, bảo hộ, tín dụng ưu đãi hoặc cứu trợ để hỗ trợ các tổ chức độc quyền.",
    diagram: ["Thuế", "Trợ cấp", "Bảo hộ", "Cứu trợ", "Tập đoàn", "Thị trường"],
    check: "Cứu trợ doanh nghiệp lớn không kèm điều kiện có thể làm tăng chỉ số nào trong game?",
    answer: "Ảnh hưởng tập đoàn và tập trung thị trường."
  },
  {
    title: "Sử dụng ngân sách nhà nước",
    summary: "Ngân sách có thể được phân bổ cho dịch vụ công, R&D, cứu trợ, hợp đồng công hoặc hỗ trợ doanh nghiệp.",
    diagram: ["Ngân sách", "Dịch vụ công", "R&D", "Hợp đồng công", "Cứu trợ", "DN nhỏ"],
    check: "Khi dùng ngân sách cứu trợ, chỉ số nào thường giảm?",
    answer: "Ngân sách còn lại."
  },
  {
    title: "Sở hữu nhà nước và tư nhân đan xen",
    summary: "Nhà nước có thể mua cổ phần, tham gia công ty hỗn hợp hoặc hợp tác công tư, làm ranh giới sở hữu linh hoạt hơn.",
    diagram: ["Nhà nước", "Tư nhân", "Cổ phần", "PPP", "Công ty hỗn hợp", "Quản trị"],
    check: "Nhà nước mua cổ phần doanh nghiệp minh họa điều gì?",
    answer: "Sở hữu nhà nước và sở hữu tư nhân đan xen."
  },
  {
    title: "Mở rộng ra phạm vi quốc tế",
    summary: "Tập đoàn xuyên quốc gia, đầu tư ra nước ngoài và hiệp định kinh tế cho thấy sự phối hợp giữa quyền lực kinh tế và chính sách nhà nước.",
    diagram: ["Tập đoàn TNC", "Đầu tư nước ngoài", "Hiệp định", "Chuỗi cung ứng", "Nhà nước", "Thị trường"],
    check: "Tập đoàn mở rộng ra nước ngoài gắn với biểu hiện nào?",
    answer: "Mở rộng hoạt động ra phạm vi quốc tế."
  }
];

const scenarios = [
  {
    title: "Ngân hàng lớn có nguy cơ phá sản",
    description: "Một ngân hàng lớn gặp khủng hoảng thanh khoản. Nếu sụp đổ, tín dụng, việc làm và chuỗi thanh toán có thể bị tác động mạnh.",
    theory: "Minh họa việc nhà nước có thể dùng nguồn lực công để ổn định một tổ chức tài chính lớn, nhưng cần điều kiện kiểm soát để tránh làm tăng vị thế chi phối.",
    image: "assets/images/round-1-bank.webp",
    alt: "Khủng hoảng ngân hàng trong khu tài chính thành phố",
    choices: [
      {
        text: "Cấp gói cứu trợ trực tiếp",
        effects: { marketConcentration: 10, corporatePower: 15, stateBudget: -20, consumerWelfare: -4, smallBusiness: -8, employment: 10 },
        explanation: "Cứu trợ có thể duy trì việc làm trong ngắn hạn nhưng làm tăng sự phụ thuộc và liên kết giữa nhà nước với tập đoàn lớn."
      },
      {
        text: "Hỗ trợ có điều kiện và tăng giám sát",
        effects: { marketConcentration: 3, corporatePower: 5, stateBudget: -10, consumerWelfare: 3, smallBusiness: 2, employment: 8 },
        explanation: "Hỗ trợ có điều kiện giúp hạn chế việc tập đoàn sử dụng nguồn lực công mà không chịu trách nhiệm."
      },
      {
        text: "Không sử dụng ngân sách để cứu trợ",
        effects: { marketConcentration: -4, corporatePower: -5, stateBudget: 5, consumerWelfare: -6, smallBusiness: 5, employment: -15 },
        explanation: "Ngân sách được bảo toàn nhưng thị trường lao động có thể chịu tác động trong ngắn hạn."
      }
    ]
  },
  {
    title: "Tập đoàn công nghệ kiểm soát dữ liệu",
    description: "Một tập đoàn công nghệ nắm giữ dữ liệu và hạ tầng số quan trọng. Nhà nước cần dùng dịch vụ của họ nhưng phải tránh phụ thuộc quá mức.",
    theory: "Minh họa quyền lực kinh tế hiện đại không chỉ nằm ở vốn, mà còn ở dữ liệu, hạ tầng số và khả năng tác động đến quá trình xây dựng chính sách.",
    image: "assets/images/round-2-technology.webp",
    alt: "Tập đoàn công nghệ kiểm soát dữ liệu và hạ tầng số",
    choices: [
      {
        text: "Ký hợp đồng trọn gói với tập đoàn lớn",
        effects: { marketConcentration: 12, corporatePower: 12, stateBudget: -12, consumerWelfare: 4, smallBusiness: -12, employment: 5 },
        explanation: "Hợp đồng công quy mô lớn có thể nâng hiệu quả triển khai nhưng làm tăng lợi thế của tập đoàn lớn."
      },
      {
        text: "Chia gói thầu cho nhiều doanh nghiệp",
        effects: { marketConcentration: -8, corporatePower: -4, stateBudget: -10, consumerWelfare: 6, smallBusiness: 12, employment: 7 },
        explanation: "Chia gói thầu hỗ trợ cạnh tranh và tăng cơ hội cho doanh nghiệp nhỏ."
      },
      {
        text: "Đặt tiêu chuẩn minh bạch và đấu thầu mở",
        effects: { marketConcentration: -3, corporatePower: -2, stateBudget: -6, consumerWelfare: 8, smallBusiness: 6, employment: 4 },
        explanation: "Đấu thầu minh bạch giúp hạn chế đặc quyền, dù vẫn cần năng lực quản lý và giám sát."
      }
    ]
  },
  {
    title: "Giá năng lượng tăng mạnh",
    description: "Giá năng lượng tăng nhanh, gây áp lực lên người tiêu dùng và doanh nghiệp. Nhà nước cần điều tiết mà không làm méo mó cạnh tranh quá mức.",
    theory: "Minh họa vai trò điều tiết giá và hỗ trợ lĩnh vực chiến lược, đồng thời đặt câu hỏi về lợi ích xã hội, ngân sách và cạnh tranh.",
    image: "assets/images/round-3-energy.webp",
    alt: "Khủng hoảng giá năng lượng trong thành phố ban đêm",
    choices: [
      {
        text: "Áp giá trần và kiểm tra hành vi thao túng",
        effects: { marketConcentration: -5, corporatePower: -8, stateBudget: -4, consumerWelfare: 12, smallBusiness: 4, employment: 0 },
        explanation: "Kiểm soát hành vi lạm dụng giúp bảo vệ người tiêu dùng và hạn chế ảnh hưởng quá mức của doanh nghiệp có vị trí chi phối."
      },
      {
        text: "Trợ giá cho người tiêu dùng",
        effects: { marketConcentration: 3, corporatePower: 4, stateBudget: -14, consumerWelfare: 10, smallBusiness: 0, employment: 2 },
        explanation: "Trợ giá giảm áp lực ngắn hạn nhưng không nhất thiết xử lý quyền lực thị trường của doanh nghiệp lớn."
      },
      {
        text: "Mở cửa nhập khẩu và hỗ trợ nhà cung cấp mới",
        effects: { marketConcentration: -10, corporatePower: -9, stateBudget: -6, consumerWelfare: 9, smallBusiness: 7, employment: 3 },
        explanation: "Tăng nguồn cung và đối thủ mới có thể làm giảm mức độ tập trung thị trường."
      }
    ]
  },
  {
    title: "Dự án hạ tầng quy mô lớn",
    description: "Một dự án hạ tầng lớn cần lựa chọn cách triển khai: giao cho tập đoàn mạnh, chia gói thầu, hay tăng minh bạch và giám sát.",
    theory: "Minh họa hợp đồng công và đầu tư hạ tầng có thể tạo lợi ích xã hội, nhưng cũng có thể làm tăng sự phụ thuộc vào nhà thầu lớn nếu thiếu cạnh tranh.",
    image: "assets/images/round-4-infrastructure.webp",
    alt: "Dự án hạ tầng thông minh và hợp đồng công quy mô lớn",
    choices: [
      {
        text: "Giao hợp đồng trọn gói cho tập đoàn lớn",
        effects: { marketConcentration: 10, corporatePower: 12, stateBudget: -12, consumerWelfare: 5, smallBusiness: -8, employment: 6 },
        explanation: "Hợp đồng trọn gói có thể triển khai nhanh nhưng làm tăng sự phụ thuộc vào một nhà thầu lớn."
      },
      {
        text: "Chia gói thầu và yêu cầu minh bạch",
        effects: { marketConcentration: -6, corporatePower: -4, stateBudget: -10, consumerWelfare: 7, smallBusiness: 9, employment: 5 },
        explanation: "Chia gói thầu và minh bạch hóa giúp mở rộng cạnh tranh, dù cần năng lực quản lý phức tạp hơn."
      },
      {
        text: "Tăng giám sát độc lập trước khi ký hợp đồng",
        effects: { marketConcentration: -3, corporatePower: -3, stateBudget: -5, consumerWelfare: 4, smallBusiness: 4, employment: 2 },
        explanation: "Giám sát độc lập giúp hạn chế lợi ích nhóm và giảm rủi ro phụ thuộc chính sách."
      }
    ]
  },
  {
    title: "Tập đoàn dọa đóng nhà máy",
    description: "Một tập đoàn lớn dọa đóng nhà máy nếu không được ưu đãi. Hàng nghìn việc làm bị đặt lên bàn đàm phán chính sách.",
    theory: "Minh họa khả năng doanh nghiệp lớn dùng việc làm và đầu tư để tạo sức ép ngược lại với chính sách nhà nước.",
    image: "assets/images/round-5-employment.webp",
    alt: "Nhà máy trước nguy cơ đóng cửa và khủng hoảng việc làm",
    choices: [
      {
        text: "Chấp thuận ưu đãi lớn để giữ nhà máy",
        effects: { marketConcentration: 7, corporatePower: 10, stateBudget: -16, consumerWelfare: 1, smallBusiness: -7, employment: 9 },
        explanation: "Ưu đãi lớn có thể giữ việc làm ngắn hạn nhưng làm tăng quyền thương lượng của tập đoàn."
      },
      {
        text: "Ưu đãi có điều kiện về việc làm và chuyển giao công nghệ",
        effects: { marketConcentration: 2, corporatePower: 4, stateBudget: -8, consumerWelfare: 5, smallBusiness: 3, employment: 9 },
        explanation: "Điều kiện đi kèm giúp nguồn lực công gắn với lợi ích xã hội cụ thể hơn."
      },
      {
        text: "Áp dụng chính sách thuế bình đẳng",
        effects: { marketConcentration: -4, corporatePower: -4, stateBudget: 6, consumerWelfare: 3, smallBusiness: 6, employment: -2 },
        explanation: "Chính sách bình đẳng giúp bảo vệ cạnh tranh nhưng có thể giảm sức hấp dẫn với nhà đầu tư lớn."
      }
    ]
  }
];

const quizQuestions = [
  {
    question: "Trong game, cứu trợ trực tiếp cho tập đoàn lớn không kèm điều kiện thường làm tăng chỉ số nào?",
    options: ["Ảnh hưởng tập đoàn", "Ngân sách còn lại", "Sức sống DN nhỏ", "Cạnh tranh thị trường"],
    answer: 0,
    explanation: "Cứu trợ trực tiếp có thể làm tăng ảnh hưởng và vị thế thương lượng của tập đoàn lớn nếu thiếu điều kiện kiểm soát."
  },
  {
    question: "Nhà nước mua cổ phần trong doanh nghiệp tư nhân minh họa rõ nhất biểu hiện nào?",
    options: ["Sở hữu nhà nước và sở hữu tư nhân đan xen", "Không can thiệp kinh tế", "Xóa bỏ độc quyền", "Cạnh tranh hoàn hảo"],
    answer: 0,
    explanation: "Đây là dạng sở hữu hỗn hợp, thể hiện sự đan xen giữa khu vực nhà nước và tư nhân."
  },
  {
    question: "Chia gói thầu công cho nhiều doanh nghiệp có xu hướng hỗ trợ chỉ số nào?",
    options: ["Sức sống DN nhỏ", "Tập trung thị trường", "Ảnh hưởng tập đoàn", "Độc quyền tuyệt đối"],
    answer: 0,
    explanation: "Chia gói thầu giúp doanh nghiệp nhỏ có cơ hội tham gia và giảm phụ thuộc vào tập đoàn lớn."
  },
  {
    question: "Câu cảnh báo nào cần có trong website mô phỏng?",
    options: ["Đây là mô phỏng minh họa lý luận, không phải dự báo kinh tế thực tế", "Mô phỏng luôn đúng với mọi quốc gia", "Không cần nguồn tham khảo", "Mọi can thiệp đều xấu"],
    answer: 0,
    explanation: "Cảnh báo này giúp sản phẩm nghiêm túc và tránh hiểu nhầm mô phỏng là mô hình dự báo."
  },
  {
    question: "Công cụ nào thuộc nhóm điều tiết có lợi cho tổ chức độc quyền?",
    options: ["Trợ cấp, ưu đãi thuế, bảo hộ, cứu trợ", "Tự cấp tự túc", "Xóa bỏ ngân sách", "Không có luật pháp"],
    answer: 0,
    explanation: "Đây là các công cụ nhà nước có thể sử dụng để hỗ trợ hoặc điều tiết hoạt động của doanh nghiệp lớn."
  },
  {
    question: "Khi nhà nước dùng ngân sách ký hợp đồng công quy mô lớn với tập đoàn, điểm cần phân tích là gì?",
    options: ["Sự chuyển hóa nguồn lực công thành lợi thế cho doanh nghiệp lớn", "Ngân sách không liên quan kinh tế", "Doanh nghiệp nhỏ chắc chắn hưởng lợi", "Không có tác động thị trường"],
    answer: 0,
    explanation: "Hợp đồng công có thể tạo lợi thế lớn cho doanh nghiệp nhận thầu."
  },
  {
    question: "Tập đoàn xuyên quốc gia và đầu tư ra nước ngoài gắn với biểu hiện nào?",
    options: ["Mở rộng hoạt động ra phạm vi quốc tế", "Chỉ là tiêu dùng cá nhân", "Không liên quan chính sách nhà nước", "Sản xuất tự nhiên"],
    answer: 0,
    explanation: "Đây là biểu hiện về phạm vi hoạt động và phối hợp giữa quyền lực kinh tế với chính sách nhà nước."
  },
  {
    question: "Kết luận phù hợp nhất sau mô phỏng là gì?",
    options: ["Can thiệp nhà nước có thể vừa ổn định kinh tế vừa làm tăng liên kết với tập đoàn lớn", "Mọi lựa chọn đều không có hệ quả", "Không cần phân tích ngân sách", "Độc quyền nhà nước chỉ là doanh nghiệp nhà nước"],
    answer: 0,
    explanation: "Mô phỏng giúp thấy tính hai mặt: ổn định, việc làm, ngân sách, cạnh tranh và ảnh hưởng của tập đoàn lớn."
  }
];
