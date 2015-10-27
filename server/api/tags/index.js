'use strict';

var express = require('express');
var controller = require('./tags.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/addTagCat',auth.hasRole('admin'),controller.addTagCat);
router.get('/getTagCatList',auth.hasRole('admin'),controller.getTagCatList);
router.put('/:id/updateTagCat', auth.hasRole('admin'), controller.updateTagCat);
router.delete('/:id', auth.hasRole('admin'), controller.delTagCat);
router.get('/:id/getTagList', auth.hasRole('admin'), controller.getTagList);
router.post('/addTag', auth.hasRole('admin'), controller.addTag);
router.delete('/:id/deleteTag', auth.hasRole('admin'), controller.deleteTag);
router.put('/:id/updateTag', auth.hasRole('admin'), controller.updateTag);
//前台数据
router.get('/getFrontTagList',controller.getFrontTagList);
module.exports = router;