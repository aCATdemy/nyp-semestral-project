const flashMessage = (res, messageType, message, icon, dismissable) => {
    let alert;
    switch (messageType) {
        case 'success':
            alert = res.flashMessenger.success(message);
            alert.titleIcon = 'fa-solid fa-circle-check';
            break;
        
        case 'error':
            alert = res.flashMessenger.danger(message);
            alert.titleIcon = 'fa-solid fa-circle-exclamation';
            break;
        
        case 'info':
            alert = res.flashMessenger.info(message);
            alert.titleIcon = 'fa-solid fa-circle-info';
            alert.canBeDismissed = true;
            break;
        
        default:
            alert = res.flashMessenger.info(message);
    }

    if (icon) {
        alert.titleIcon = icon;
    }

    if (dismissable) {
        alert.canBeDismissed = dismissable;
    }
};

module.exports = flashMessage;