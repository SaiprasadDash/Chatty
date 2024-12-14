import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    messages: [], // Fixed typo here
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/user"); // Updated endpoint
            set({ users: res.data });
        } catch (error) {
            console.log("Error in getUsers:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            const isMessagesSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessagesSentFromSelectedUser) return; 


            set({ messages: [...get().messages, newMessage] });
        });
    },
    unsubscribeFromMessages: () => { // Fixed method name
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    // optimize this later
    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },
}));