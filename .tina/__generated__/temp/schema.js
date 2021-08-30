"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("@tinacms/cli");
var items_1 = require("../pages/items");
exports.default = (0, cli_1.defineSchema)({
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
                    type: "string",
                    label: "Description",
                    name: "description",
                    ui: {
                        component: "markdown"
                    },
                    isBody: true
                },
                {
                    type: "string",
                    label: "Tags",
                    name: "tags",
                    list: true,
                    options: items_1.tags.map(function (tag) { return tag.name; })
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
});
