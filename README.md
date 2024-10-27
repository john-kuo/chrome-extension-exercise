
# Chrome Extension Exercise

## How to run the project
1. Install dependencies
```
npm install
```

3. Install the extension in the Chrome browser
    1. Navigate to ``` chrome://extensions/``` 
    2. Select Load unpacked from the chrome-extension-exercise project folder where the  **manifest.json** resides 

4. In the Extensions tab in Chrome browser, pin the extension to keep it shown in the tabs
5. Click on the Chrome Extension Exercise app icon, messages are shown

## To run the test cases
1. Install development dependencies
```
npm install --save-dev
```
2. Run tests
```
npm run test
```

## Features
1. Display a list of messages
2. Users can mark a message as read
3. Message is stored using Chrome local storage
4. Use React state to manage 
5. Sound is played with high priority message.
6. There is a counter to show number of unread messages.
7. Messages are organized in to low, medium and high
8. Store messages locally
9. Test Cases

## Architectural Decisions
1. The project setup is slightly different than the requirement due to React's component setup guideline.
2. Message priorities are prioritized based on High to low.  And the filter mechanism is based on this as well.
3. Using states to handle different message states and handle information and errors accordingly.

## Assumptions
1. Messages will always be delivered successfully.  If the user's device is faulty, we can't handle this at the moment.
2. There is minimal message delay, since we are using mocked data and haven't tested with real world large data with various speed conditions
3. User only users the extension from Chrome with the supported version and not other browsers like Brave or any Chromium based browsers

## Future Improvements
1. Better Styling
2. Encryption support to protect user's messages.
3. Mobile SMS support, notify user with High priority messages
4. Options to support quiet times, so they don't get notify all the time
5. Calendar support, if messages contain meetings 
6. AI integration to summarize messages in one go