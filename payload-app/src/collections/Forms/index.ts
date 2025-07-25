import type { CollectionConfig } from 'payload'
export const Forms: CollectionConfig = {
  slug: 'forms', // Tên slug phải khớp với 'forms' trong relationship
  admin: {
    useAsTitle: 'title', // Giả sử mỗi form có một trường 'title'
    description: 'Quản lý các định nghĩa form hoặc dữ liệu gửi từ form.',
  },
  access: {
    create: () => true,
    read: () => true,
    update: ({ req }) => (req.user ? true : false),
    delete: ({ req }) => (req.user ? true : false),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tên Form (hoặc Mã định danh)',
    },
    {
      name: 'fields', // Ví dụ: Một mảng các trường của form (nếu bạn tự định nghĩa form trong CMS)
      type: 'array',
      label: 'Các trường của Form',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Tên trường',
        },
        {
          name: 'label',
          type: 'text',
          label: 'Nhãn hiển thị',
        },
        {
          name: 'type',
          type: 'select',
          options: ['text', 'email', 'textarea', 'checkbox'],
          label: 'Loại trường',
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
          label: 'Bắt buộc',
        },
      ],
      admin: {
        description: 'Định nghĩa các trường cho form này.',
      },
    },
    // Bạn cũng có thể tạo một trường để lưu trữ các submissions (dữ liệu gửi)
    {
      name: 'submissions',
      type: 'array',
      label: 'Dữ liệu gửi',
      fields: [
        {
          name: 'submittedAt',
          type: 'date',
          defaultValue: () => new Date(),
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'data', // Lưu trữ dữ liệu submission dưới dạng JSON
          type: 'json',
          label: 'Nội dung gửi',
        },
      ],
      admin: {
        readOnly: true,
        description: 'Dữ liệu được gửi từ form này.',
      },
    },
  ],
  timestamps: true,
}
