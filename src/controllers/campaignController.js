// Campaign CRUD operations
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// List all campaigns
exports.list = async (req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  res.render('pages/campaign', { title: 'Campaigns', campaignList: campaigns, req });
};

// Show a single campaign
exports.show = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).send('Campaign not found');
  const donations = await Donation.find({ campaign: campaign._id }).sort({ createdAt: -1 });
  res.render('pages/campaign-show', { title: campaign.title, campaign, donations, req });
};

// New campaign form
exports.newForm = (req, res) => {
  res.render('pages/campaign-new', { title: 'New Campaign', req });
};

// Create campaign
exports.create = async (req, res) => {
  const { title, description, goalAmount, startDate, endDate } = req.body;
  const campaign = await Campaign.create({
    title,
    description,
    goalAmount,
    startDate: startDate || null,
    endDate: endDate || null,
  });
  res.redirect(`/campaigns/${campaign._id}`);
};

// Edit form
exports.editForm = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).send('Campaign not found');
  res.render('pages/campaign-edit', { title: 'Edit Campaign', campaign, req });
};

// Update campaign
exports.update = async (req, res) => {
  const { title, description, goalAmount, startDate, endDate } = req.body;
  await Campaign.findByIdAndUpdate(req.params.id, {
    title,
    description,
    goalAmount,
    startDate: startDate || null,
    endDate: endDate || null,
  });
  res.redirect(`/campaigns/${req.params.id}`);
};

// Delete campaign
exports.delete = async (req, res) => {
  await Campaign.findByIdAndDelete(req.params.id);
  await Donation.deleteMany({ campaign: req.params.id });
  res.redirect('/campaigns');
};

// Search campaigns
exports.search = async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.redirect('/campaigns');

  const campaignList = await Campaign.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ]
  });

  if (campaignList.length === 0) {
    return res.redirect('/campaigns'); // reload instead of "no results"
  }

  res.render('pages/campaign', { title: 'Search Results', campaignList, query: q, req });
};
