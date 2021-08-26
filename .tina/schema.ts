import { defineSchema } from "@tinacms/cli";

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
          type: "number",
          label: "Year",
          name: "year"
        },
        {
          type: "image",
          label: "Images",  
          name: "images",
          list: true
        },
        {
          type: "string",
          label: "Description",
          name: "description",
          ui: {
            component: "markdown"
          },
          isBody: true
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
          type: "string",
          label: "Body",
          name: 'body',
          ui: {
            component: 'markdown'
          },
          isBody: true
        }
      ]
    }
  ],
  
})
