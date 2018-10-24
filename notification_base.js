"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OSActionButton {
    /** constructor function */
    constructor(id, title, icon) {
        this.id = id;
        this.title = title;
    }
    jsonRepresentation() {
        return {
            'id': this.id,
            'title': this.title,
            'icon': this.icon
        };
    }
}
exports.OSActionButton = OSActionButton;
class OSNotificationBase {
    constructor(nativeJson) {
        console.log("received notification");
        console.log(nativeJson);
        if (!nativeJson)
            return;
        if (nativeJson.body)
            this.content = nativeJson.body;
        if (nativeJson.title)
            this.heading = nativeJson.title;
        if (nativeJson.subtitle)
            this.subtitle = nativeJson.subtitle;
        if (nativeJson.launchURL)
            this.url = nativeJson.launchURL;
        if (nativeJson.additionalData)
            this.additionalData = nativeJson.additionalData;
        if (nativeJson.attachments)
            this.iosAttachments = nativeJson.attachments;
        if (nativeJson.actionButtons)
            this.buttons = nativeJson.actionButtons;
        if (nativeJson.category)
            this.iosCategory = nativeJson.category;
        if (nativeJson.threadId)
            this.iosThreadId = nativeJson.threadId;
    }
}
exports.OSNotificationBase = OSNotificationBase;
