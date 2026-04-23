@AGENTS.md

# Xe Tiện Chuyến — PWA

## Business Context
Xe ghép liên tỉnh kết nối Thái Bình với Hà Nội, Nội Bài, Hải Phòng, Cát Bi.
Mô hình: platform kết nối (Điều 35 Nghị định 10/2020/NĐ-CP).
Revenue: hoa hồng 10-12% trên mỗi chuyến thành công.
Giai đoạn: MVP để pilot + kêu gọi đầu tư, KHÔNG submit store.

## Tech Stack
- Framework: Next.js 16 App Router + TypeScript strict mode
- UI: Tailwind CSS + shadcn/ui (src/components/ui/)
- State: Zustand cho client state, Server Components cho server data
- Data fetching: TanStack Query v5 cho client; async Server Component khi có thể
- Database: Supabase PostgreSQL với PostGIS
- Auth: Supabase Auth + SMS OTP qua eSMS.vn
- Maps: Google Maps JavaScript API
- Deployment: Vercel (auto từ main branch)
- PWA: next-pwa

## Color Palette
- Primary: #FF6B35 (cam thương hiệu)
- Secondary: #004E89 (xanh đậm)
- Success: #10B981 / Danger: #EF4444

## Domain Model
- profiles: thông tin user (extends auth.users)
- drivers: tài xế
- vehicles: xe của tài xế
- routes: tuyến cố định (TB_HN, HN_TB, TB_NB, NB_TB, TB_HP, HP_TB, TB_CB, CB_TB)
- trips: chuyến cụ thể
- bookings: đặt chỗ của khách
- reviews: đánh giá sau chuyến

## Status Machines
- Trip: scheduled → boarding → in_progress → completed | cancelled
- Booking: pending → confirmed → paid → completed | cancelled | no_show
- Driver: pending_verification → verified → suspended

## Legal Requirements (BẮT BUỘC theo Nghị định 10/2020)
Mỗi trang booking/trip detail phải hiển thị:
- Tên đơn vị vận tải
- Tên tài xế
- Biển số xe
- Hành trình
- Cự ly ước tính
- Tổng tiền
- Hotline hỗ trợ

## Code Quality Rules
- KHÔNG dùng `any`, dùng `unknown` + type guard
- KHÔNG inline styles, chỉ Tailwind classes
- KHÔNG fetch trong Client Component (dùng TanStack Query hoặc Server Component)
- KHÔNG hardcode secrets, dùng env vars
- KHÔNG console.log trong production
- Mọi form dùng React Hook Form + Zod validation
- Server Actions có try-catch và trả về { success, data, error }

## Folder Structure
```
src/
├── app/
│   ├── (public)/       # Routes không cần auth
│   ├── (auth)/         # Login, register, OTP
│   ├── (app)/          # User routes (cần auth) — có bottom nav
│   ├── (driver)/       # Driver routes
│   ├── (admin)/        # Admin panel
│   └── api/            # API routes (webhooks)
├── components/
│   ├── ui/             # shadcn
│   ├── layout/
│   ├── trip/
│   ├── booking/
│   └── maps/
├── lib/
│   ├── supabase/       # Supabase clients
│   ├── esms/
│   ├── zalo-zns/
│   └── utils.ts
├── hooks/
├── stores/             # Zustand
├── types/
└── constants/
```

## Anti-patterns (AI hay mắc — TRÁNH)
- KHÔNG tạo /pages folder (dùng App Router)
- KHÔNG getServerSideProps (dùng async Server Component)
- KHÔNG tạo API route cho mọi thứ — prefer Server Actions
- KHÔNG wrap toàn bộ app trong "use client"

## When Starting Any Task
1. Đọc file này trước
2. Đọc các file liên quan trong codebase
3. Nếu cần thay đổi schema, viết migration trước
4. Implement theo folder structure trên
5. Test trên viewport mobile (375px)
6. Commit nhỏ với Conventional Commits (feat:, fix:, chore:, docs:)
