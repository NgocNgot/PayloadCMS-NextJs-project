// import type { CollectionConfig } from 'payload'

// import { authenticated } from '../../access/authenticated'

// export const Users: CollectionConfig = {
//   slug: 'users',
//   access: {
//     admin: authenticated,
//     create: authenticated,
//     delete: authenticated,
//     read: authenticated,
//     update: authenticated,
//   },
//   admin: {
//     defaultColumns: ['name', 'email'],
//     useAsTitle: 'name',
//   },
//   auth: true,
//   fields: [
//     {
//       name: 'name',
//       type: 'text',
//     },
//   ],
//   timestamps: true,
// }

import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // Cho phép người dùng chưa đăng nhập có thể tạo tài khoản
    create: () => true,
    // Các quyền truy cập khác vẫn chỉ dành cho người dùng đã đăng nhập
    admin: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
    // Cần bật auth: true để Payload tạo ra các API đăng nhập/đăng ký
    tokenExpiration: 60 * 60 * 24, // 24 hours
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      domain: undefined,
    },
    verify: false, // Tắt chức năng xác thực email cho ví dụ này
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      type: 'text',
      required: true,
    },
    {
      name: 'birthdate',
      type: 'date',
      required: true,
    },
    // Thêm các trường khác của bạn vào đây nếu cần
  ],
  timestamps: true,
}
