const CHECK_INTERVAL = 5; // minutes

// Import mocked messages
importScripts('public/mockedMessages.js');


function setupAlarm() {
    if (chrome.alarms) {
        chrome.alarms.create('checkMessages', { periodInMinutes: CHECK_INTERVAL });

        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'checkMessages') {
                checkForNewMessages();
            }
        });
    } else {
        console.warn('Alarms API not available. Falling back to setInterval.');
        setInterval(checkForNewMessages, CHECK_INTERVAL * 60 * 1000);
    }
}

function updateBadgeCount() {
    chrome.storage.local.get('messages', (result) => {
        const unreadCount = result.messages ? result.messages.filter(msg => !msg.read).length : 0;
        chrome.action.setBadgeText({ text: unreadCount > 0 ? unreadCount.toString() : '' });
    });
}

function checkForNewMessages() {
    try {
        // Instead of fetching, we'll use our mocked messages
        const newMessages = mockedMessages.filter(msg => !msg.read);

        if (newMessages.length > 0) {
            // Store all messages, not just new ones
            chrome.storage.local.set({ messages: mockedMessages }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error storing messages:', chrome.runtime.lastError);
                } else {
                    console.log('Messages stored successfully');
                    updateBadgeCount();
                }
            });
        } else {
            updateBadgeCount();
        }
    } catch (error) {
        console.error('Error checking messages:', error);
    }
}

// Initial setup
setupAlarm();

// Initial check
checkForNewMessages();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'markAsRead') {
        const messageId = request.messageId;
        const updatedMessages = mockedMessages.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
        );

        // Update mocked messages
        mockedMessages.splice(0, mockedMessages.length, ...updatedMessages);

        // Update storage
        chrome.storage.local.set({ messages: updatedMessages }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error updating messages:', chrome.runtime.lastError);
                sendResponse({ success: false });
            } else {
                console.log('Message marked as read');
                updateBadgeCount();
                sendResponse({ success: true });
            }
        });

        // Indicate that we will send a response asynchronously
        return true;
    }
});