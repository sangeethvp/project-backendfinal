const express = require('express');
const { auth, authAdmin } = require('../middleware/auth');
const { addRestaurent, deleteRestaurent, getRestaurent, getRestaurentbyid, addReview, replyComment, getReservation, reservation, deleteReview, getUserReservation, getReview, getReviewbyId, deleteReservation, updateReservation, updateReview, findRestaurentPrice, findRestaurentCuisine, findRestaurentPlace, updateRestaurent, RestaurantRecommendations } = require('../controllers/restarentController');
const router = express.Router();


router.post('/add-Restaurent',authAdmin,addRestaurent);
router.get('/restaurent',auth,getRestaurent);
router.get('/restaurent/:id',auth,getRestaurentbyid);
router.post('/reservation',auth,reservation);
router.get("/user-Reservation/:id",auth,getUserReservation);
router.get("/get-Reservation",auth,getReservation);
router.post('/review',auth,addReview);
router.get("/get-Review",auth,authAdmin,getReview);
router.get("/get-userReview/:id",auth,getReviewbyId);
router.post("/reply-Comment/:reviewId",auth,authAdmin,replyComment);
router.delete('/delete-Restaurent/:id',auth,authAdmin,deleteRestaurent);
router.delete("/delete-Review/:id",auth,deleteReview);
router.delete("/delete-Reservation/:id",auth,deleteReservation);
router.put("/update-Reservation/:id",auth,updateReservation);
router.put("/update-Review/:reviewId",auth,updateReview);
router.get("/restaurent-Type",auth,findRestaurentCuisine);
router.get("/restaurent-Price",auth,findRestaurentPrice);
router.get("/restaurent-Place",auth,findRestaurentPlace);
router.put("/update-Restaurent/:restaurentId",authAdmin,updateRestaurent);
router.get("/recommended-Restaurent/:id",auth,RestaurantRecommendations);





module.exports = router;