const { body, query } = require('express-validator');

const homeContactValidationResult = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('name must be at least 3 characters long')
        .trim()
        .escape(),
    body('email')
        .notEmpty().withMessage('email address is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail()
        .trim(),
    body('message')
        .isLength({ min: 2 }).withMessage('Message must be at least 2 characters long')
        .trim()
        .escape(),
];

const contactPageValidationResult = [
    body('fname')
        .notEmpty().withMessage('First Name is required')
        .isLength({ min: 3 }).withMessage('First Name must be at least 3 characters long')
        .trim()
        .escape(),
    body('lname')
        .notEmpty().withMessage('Last Name is required')
        .isLength({ min: 3 }).withMessage('Last Name must be at least 3 characters long')
        .trim()
        .escape(),
    body('email')
        .notEmpty().withMessage('email address is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail()
        .trim(),
    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone('en-GB').withMessage('Invalid phone number')
        .trim()
        .escape(),
    body('service')
        .trim()
        .escape(),
    body('budget')
        .trim()
        .escape(),
    body('message')
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 2 }).withMessage('Message must be at least 2 characters long')
        .trim()
        .escape(),
];

const subscribeEmailValidationResult = [
    body('email')
        .notEmpty().withMessage('email address is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail()
        .trim(),
];

const unsubscribeEmailValidationResult = [
    query('email')
        .notEmpty().withMessage('email address is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail()
        .trim(),
];

module.exports = {
    homeContactValidationResult,
    contactPageValidationResult,
    subscribeEmailValidationResult,
    unsubscribeEmailValidationResult
};