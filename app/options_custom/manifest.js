// SAMPLE
this.manifest = {
    "name": "Freshbooks Trello Timer",
    "icon": "icon.png",
    "settings": [
        {
            "tab": i18n.get("information"),
            "group": i18n.get("authentication"),
            "name": "apiUrl",
            "type": "text",
            "label": "API Url",
            "text": "youraccount.freshbooks.com"
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("authentication"),
            "name": "authToken",
            "type": "text",
            "label": "Authentication Token",
            "text": "your freshbooks api token",
            "masked": true
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("authentication"),
            "name": "myDescription",
            "type": "description",
            "text": i18n.get("description")
        },
    ],
    "alignment": [
        [
            "apiUrl",
            "authToken"
        ]
    ]
};
