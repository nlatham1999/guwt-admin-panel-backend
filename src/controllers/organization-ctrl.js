const Organization = require('../models/organization-model')

createOrganization = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an organization',
        })
    }

    const organization = new Organization(body)

    if (!organization) {
        return res.status(400).json({ success: false, error: err })
    }

    organization
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: organization._id,
                message: 'Organization created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Organization not created!',
            })
        })
}

updateOrganization = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Organization.findOne({ _id: req.params.id }, (err, organization) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Organization not found!',
            })
        }
        organization.name = body.name
        organization.department = body.department
        organization.admin = body.admin
        organization
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: organization._id,
                    message: 'Organization updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Organization not updated!',
                })
            })
    })
}

deleteOrganization = async (req, res) => {
    await Organization.findOneAndDelete({ _id: req.params.id }, (err, organization) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!organization) {
            return res
                .status(404)
                .json({ success: false, error: `Organization not found` })
        }

        return res.status(200).json({ success: true, data: organization })
    }).catch(err => console.log(err))
}

getOrganizationById = async (req, res) => {
    await Organization.findOne({ _id: req.params.id }, (err, organization) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!organization) {
            return res
                .status(404)
                .json({ success: false, error: `Organization not found` })
        }
        return res.status(200).json({ success: true, data: organization })
    }).catch(err => console.log(err))
}

getOrganizations = async (req, res) => {
    await Organization.find({}, (err, organizations) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!organizations.length) {
            return res
                .status(404)
                .json({ success: false, error: `Organization not found` })
        }
        return res.status(200).json({ success: true, data: organizations })
    }).catch(err => console.log(err))
}

module.exports = {
    createOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizations,
    getOrganizationById,
}