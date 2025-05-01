// Content script runs in the context of web pages
// For now, this is minimal but can be extended to add UI elements or process page content

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showRedirectNotification') {
        // Show an in-page notification about available redirect
        console.log(sender);
        showRedirectNotification(message.targetUrl);
        sendResponse({ success: true });
        return true;
    }
});

// Function to show a notification about available redirect
function showRedirectNotification(targetUrl: string) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.width = 'auto';
    notification.style.padding = '12px 20px';
    notification.style.background = '#4CAF50';
    notification.style.color = 'white';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.fontFamily = 'Arial, sans-serif';

    // Add content
    notification.innerHTML = `
    <div>URL switch available</div>
    <button id="url-switch-redirect" style="background: white; color: #4CAF50; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Switch</button>
    <button id="url-switch-close" style="background: transparent; color: white; border: none; cursor: pointer; font-size: 18px; line-height: 1;">×</button>
  `;

    // Add to page
    document.body.appendChild(notification);

    // Add event listeners
    document.getElementById('url-switch-redirect')?.addEventListener('click', () => {
        window.location.href = targetUrl;
    });

    document.getElementById('url-switch-close')?.addEventListener('click', () => {
        notification.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 5000);
} 