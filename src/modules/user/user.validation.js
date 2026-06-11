import  joi  from 'joi';
import { globalFields } from '../../globalFields.js';

export const updateSchema=joi.object({
    body:joi.object({
        userName:globalFields.userName,
        phone:globalFields.phone,
        language:globalFields.language,
        currency:globalFields.currency,
        theme:globalFields.theme
    })
}).required()

export const settingsSchema=joi.object({
    body:joi.object({
        language:globalFields.language,
        theme:globalFields.theme
    })
}).required()

export const changePasswordSchema=joi.object({
    body:joi.object({
        oldPassword:globalFields.password.required(),
        newPassword:globalFields.password.required(),
        confirmNewPassword:joi.string().required()
    })
}).required()