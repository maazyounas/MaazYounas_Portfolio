const mongoose = require("mongoose");

const globalSettingsSchema = new mongoose.Schema({
    primaryColor: String,
    accentColor: String,
    enableDarkMode: Boolean,
    siteTitle: String,
    metaDescription: String,
    keywords: [String],
    enableAnimations: Boolean,
    language: String,
    timezone: String,
    dateFormat: String,
    enableMaintenance: Boolean,
    maintenanceMessage: String,
    cookieConsent: Boolean,
    analyticsCode: String,
    socialSharing: Boolean,
    enableComments: Boolean
});

module.exports = mongoose.model("GlobalSettings", globalSettingsSchema);
