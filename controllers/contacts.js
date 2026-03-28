const mongodb = require('mongodb');
const getDb = require('../models/database').getDb;
const ObjectId = mongodb.ObjectId;

const DATABASE_NAME = 'Project';
const COLLECTION_NAME = 'Contacts';

const getAllContacts = async (req, res) => {
    //#swagger.tags = ['Contacts']
    try {
        const client = getDb();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        const contacts = await collection.find().toArray();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({
            error: 'Failed to fetch contacts',
            details: error.message
        });
    }
};

const getContactById = async (req, res) => {
    //#swagger.tags = ['Contacts']
    try {
        const contactId = req.params.id;
        if (!ObjectId.isValid(contactId)) {
            console.log('Invalid ID format');
            return res.status(400).json({ error: 'Invalid contact ID format' });
        }

        const client = getDb();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        const contact = await collection.findOne({ _id: new ObjectId(contactId) });

        if (!contact) {
            console.log('Contact not found');
            return res.status(404).json({ error: 'Contact not found' });
        }

        console.log('Contact found:', contact);
        res.status(200).json(contact);

    } catch (error) {
        console.error('Error getting contact:', error);
        res.status(500).json({
            error: 'Failed to fetch contact',
            details: error.message
        });
    }
};

const createContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    try {
        const { firstName, lastName, email, favoriteColor, birthday, gender, nationality } = req.body;

        // Validation 
        if (!firstName || !lastName || !email || !favoriteColor || !birthday || !gender || !nationality) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        if (!/\d{2}\/\d{2}\/\d{4}/.test(birthday)) {
            return res.status(400).json({ error: 'Use MM/DD/YYYY' });
        }

        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({ error: 'Invalid gender' });
        }

        const result = await getDb()
            .db(DATABASE_NAME)
            .collection(COLLECTION_NAME)
            .insertOne({ firstName, lastName, email, favoriteColor, birthday, gender, nationality });

        res.status(201).json({ message: 'Contact created', id: result.insertedId });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const { firstName, lastName, email, favoriteColor, birthday, gender, nationality } = req.body;
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
        return res.status(400).json({ error: 'Invalid contact ID format' });
    }

    try {
        const client = getDb();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const result = await collection.updateOne(
            { _id: new ObjectId(contactId) },
            {
                $set: {
                    firstName,
                    lastName,
                    email,
                    favoriteColor,
                    birthday,
                    gender,
                    nationality
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated' });

    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            error: 'Failed to update contact',
            details: error.message
        });
    }
};

const deleteContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
        return res.status(400).json({ error: 'Invalid contact ID format' });
    }

    try {
        const client = getDb();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.deleteOne({ _id: new ObjectId(contactId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            error: 'Failed to delete contact',
            details: error.message
        });
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};