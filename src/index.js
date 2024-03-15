// Note: For simplicity, all code is contained within a single JavaScript file.
// Note: Request validation is omitted for simplicity. In a production environment, it's essential to include proper request validation.
// Note: Environment variables or a secret manager should be used to securely store sensitive information like the MongoDB URI. 
// Note: This temporary MongoDB URI will be active until 24.03.2024.

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { Schema } = mongoose;
const path = require('path');
const pretty = require('express-prettify');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

app.use(bodyParser.json());
app.use(pretty({ query: 'pretty' }));

(async () => {  // syncing mongodb
    require('./../mongo.config.js').sync();
})();

// connecting to mongodb schema for category
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
});

categorySchema.index({ name: 1, parent: 1}, { unique: true });
const CategoryModel = mongoose.model('Category', categorySchema);

// EndPoint: Create a new category
app.post('/category', async (req, res) => {
    try {      
      let { name, parent } = req.body;      
      if(parent) {
        if(mongoose.Types.ObjectId.isValid(parent)) {
            parent = new mongoose.Types.ObjectId(parent);
            parent = await CategoryModel.findById(parent);
            if(!parent) 
                return res.status(400).json({
                    status: 'FAILED',
                    message: 'Invalid Parent!'
                });
        } else {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Invalid ParentID!'
            });
        }        
      }      
      const category = new CategoryModel({ name, parent: parent ? parent._id : null });      
      await category.save();
      return res.status(201).json({
        status: 'SUCCESS',
        item: category
      });
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED'
      });
    }
});

// EndPoint: List Categories
app.get('/categories', async (req, res) => {
    try {
        let depth = parseInt(req.query.depthLevel) || 1;
        depth =  depth <= 0 ? 1 : depth;        
        let limit = parseInt(req.query.limit) || 10;
        let pipeline = await _generateNestedPipelines(depth, []);        
        pipeline.push({
            $limit : limit
        });
        const categories = await CategoryModel.aggregate(pipeline);        
        return res.status(200).json({
            status: 'SUCCESS',
            count: categories.length,
            items: categories
        });
    } catch (error) {
        return res.status(200).json({
            status: 'FAILED',
            count: 0,
            items: []
        });
    }
})

// EndPoint: Update a category
app.put('/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, parent } = req.body;
        let updatedCategory;
        if (parent) {
            if (mongoose.Types.ObjectId.isValid(parent)) {
                const parentCategory = await CategoryModel.findById(parent);
                if (!parentCategory) {
                    return res.status(404).json({
                        status: 'FAILED',
                        message: 'Parent category not found!'
                    });
                }
            } else {
                return res.status(400).json({
                    status: 'FAILED',
                    message: 'Invalid ParentID!'
                });
            }
        }
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Category not found!'
            });
        }

        if((parent) && (parent.toString() === category._id.toString())) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Not a valid parent!'
            });
        }

        category.name = name || category.name;
        category.parent = parent || category.parent;
        updatedCategory = await category.save();
        return res.status(200).json({
            status: 'SUCCESS',
            item: updatedCategory
        });
    } catch (error) {
        return res.status(400).json({
            status: 'FAILED'
        });
    }
});

// EndPoint: Delete a category
app.delete('/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ 'message': 'Category not found!' });
        }        
        const dependents = await CategoryModel.findOne({'parent': category._id}).lean();       
        if(dependents) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'The category contains sub-categories!'
            });
        }
        await CategoryModel.deleteOne({ _id: categoryId });
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 'FAILED'
        });
    }
});

// Application Dependency Methods
async function _generateNestedPipelines(depth, pipeline = []) {   
    // this private method is responsible to generate nested pipeline as per the depth provided 
    function addLookupStage(pipeline, depth) {
        if (depth <= 0) return;
        pipeline.push({
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: 'parent',
                as: 'children',
                pipeline: addLookupPipeline(depth - 1)
            }
        });
    }
    function addLookupPipeline(depth) {
        const pipeline = [{ 
            $sort: {
                'name': 1
            }
        }];
        addLookupStage(pipeline, depth);
        return pipeline;
    }
    addLookupStage(pipeline, depth);
    return pipeline;
}

module.exports = app;
