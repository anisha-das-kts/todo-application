const admin = require("../firebase");
const User = require("../user");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Decoded UID:", decoded.uid);

    let user = await User.findOne({ firebaseId: decoded.uid });
    console.log("User found:", user);

    if (!user) {
      user = await User.create({
        firebaseId: decoded.uid,
        name: decoded.name || "No Name",
        email: decoded.email || "No Email",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
