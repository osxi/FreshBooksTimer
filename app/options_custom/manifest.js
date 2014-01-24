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
        {
            "tab": "Import Data",
            "group": "Data",
            "name": "importAll",
            "type": "button",
            "label": "Import All",
            "text": "Import"
        },
        {
            "tab": "Import Data",
            "group": "Data",
            "name": "importDescription",
            "type": "description",
            "text": "Action needed. No data imported."
        },
        {
            "tab": "Defaults",
            "group": "Time Logging",
            "name": "defaultProject",
            "type": "popupButton",
            "label": "Project",
            "options": []
        },
        {
            "tab": "Defaults",
            "group": "Time Logging",
            "name": "defaultStaff",
            "type": "popupButton",
            "label": "Staff",
            "options": []
        },
        {
            "tab": "Defaults",
            "group": "Time Logging",
            "name": "defaultTask",
            "type": "popupButton",
            "label": "Task",
            "options": []
        }
    ],
    "alignment": [
        [
            "apiUrl",
            "authToken"
        ]
    ]
};
