import os



name = input("Enter Project name: ")
shouldcreatescript = input("Should create script.js (y/n): ")[0] == "y"

if shouldcreatescript:
    with open("Template script.html", "r") as file:
        text = file.read()
else:
    with open("Template.html", "r") as file:
        text = file.read();

print(text);

os.chdir("../")
if os.path.exists(name):
    print("Project already exists")
    quit()

os.mkdir(name)
os.chdir(name)

with open("index.html", "w") as file:
    file.write(text)
if shouldcreatescript:
    file = open("script.js", "w");
    file.close()

with open("style.css", "w") as file:
    file.write("");
