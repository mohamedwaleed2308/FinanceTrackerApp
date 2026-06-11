import { categoryModel } from "../../../DB/models/Category.model.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
// if (category.isDefault) {
//     return next(
//         new Error(
//             "Default categories cannot be modified",
//             { cause: 403 }
//         )
//     );
// }

export const getCategories = asyncHandler(
    async (req, res, next) => {
        const { categoryType } = req.validatedData.query;

        if (!categoryType) {
            return next(new Error('category type is required', { cause: 400 }))
        }

        const categories = await categoryModel.find({
            userId: req.user._id,
            deletedAt: null,
            categoryType
        });

        return successResponse({ res, message: 'Categories retrieved successfully', data: { categories } });
    }
)
export const createCategory = asyncHandler(
    async (req, res, next) => {
        const { categoryName, categoryType } = req.validatedData.body;

        const isExist = await categoryModel.findOne({
            userId: req.user._id,
            categoryName: {
                $regex: `^${categoryName}$`,
                $options: 'i'
            },
            deletedAt: null
        });

        if (isExist) {
            return next(new Error('Category already exists', { cause: 409 }));
        }

        const category = await categoryModel.create({
            userId: req.user._id,
            categoryName,
            categoryType
        });

        return successResponse({ res, status: 201, message: 'Category created successfully', data: { category } });
    }
)
export const updateCategory = asyncHandler(
    async (req, res, next) => {

        const { categoryId } = req.validatedData.params;
        const { categoryName, categoryType } = req.validatedData.body;

        const category = await categoryModel.findOne({
            _id: categoryId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!category) {
            return next(new Error('Category not found', { cause: 404 }));
        }

        if (category.isDefault) {
            return next(new Error('Default categories cannot be modified', { cause: 403 }));
        }

        if (categoryName) {

            const isExist = await categoryModel.findOne({
                _id: { $ne: categoryId },
                userId: req.user._id,
                categoryName: {
                    $regex: `^${categoryName}$`,
                    $options: 'i'
                },
                deletedAt: null
            });

            if (isExist) {
                return next(new Error('Category already exists', { cause: 409 }));
            }

            category.categoryName = categoryName;
        }

        if (categoryType) {
            category.categoryType = categoryType;
        }

        await category.save();

        return successResponse({res,status:200,message: 'Category updated successfully',data: { category}});
    }
);
export const deleteCategory=asyncHandler(
    async(req,res,next)=>{
        const { categoryId } = req.validatedData.params;

        const category = await categoryModel.findOne({
            _id: categoryId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!category) {
            return next(new Error('Category not found', {cause: 404}));
        }

        if (category.isDefault) {
            return next(new Error('Default categories cannot be deleted',{ cause: 403 }));
        }

        category.deletedAt = new Date();

        await category.save();

        return successResponse({res,message: 'Category deleted successfully'});
    }
)