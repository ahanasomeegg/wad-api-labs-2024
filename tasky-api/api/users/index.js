import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
}));

// Register (Create) / Authenticate User
router.post('/', asyncHandler(async (req, res) => {
    try {
        if (req.query.action === 'register') {
            const user = new User(req.body);
            await user.save();
            res.status(201).json({
                code: 201,
                msg: 'Successfully created new user.',
            });
        } else {  // Authenticate user
            const user = await User.findOne(req.body);
            if (!user) {
                return res.status(401).json({ code: 401, msg: 'Authentication failed' });
            }
            return res.status(200).json({
                code: 200,
                msg: 'Authentication Successful',
                token: 'TEMPORARY_TOKEN',
            });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                code: 400,
                msg: 'Validation Error',
                errors: error.errors,
            });
        } else if (error.code === 11000) { // Duplicate key error (unique violation)
            res.status(409).json({
                code: 409,
                msg: 'Duplicate Username',
            });
        } else {
            throw error; // Pass to global error handler
        }
    }
}));

// Update a user
router.put('/:id', asyncHandler(async (req, res) => {
    if (req.body._id) delete req.body._id; // Remove _id from body if it exists
    const result = await User.updateOne({ _id: req.params.id }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code: 200, msg: 'User Updated Successfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
}));

export default router;
