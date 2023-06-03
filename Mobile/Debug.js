const MobileDebug = {
    element: false,
    Log: function(...messages) {
        if (!this.element) {
            let element = document.createElement("div");
            document.body.appendChild(element);
            this.element = element;
            //element.innerHTML += 
        }
        for (var message of messages) {
            this.element.innerHTML += message + " ";
        }
        this.element.innerHTML += "<br>";
    }
};