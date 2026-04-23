export const SITE = {
  name: "Xe Tiện Chuyến",
  shortName: "TiệnChuyến",
  tagline: "Xe ghép liên tỉnh Thái Bình — Hà Nội — Hải Phòng",
  description:
    "Đặt chỗ nhanh chóng, giá cố định, xe đón tận nhà. Kết nối Thái Bình với Hà Nội, sân bay Nội Bài, Hải Phòng và sân bay Cát Bi.",
} as const;

export const HOTLINE_DISPLAY = "1900 1234 56";
export const HOTLINE_TEL = process.env.HOTLINE ?? "19001234";

export const LEGAL = {
  basis:
    "Điều 35 Nghị định 10/2020/NĐ-CP về hoạt động vận tải hành khách hợp đồng điện tử.",
  model:
    "Xe Tiện Chuyến là nền tảng kết nối giữa hành khách và đơn vị vận tải, không trực tiếp khai thác xe.",
} as const;
