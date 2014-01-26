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
            "text": "https://domain.freshbooks.com/api/2.1/xml-in"
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
            "type": "description",
            "text": "In this tab you can select defaults for when you first \
                      open the popup. This is convenient for when you are \
                      working on the same project for awhile and don't want \
                      to have to select the project and task each time you \
                      want to log some time."
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
            "name": "hideStaffDropdown",
            "type": "checkbox",
            "label": "Hide staff dropdown"
        },
        {
            "tab": "Defaults",
            "group": "Time Logging",
            "type": "description",
            "text": "This hides the staff dropdown in the popup. \
                      Useful if you are only ever logging time as \
                      yourself. Make sure you have the default staff \
                      option above set correctly though!"
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
