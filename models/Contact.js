import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
    id: String,
    label: String,
    type: { type: String, enum: ['text', 'email', 'textarea', 'select'] },
    required: Boolean,
    placeholder: String,
    options: [String]
});

const contactSchema = new mongoose.Schema({
    email: String,
    phone: String,
    location: String,
    socialLinks: { type: Map, of: String }, // Flexible object for social links
    formEnabled: Boolean,
    contactFormFields: [fieldSchema],
    autoReplyMessage: String,
    notificationEmails: [String]
});

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);
