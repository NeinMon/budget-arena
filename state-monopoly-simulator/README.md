# Budget Arena: Quyền lực phía sau thị trường

Website frontend tĩnh về chủ đề **Biểu hiện mới của độc quyền nhà nước dưới chủ nghĩa tư bản** trong Chương 4, môn Kinh tế chính trị Mác - Lênin.

## Ý tưởng sản phẩm

**Budget Arena: Quyền lực phía sau thị trường** là game mô phỏng chính sách kinh tế, trong đó người chơi đóng vai người điều phối nguồn lực của nhà nước. Qua năm vòng tình huống, người chơi phải phân bổ ngân sách cho tập đoàn lớn, doanh nghiệp nhỏ, người tiêu dùng, đầu tư hạ tầng và hoạt động điều tiết. Mỗi quyết định sẽ làm thay đổi ngân sách, việc làm, phúc lợi xã hội, mức độ cạnh tranh và ảnh hưởng của các tập đoàn lớn. Kết thúc trò chơi, hệ thống phân tích xu hướng điều hành và liên hệ các quyết định với lý luận về độc quyền nhà nước dưới chủ nghĩa tư bản.

Trọng tâm không phải dự báo kinh tế thực tế, mà là minh họa cách sự can thiệp của nhà nước có thể làm thay đổi quan hệ giữa tập đoàn lớn, doanh nghiệp nhỏ, người tiêu dùng, ngân sách công và mức độ tập trung thị trường.

## Thành phần chính

- `index.html`: trang mở đầu, giới thiệu ý tưởng game và dẫn vào trải nghiệm chính.
- `game.html`: game kéo-thả ngân sách với 5 vùng chính sách và chỉ số thay đổi theo thời gian.
- `result.html`: báo cáo kết quả, nhận xét xu hướng lựa chọn và biểu đồ tổng kết bằng Chart.js cục bộ.
- `quiz.html`: quiz củng cố kiến thức trong sản phẩm.
- `references.html`: cơ sở lý luận, ghi chú học thuật và nguồn tham khảo.
- `assets/images/`: bộ ảnh minh họa gồm 1 ảnh hero và 5 ảnh tương ứng 5 vòng chơi.

## Điểm sáng tạo

- Người chơi thao tác trực tiếp bằng kéo-thả hoặc bấm chọn vùng, không chỉ đọc nội dung lý thuyết.
- Các chỉ số phản hồi ngay khi phân bổ ngân sách, giúp thấy được đánh đổi giữa việc làm, phúc lợi xã hội, ngân sách còn lại và ảnh hưởng của tập đoàn lớn.
- Cơ chế hiệu ứng giảm dần giúp tránh việc dồn toàn bộ ngân sách vào một khu vực luôn tạo kết quả tốt.
- Kết quả được lưu cục bộ bằng `localStorage`, cho phép chuyển sang trang báo cáo sau khi chơi.
- Có liên kết sang kho câu hỏi ôn tập Chương 4 để mở rộng phần kiểm tra kiến thức.

## Cấu trúc thư mục

```text
state-monopoly-simulator/
├── index.html
├── game.html
├── quiz.html
├── result.html
├── references.html
├── .nojekyll
├── assets/
│   ├── js/
│   │   └── chart.umd.min.js
│   └── images/
│       ├── hero-budget-arena.webp
│       ├── round-1-bank.webp
│       ├── round-2-technology.webp
│       ├── round-3-energy.webp
│       ├── round-4-infrastructure.webp
│       ├── round-5-employment.webp
│       └── fallback.webp
├── css/
│   └── style.css
├── js/
│   ├── scenarios.js
│   ├── game.js
│   ├── quiz.js
│   └── chart.js
└── data/
    ├── scenarios.json
    └── questions.json
```

## Ghi chú học thuật

Các tình huống, chỉ số và kết quả trong trò chơi chỉ nhằm minh họa nội dung lý luận. Đây không phải mô hình định lượng hay công cụ đánh giá chính sách kinh tế thực tế.

## Kiểm thử trước khi nộp

| Kiểm thử | Kết quả |
| --- | --- |
| Chạy game khi chưa phân bổ ngân sách | Hệ thống yêu cầu phân bổ ít nhất một đồng ngân sách |
| Thu hồi ngân sách | Đồng ngân sách quay lại vùng khả dụng |
| Xác nhận chính sách | Chỉ chạy một lần cho mỗi vòng |
| Hoàn thành 5 vòng | Có thể mở trang báo cáo kết quả |
| Tải lại trang | Dữ liệu đã chơi vẫn được lưu bằng `localStorage` |
| Ảnh tình huống | Dùng WebP và có ảnh dự phòng khi lỗi tải |
| Biểu đồ | Dùng Chart.js cục bộ, không phụ thuộc CDN |
| Kho câu hỏi ôn tập Chương 4 | Mở tab mới, không làm mất báo cáo hiện tại |
| Điện thoại | Có thể bấm chọn đồng ngân sách và vùng phân bổ, không chỉ kéo-thả |
