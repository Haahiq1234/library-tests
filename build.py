import os


fileName = input()
if os.path.exists(fileName):
    if os.path.exists("Canvas.js"):
        library = open("Canvas.js", "r")
        libraryText = library.read()
        library.close()
        
        file = open(fileName, "r")
        text = file.read()
        file.close()
        text = text.split('<script src="Canvas.js"></script>')
        if len(text) > 1:
            text = text[0] + "<script>\n" + libraryText + "\n</script>" + text[1]
            if "<link rel=\"stylesheet\" href=\"style.css\"/>" in text:
                if os.path.exists("style.css"):
                    style = open("style.css")
                    styleText = style.read()
                    style.close()
                    text = text.split("<link rel=\"stylesheet\" href=\"style.css\"/>")
                    text = text[0] + "<style>\n" + styleText + "\n</style>" + text[1]
            file = open("built-" + fileName, "w")
            file.write(text)
            file.close()
        else:
            print("No Canvas script tag found")
    else:
        print("Canvas library not found.")    
else:
    print("File not Found")