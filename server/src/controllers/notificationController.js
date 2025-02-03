import { Workspace } from '../models/workspace.js';

export const getNotifications = async (req, res) => {
try {

        console.log("Fetching notifications...");
        const { roomId } = req.params;
        const workspace = await Workspace.findOne({ roomId });
        
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // Sort notifications by timestamp in descending order (newest first)
        const notifications = workspace.notifications.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const addNotification = async (req, res) => {
    try {
            console.log("Adding notification...");
            const { roomId } = req.params;
            const { type, message, username, metadata } = req.body;
    
            if (!type || !message || !username) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
    
            const workspace = await Workspace.findOne({ roomId });
            
            if (!workspace) {
                return res.status(404).json({ message: 'Workspace not found' });
            }
    
            const newNotification = {
                type,
                message,
                username,
                timestamp: new Date(),
                metadata
            };
    
            workspace.notifications.push(newNotification);
            workspace.lastUpdated = new Date();
            
            await workspace.save();
    
            return res.status(201).json({ notification: newNotification });
        } catch (error) {
            console.error('Error adding notification:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

export const cleanUpNotification = async (req, res) => {
    try {
            const { roomId } = req.params;
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
            const workspace = await Workspace.findOne({ roomId });
            
            if (!workspace) {
                return res.status(404).json({ message: 'Workspace not found' });
            }
    
            const originalLength = workspace.notifications.length;
            workspace.notifications = workspace.notifications.filter(
                notification => new Date(notification.timestamp) > sevenDaysAgo
            );
    
            if (workspace.notifications.length !== originalLength) {
                workspace.lastUpdated = new Date();
                await workspace.save();
            }
    
            return res.status(200).json({ 
                message: `Cleaned up ${originalLength - workspace.notifications.length} old notifications`
            });
        } catch (error) {
            console.error('Error cleaning up notifications:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

export const getFilteredNotifications = async (req, res) => {

    console.log("filtered notifications...");
    try {
        const { roomId } = req.params;
        const { type, startDate, endDate, username } = req.query;

        const workspace = await Workspace.findOne({ roomId });
        
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        let filteredNotifications = [...workspace.notifications];

        // Apply filters
        if (type) {
            filteredNotifications = filteredNotifications.filter(
                notification => notification.type === type
            );
        }

        if (username) {
            filteredNotifications = filteredNotifications.filter(
                notification => notification.username === username
            );
        }

        if (startDate) {
            filteredNotifications = filteredNotifications.filter(
                notification => new Date(notification.timestamp) >= new Date(startDate)
            );
        }

        if (endDate) {
            filteredNotifications = filteredNotifications.filter(
                notification => new Date(notification.timestamp) <= new Date(endDate)
            );
        }

        // Sort by timestamp
        filteredNotifications.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return res.status(200).json({ notifications: filteredNotifications });
    } catch (error) {
        console.error('Error fetching filtered notifications:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}