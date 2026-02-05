import mongoose from "mongoose";

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

export default mongoose.models.GlobalSettings || mongoose.model("GlobalSettings", globalSettingsSchema);
