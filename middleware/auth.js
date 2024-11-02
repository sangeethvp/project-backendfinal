const jwt = require('jsonwebtoken');

const User = require('../models/user');









exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No auth header found');
    return res.status(401).json({ message: 'Authorization token is required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    console.log('Decoded:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token verification failed', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};




 
  




exports.authAdmin = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
      console.log('Decoded Token:', decoded); // Log the decoded token
      req.user = decoded;
      
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Server error, please try again', error: err.message });
    }
  };






  
  
// backend/middleware/auth.js
// exports.authAdmin = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
    
//     // Check if authorization header is present
//     if (!authHeader) {
//         console.log('Authorization header missing');
//         return res.status(401).json({ message: 'Authorization token is required' });
//     }



//     // Extract token from the header
//     const token = authHeader.split(' ')[1];
//     if (!token) {
//         console.log('Token missing from authorization header');
//         return res.status(401).json({ message: 'Token missing from authorization header' });
//     }
//     console.log('Token:', token);

//     try {
//         // Verify JWT and extract payload
//         const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
//         req.user = decoded; // Attach user info to the request
//         console.log('Decoded:', decoded);

//         // Check if the role in the token is 'admin'
//         if (req.user.role !== 'admin') {
//             console.log('Access denied - User is not admin');
//             return res.status(403).json({ message: 'Access denied' });
//         }
//         console.log('Access granted - User is admin');
//         next(); // Proceed to the next middleware or route handler
//     } catch (err) {
//         console.log('JWT Verification Error:', err);
//         return res.status(500).json({ message: 'JWT verification error', error: 'Token invalid or expired' });
//     }
// };





// exports. authAdmin = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//   if (!authHeader) {
//       return res.status(401).json({ message: 'Authorization token is required' });
//   }

   
//   const token = authHeader.split(' ')[1];
//   try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
//       req.user = decoded;
//       console.log('Decoded:',  decoded);
//       if (req.user.role !== "admin") {
//           return res.status(403).json({ message: 'access denied' });
//         }
//       next();
//   } catch (err) {
//       return res.status(500).json({ message: 'error', err:"try agin" });
//   }
// };

