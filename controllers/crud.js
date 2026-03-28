const mongodb = require('mongodb');
const getDb = require('../models/database').getDb;
const ObjectId = mongodb.ObjectId;

const DATABASE_NAME = 'Mainds';
const COLLECTION_NAME = 'quote';

const getAllForms = async (req, res) => {
    //#swagger.tags = ['Forms']
    try {
        const client = getDb();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        const forms = await collection.find().toArray();
        res.status(200).json(forms);
    } catch (error) {
        console.error('Error getting forms:', error);
        res.status(500).json({
            error: 'Failed to fetch forms',
            details: error.message
        });
    }
};

const getFormById = async (req, res) => {
    //#swagger.tags = ['Forms']
    try {
        const formId = req.params.id;
        if (!ObjectId.isValid(formId)) {
            console.log('Invalid ID format');
            return res.status(400).json({ error: 'Invalid form ID format' });
        }

        const client = getDb();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        const form = await collection.findOne({ _id: new ObjectId(formId) });

        if (!form) {
            console.log('Form not found');
            return res.status(404).json({ error: 'Form not found' });
        }

        console.log('Form found:', form);
        res.status(200).json(form);

    } catch (error) {
        console.error('Error getting form:', error);
        res.status(500).json({
            error: 'Failed to fetch form',
            details: error.message
        });
    }
};

const createForm = async (req, res) => {
    //#swagger.tags = ['Forms']

    try {
        const { first_name, last_name, email, phone, request } = req.body;

        if (!first_name || !last_name || !email || !phone || !request) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (phone.length < 10) {
            return res.status(400).json({ error: 'Phone must be at least 10 digits' });
        }

        const result = await getDb()
            .db(DATABASE_NAME)
            .collection(COLLECTION_NAME)
            .insertOne({ first_name, last_name, email, phone, request });

        res.status(201).json({ message: 'Form created', id: result.insertedId });

    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            details: error.message
        });
    }
};

const updateForm = async (req, res) => {
    //#swagger.tags = ['Forms']
    const { first_name, last_name, email, phone, request } = req.body;
    const formId = req.params.id;

    if (!first_name || !last_name || !email || !phone || !request) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (phone.length < 10) {
        return res.status(400).json({ error: 'Phone must be at least 10 digits' });
    }

    if (!ObjectId.isValid(formId)) {
        return res.status(400).json({ error: 'Invalid form ID format' });
    }

    try {
        const client = getDb();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const result = await collection.updateOne(
            { _id: new ObjectId(formId) },
            {
                $set: {
                    first_name,
                    last_name,
                    email,
                    phone,
                    request
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Form not found' });
        }

        res.status(200).json({ message: 'Form updated' });

    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({
            error: 'Failed to update form',
            details: error.message
        });
    }
};

const deleteForm = async (req, res) => {
    //#swagger.tags = ['Forms']
    const formId = req.params.id;

    if (!ObjectId.isValid(formId)) {
        return res.status(400).json({ error: 'Invalid form ID format' });
    }

    try {
        const client = getDb();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.deleteOne({ _id: new ObjectId(formId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Form not found' });
        }

        res.status(200).json({ message: 'Form deleted' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({
            error: 'Failed to delete form',
            details: error.message
        });
    }
};

module.exports = {
    getAllForms,
    getFormById,
    createForm,
    updateForm,
    deleteForm
};