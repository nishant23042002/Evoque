import { Schema, model, models, Types } from "mongoose";



const AddressSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
        },

        addressLine1: {
            type: String,
            required: true,
        },

        addressLine2: {
            type: String,
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },

        pincode: {
            type: String,
            required: true,
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
export default models.Address || model("Address", AddressSchema);