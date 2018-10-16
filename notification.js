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
class OSCreateNotification {
    constructor(notificationAppId) {
        /** An array of user ID's that should receive this notification */
        this.playerIds = Array();
        /**
         * The language code (ie. "en" for English) for this notification
         * defaults to "en" (English)
         */
        this.language = "en";
        this.appId = notificationAppId;
    }
    build() {
        var json = {
            'app_id': this.appId,
            'include_player_ids': this.playerIds
        };
        var language = this.language || "en";
        if (this.content)
            json.contents = { [language]: this.content };
        if (this.heading)
            json.headings = { [language]: this.heading };
        if (this.subtitle)
            json.subtitle = { [language]: this.subtitle };
        if (this.contentAvailable)
            json.content_available = this.contentAvailable;
        if (this.mutableContent)
            json.mutable_content = this.mutableContent;
        if (this.additionalData)
            json.data = this.additionalData;
        if (this.url)
            json.url = this.url;
        if (this.iosAttachments)
            json.ios_attachments = this.iosAttachments;
        if (this.bigPicture)
            json.big_picture = this.bigPicture;
        if (this.iosCategory)
            json.ios_category = this.iosCategory;
        if (this.iosSound)
            json.ios_sound = this.iosSound;
        if (this.androidSound)
            json.android_sound = this.androidSound;
        if (this.androidSmallIcon)
            json.small_icon = this.androidSmallIcon;
        if (this.androidLargeIcon)
            json.large_icon = this.androidLargeIcon;
        if (this.androidChannelId)
            json.android_channel_id = this.androidChannelId;
        if (this.iosBadgeCount)
            json.ios_badgeCount = this.iosBadgeCount;
        if (this.collapseId)
            json.collapse_id = this.collapseId;
        if (this.deliveryTimeOfDay)
            json.delivery_time_of_day = this.deliveryTimeOfDay;
        if (this.iosBadgeType)
            json.ios_badgeType = this.iosBadgeType;
        if (this.delayOption)
            json.delay_option = this.delayOption;
        if (this.buttons)
            json.buttons = this.buttons.map(button => {
                return button.jsonRepresentation();
            });
        return json;
    }
}
exports.OSCreateNotification = OSCreateNotification;
