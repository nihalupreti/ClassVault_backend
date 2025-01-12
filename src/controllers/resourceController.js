const Resource = require("../models/Resource");
const ogs = require("open-graph-scraper");
const sendSuccessResponse = require("../utils/response");

exports.addResource = async (req, res, next) => {
  const { website } = req.body;
  const { id: courseId } = req.params;

  try {
    const { result } = await ogs({ url: website });
    const metadata = {
      title: result.ogTitle || result.title || "No title available",
      description: result.ogDescription || "No description available",
      image: result.ogImage?.website || null,
    };

    const resource = new Resource({
      user: req.user.userId,
      website,
      course: courseId,
      metadata,
    });

    await resource.save();

    sendSuccessResponse(res, 200, resource, "Resource added successfully");
  } catch (error) {
    next(error);
  }
};

exports.getResources = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    const resource = await Resource.find({ course: courseId });

    if (!resource || resource.length === 0) {
      return res.status(404).json({ message: "No resources yet" });
    }

    sendSuccessResponse(res, 200, resource, "Resources retrieved successfully");
  } catch (error) {
    next(error);
  }
};
