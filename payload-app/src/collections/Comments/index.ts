import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Comment',
    plural: 'Comments',
  },
  access: {
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'commentText',
      type: 'textarea',
      label: 'Comment',
      required: true,
      admin: {
        rows: 3,
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      defaultValue: ({ user }) => (user ? user.id : undefined),
    },
  ],
  timestamps: true,
}
