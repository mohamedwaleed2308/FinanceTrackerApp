import joi from "joi";
import { globalFields } from "../../globalFields.js";


export const getCategories = joi.object({
    query: joi.object({
        categoryType:globalFields.categoryType
    }).required()
});
export const createCategory = joi.object({
    body: joi.object({
        categoryName:globalFields.categoryName.required(),
        categoryType:globalFields.categoryType.required()
    }).required()
});
export const updateCategory = joi.object({
    params:joi.object({
        categoryId:globalFields.id.required()
    }).required(),
    body: joi.object({
        categoryName:globalFields.categoryName.required(),
        categoryType:globalFields.categoryType.required()
    }).min(1).required()
});
export const deleteCategory = joi.object({
    params: joi.object({
        categoryId:globalFields.id.required()
    }).required()
});