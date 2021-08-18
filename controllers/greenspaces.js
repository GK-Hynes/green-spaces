const Greenspace = require("../models/greenspace");

module.exports.index = async (req, res) => {
  const greenspaces = await Greenspace.find({});
  res.render("greenspaces/index", { greenspaces });
};

module.exports.renderNewForm = (req, res) => {
  res.render("greenspaces/new");
};

module.exports.createGreenspace = async (req, res, next) => {
  const greenspace = new Greenspace(req.body.greenspace);
  greenspace.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  greenspace.author = req.user._id;
  await greenspace.save();
  req.flash("success", "Successfully made a new Green Space");
  res.redirect(`/greenspaces/${greenspace._id}`);
};

module.exports.showGreenspace = async (req, res) => {
  const greenspace = await Greenspace.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("author");
  if (!greenspace) {
    req.flash("error", "Cannot find that Green Space");
    return res.redirect("/greenspaces");
  }
  res.render("greenspaces/show", { greenspace });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const greenspace = await Greenspace.findById(id);
  if (!greenspace) {
    req.flash("error", "Cannot find that Green Space");
    return res.redirect("/greenspaces");
  }
  res.render("greenspaces/edit", { greenspace });
};

module.exports.updateGreenspace = async (req, res) => {
  const { id } = req.params;
  const greenspace = await Greenspace.findByIdAndUpdate(id, {
    ...req.body.greenspace
  });
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  greenspace.images.push(...images);
  await greenspace.save();
  req.flash("success", "Successfully updated Green Space");
  res.redirect(`/greenspaces/${greenspace._id}`);
};

module.exports.deleteGreenspace = async (req, res) => {
  const { id } = req.params;
  await Greenspace.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Green Space");
  res.redirect("/greenspaces");
};
