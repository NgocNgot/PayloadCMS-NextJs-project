import type { CollectionConfig } from 'payload'
export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'title',
    description: 'Manage form.',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
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
      name: 'fields',
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
          name: 'data',
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
