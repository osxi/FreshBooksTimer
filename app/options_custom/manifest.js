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
            "name": "importProjects",
            "type": "button",
            "label": "Projects",
            "text": "Import"
        },
        {
            "tab": "Import Data",
            "group": "Data",
            "name": "projectsDescription",
            "type": "description",
            "text": "None imported"
        },
        {
            "tab": "Import Data",
            "group": "Data",
            "name": "importStaff",
            "type": "button",
            "label": "Staff",
            "text": "Import"
        },
        {
            "tab": "Import Data",
            "group": "Data",
            "name": "staffsDescription",
            "type": "description",
            "text": "None imported"
        },
        {
            "tab": "Import Data",
            "group": "Data",
            "name": "importTasks",
            "type": "button",
            "label": "Tasks",
            "text": "Import"
        },
        {
            "tab": "Import Data",
            "group": "Data",
            "name": "tasksDescription",
            "type": "description",
            "text": "None imported"
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
