// Donation CRUD operations
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

// New donation form
exports.newForm = (req, res) => {
  const { campaignId } = req.params;
  res.render('pages/donation-new', { title: 'Add Donation', campaignId, req });
};

// Create donation
exports.create = async (req, res) => {
  const { donorName, amount, campaignId } = req.body;
  const donation = new Donation({ donorName, amount, campaign: campaignId });
  await donation.save();

  await Campaign.findByIdAndUpdate(campaignId, { $inc: { currentAmount: amount } });
  res.redirect(`/campaigns/${campaignId}`);
};

// Edit donation form
exports.editForm = async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) return res.status(404).send('Donation not found');
  res.render('pages/donation-edit', { title: 'Edit Donation', donation, req });
};

// Update donation
exports.update = async (req, res) => {
  const { donorName, amount, campaignId } = req.body;
  const oldDonation = await Donation.findById(req.params.id);
  if (!oldDonation) return res.status(404).send('Donation not found');

  const diff = amount - oldDonation.amount;
  await Campaign.findByIdAndUpdate(campaignId, { $inc: { currentAmount: diff } });

  await Donation.findByIdAndUpdate(req.params.id, { donorName, amount });
  res.redirect(`/campaigns/${campaignId}`);
};

// Delete donation
exports.delete = async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) return res.status(404).send('Donation not found');

  await Campaign.findByIdAndUpdate(donation.campaign, { $inc: { currentAmount: -donation.amount } });
  await Donation.findByIdAndDelete(req.params.id);

  res.redirect(`/campaigns/${req.body.campaignId || donation.campaign}`);
};
