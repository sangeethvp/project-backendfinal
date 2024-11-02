const Restaurent = require('../models/restaurentProfile');
const mongoose = require('mongoose');
const Review = require('../models/review');
const Reservation = require('../models/reservation');
const User = require('../models/user');
const express = require('express');









exports.getRestaurent = async(req,res) =>{
    try{
        let restaurent = await Restaurent.find().populate('reviews');
        res.status(201).json(restaurent)
    }catch(err){
        res.status(401).json({message:'error getting restaurent',err})
    }
};









exports.getRestaurentbyid = async(req,res) => {
    try{
        const restaurent = await Restaurent.findById(req.params.id).populate('reviews');
        res.status(201).json(restaurent);
    }catch(err){
        res.status(401).json({messaage:"error getting restaurent",err})
    }
};












exports.addRestaurent = async (req, res) => {
    const { name, cuisine, menu, availability, images, place, reviews } = req.body;

    try {
        let existingRestaurant = await Restaurent.findOne({ name, place });
        if (existingRestaurant) {
            console.log('Restaurant already exists');
            return res.status(400).json({ message: 'Restaurant with this name and place already exists' });
        }

        const restaurant = new Restaurent({ name, cuisine, menu, availability, images, place, reviews });
        await restaurant.save();
        console.log('Restaurant added successfully');
        
        res.status(201).json({ message: 'Restaurant added successfully', restaurant });
    } catch (error) {
        console.log('Error adding the restaurant:', error);
        res.status(500).json({ message: 'Error adding the restaurant', error });
    }
};











exports.updateRestaurent = async(req,res)=>{
    const { name, cuisine, menu, availability, images, place, reviews } = req.body;
    if(!name&&!cuisine&&!menu&&!availability&&!images&&!place&&!reviews){return res.status(401).json({message:"provide details for updating"})}
    try{
        const restaurent = await Restaurent.findByIdAndUpdate(req.params.id,{name, cuisine, menu, availability, images, place, reviews},{new:true});
       if(!restaurent){return res.status(401).json({message:"Restaurent not found"})}
        res.status(201).json({message:"Restaurent updated successfully",restaurent});

    }catch(error){
        res.status(401).json({message:"Error updating the restaurent",error})
    }
};








exports.deleteRestaurent = async(req,res) =>{
   
    try{
        let deleteRestaurent = await Restaurent.findByIdAndDelete(req.params.id)
        if(!deleteRestaurent){
            res.status(201).json({json:'restaurent not found'})
        }
        res.status(401).json({message: "deteted"})

    }catch(error){
        res.status(401).json({message:"Error deleting the restaurent"})
    }
};










exports.addReview = async(req,res)=>{
    const{restaurent,name,ratings,comments} = req.body;
    const user = req.user.id;
    try{
        let review = new Review({ user, restaurent,name, ratings, comments });
        await review.save();

        const restaurentreview = await Restaurent.findById(restaurent).populate('reviews');
        if(!restaurentreview){
            return res.status(404).json({message:"Restaurent not found"})
        }
        restaurentreview.reviews.push(review);
        res.status(201).json({review});
        await restaurentreview.save();
        
    }catch(err){
        res.status(401).json({message:"error addding the review"})
    }
};







exports.deleteReview = async(req,res) => {
    try{
        let deleteReview = await Review.findByIdAndDelete(req.params.id)
        if(!deleteReview){return res.status(401).json({message:"cannot be found"})};
        await Restaurent.findByIdAndUpdate(deleteReview.restaurent, {
            $pull: { reviews: req.params.id }
        });
        res.status(201).json({message:"review deleted"})
    }catch(error){res.status(500).json({message:"Error deleting the review"})}
    
};










exports. replyComment = async (req, res) => {
    const { reviewId } = req.params;
    const { reply } = req.body; 

    try {
       
        if (!reply) {
            return res.status(400).json({ message: "Reply text is required." });
        }

        // Find the review by ID and update the reply field
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { reply: reply }, // Set the reply field to the new reply text
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found." });
        }

        res.status(200).json({ message: "Reply added successfully!", review: updatedReview });
    } catch (error) {
        console.error("Error replying to review:", error);
        res.status(500).json({ message: "Error replying to review" });
    }
};












exports.getReview = async(req,res) =>{
    try{
        let reviews = await Review.find().populate('reply');
        if(!reviews){return res.status(404).json({message:"not found"})};
        res.status(200).json(reviews)
    }catch(error){
        res.status(401).json({message:"Error fetching the reviews"})
    }
};











exports.getReviewbyId = async(req,res) =>{
    const userId = req.user.id
    try{
        let review = await Review.find({user: userId}).populate('reply');
        if(!review){return res.status(404).json({message:"not found"})};
        console.log("review:",review)
        res.status(200).json(review)
    }catch(error){
        res.status(401).json({message:"Error fetching the reviews"})
    }
    
};










