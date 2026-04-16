import  joi  from 'joi';
import { globalFields } from '../../globalFields.js';

export const updateSchema=joi.object({
    body:{
        userName:globalFields.userName,
        phone:globalFields.phone,
        language:globalFields.language,
        currency:globalFields.currency,
        theme:globalFields.theme
    }
}).required()