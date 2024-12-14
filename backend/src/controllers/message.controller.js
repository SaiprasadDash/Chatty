import User from "../models/user.model.js";
import Message from "../models/message.model.js"; // Ensure correct import
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js"; // Ensure correct import

export const getUserForSidebar = async (req, res) => {
    try {
        const LoggedinUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne:LoggedinUserId }}).select("-password");

        res.status(200).json(filteredUsers); 
    } catch (error) {
        console.log("Error in getUserForSidebar controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params; // Correctly destructure id
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                { senderId: myId, receiverId: id }, // Corrected variable name
                { senderId: id, receiverId: myId }, // Corrected variable name
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponce = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponce.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
          
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal server Error" }); 
    }
};