exports.updateReview = async (req, res) => {
    const { ratings, comments } = req.body;
    const userId = req.user.id;

    try {
        const review = await Review.findOneAndUpdate(
            { user: userId, _id: req.params.reviewId },  
            { ratings, comments },
            { new: true }
        );

        if (!ratings && !comments) {
            return res.status(400).json({ message: "Provide the updates" });
        }

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        console.log('Review :', review);
        res.status(200).json({ message: "Review updated successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Error updating the reviews", error });
    }
};











exports.reservation = async(req,res) =>{
    const {restaurent,time,numberofpeople} = req.body;
    const user = req.user.id;
    try{
        const gotrestaurent = await Restaurent.findById(restaurent);
        if(!gotrestaurent){
            return res.status(404).json({message:"Restaurent not found"});
        }
        if(gotrestaurent.availability.Booked >= gotrestaurent.availability.Totaltables){
            return res.status(501).json({message:"Tables not available"})
        }

        const newReservation = new Reservation({user,restaurent,time,numberofpeople});
        await newReservation.save();
        await Restaurent.findByIdAndUpdate(restaurent, {
            $inc: { "availability.Booked" : numberofpeople ,"availability.Totaltables": -numberofpeople}
        });
       
        res.status(200).json({message:"Reserved successfully",newReservation});
    }catch(err){
        res.status(500).json({message:"error reserving"})
    }
};










exports.getReservation = async(req,res) =>{
    try{
        const reservation = await Reservation.find();
        res.status(201).json({ reservation})
    }catch(err){
        res.status(401).json({message:"error fetching the data"})
    }
};











exports.getUserReservation = async (req, res) => {
    // const userId = req.params.userId;
    try {
        const reservations = await Reservation.find({ user: req.params.id}).populate('restaurent','name');
        if (!reservations.length) {
            return res.status(404).json({ message: "No reservations found" });
        }
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving reservations", err });
    }
};









exports.deleteReservation = async (req, res) => {
    const reservationId = req.params.id;
    try {
        const reservation = await Reservation.findByIdAndDelete(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        const restaurent = await Restaurent.findById(reservation.restaurent);
        if (restaurent) {
            restaurent.availability.Booked = Math.max(
                0,
                restaurent.availability.Booked - reservation.numberofpeople
            );
            restaurent.availability.Totaltables += reservation.numberofpeople;
            await restaurent.save();
        }

        res.status(200).json({ message: "Reservation cancelled and availability updated" });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling the reservation", error });
    }
};





exports.updateReservation = async(req,res)=>{
    const userId = req.params.id;
    const {date,time,numberofpeople} = req.body;
    try{
        const reservation = await Reservation.findOneAndUpdate({user:userId},{date,time,numberofpeople},{new:true});
        if(!time && !numberofpeople){return res.status(404).json({message:"update the fields "})};
        if(!reservation) {return res.status(404).json({message:"Reservation not found"})}
        res.status(201).json({message:"Reservation updated successfully"})
    }catch(error){
        res.status(501).json({message:"Error updating the Reservation"})
    }
};









exports.findRestaurentCuisine = async(req,res) =>{
    const{cuisine}=req.body;
    try{
        const restaurent = await Restaurent.find({cuisine : cuisine});
        if(!restaurent.cuisine) {return res.status(404).json({message:"Not found"})};
    
        res.status(201).json(restaurent);
    }catch(error){
        res.status(501).json({message:"Error getting the restaurent"})
    }
};









exports.findRestaurentPlace = async(req,res) =>{
    const{place}=req.body;
    try {
        let filter = {};
        if (place.city) filter['place.city'] = place.city;
        if (place.address) filter['place.address'] = place.address;

        
        const restaurants = await Restaurent.find(filter);
        if (restaurants.length === 0) {
            return res.status(404).json({ message: "Not found" });
        }
        console.log("restaurent:",restaurants)
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error getting the restaurant", error });
    }

};









exports.findRestaurentPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    try {
        
        let filter = {};

        
        if (minPrice || maxPrice) {
            filter['menu.price'] = {};
            if (minPrice) filter['menu.price'].$gte = Number(minPrice);
            if (maxPrice) filter['menu.price'].$lte = Number(maxPrice);
        }

        if(!minPrice&&!maxPrice){return res.status(401).json({message:"not found"})}
        
        const restaurent = await Restaurent.find(filter);

        
        res.status(201).json(restaurent);
    } catch (error) {
        res.status(500).json({ message: "Error finding the restaurant", error });
    }
};









exports.RestaurantRecommendations = async (req,res) => {
    const userId = req.params.id
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");


    const { cuisine = [],  place = [] } = user.preferences || {};
    const searchCuisines = (user.searchHistory || []).map((item) => item.cuisine);


    const preferenceRecommendations = await Restaurent.find({
      cuisine: { $in: cuisine },
      
      'place.city': { $in: place}
    }).limit(3);


    const searchRecommendations = await Restaurent.find({
      cuisine: { $in: searchCuisines },
      'place.city': { $in: place }
    }).limit(3);

    const popularRecommendations = await Restaurent.find().sort({ ratings: -1 }).limit(3);

    
    const recommendations = [...preferenceRecommendations, ...searchRecommendations, ...popularRecommendations];

    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};
