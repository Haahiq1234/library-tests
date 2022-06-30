import os

global libraryText
if os.path.exists("Canvas.js"):
    library = open("Canvas.js", "r")
    libraryText = library.read()
    library.close()
else:
    print("Canvas Library not found")
    input()
    quit()
    #print(libraryText)
#libraryText = str(libraryText)

def getRegion(nm):
    nm = str(nm)
    start = libraryText.find("// #region " + nm)
    end = libraryText.find("// #endregion")
    text = libraryText[start:end]
    text = text.replace("// #region " + nm, "")
    print(text)
    return text

fileName = input()
if os.path.exists(fileName):
    if os.path.exists("Canvas.js"):        
        file = open(fileName, "r")
        text = file.read()
        file.close()

        start = text.find("using [")
        end = text.find("]", start)
        usings = text[start: end]
        usings =  usings.replace("using [", "")
        usings = usings.split(", ")
        usings += ["Control", "Misc", "Vector", "Canvas"]

        textOfLibrary = ""
        for using in usings:
            textOfLibrary += getRegion(using) + "\n"

        text = text.split('<script src="Canvas.js"></script>')
        #<script src="Canvas.js"></script>
        #
        if len(text) > 1:
            text = text[0] + "<script>\n" + textOfLibrary + "\n</script>" + text[1]
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

input()