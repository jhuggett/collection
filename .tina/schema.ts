import { defineSchema } from "@tinacms/cli";

const tags = [
  {
    "name": "coin",
    "label": "Coins"
  },
  {
    "name": "bullet",
    "label": "Bullets"
  },
  {
    "name": "misc",
    "label": "Misc"
  }
]

export default defineSchema({
  collections: [
    {
      label: 'Item',
      name: 'item',
      path: 'content/items',
      fields: [
        {
          type: "string",
          label: "Name",
          name: "name",
        },
        {
          type: "string",
          label: "Made",
          name: "made"
        },
        {
          type: "object",
          label: "Found",
          name: "found",
          fields: [
            {
              type: "string",
              label: "Where",
              name: "where",
            },
            {
              type: "string",
              label: "When",
              name: "when"
            }
          ]
        },
        {
          type: "object",
          label: "Images",  
          name: "images",
          list: true,
          fields: [
            {
              type: "image",
              name: "myImage",
              label: "Image"
            }
          ]
        },
        {
          type: "rich-text",
          label: "Description",
          name: "description",
          isBody: true
        },
        {
          type: "string",
          label: "Tags",
          name: "tags",
          list: true,
          options: tags.map(tag => tag.name)
        }
      ]
    },
    {
      label: 'Page',
      name: 'page',
      path: 'content/pages',
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title"
        },
        {
          type: "rich-text",
          label: "Body",
          name: 'body',
          isBody: true
        }
      ]
    }
  ],
  
})
