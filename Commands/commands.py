import sys;
sys.path.append("F:/Python")
import command_line
import os
import webbrowser

#chrome = webbrowser.get("chrome");
#webbrowser.open("www.youtube.com", new=2)
    
cwd = os.getcwd()
    
def add(args, clr):
    if len(args) == 0:
        print("Command: add [Filename] [Add class]");
        return
    
    canvas_text = "<script src=\"../Canvas.js\"></script>"
    script_tag = f"<script src=\"{args[0]}\"></script>"
    
    with open("index.html") as file:
        text = file.read()
    
    if script_tag in text:
        return
    
        
    with open(args[0], "w") as file:
        script_text = ""    
        if "-y" in args:
            with open(cwd + "/classscript.js") as file2:
                script_text = file2.read().replace("name", args[0])
        file.write(script_text)
        pass
    
    text = text.replace(canvas_text, canvas_text + "\n    " + script_tag)
    with open("index.html", "w") as file:
        file.write(text)
   
def exit_project(args, clr):
    if len(args) > 0:
        quit()
    os.chdir(cwd)
    clr.running = False
    pass 

tag_types = ["script", "link"]
def build():
    with open("index.html") as file:
        text = file.read()
    built = ""
    
    
    
def open_project_in_vscode(args, clr):
    os.system("code .");
    pass

def open_project(args, clr):
    if not os.path.exists("../" + args[0]):
        print(f"Project {args[0]} does not exist.")
        return
    os.chdir("../" + args[0])      
    command_line.create_command_line({"add": add, "open": open_project_in_vscode}, 
                                     exit_function=exit_project, 
                                     command_line_data=clr) 
 
def create(args, clr):
    if len(args)==0:
        print("No args given")
        return
    shouldcreatescript = "-y" in args
    name = args[0]
    
    if shouldcreatescript:
        with open("t_s.html", "r") as file:
            text = file.read()
    else:
        with open("t.html", "r") as file:
            text = file.read();
    
    text = text.replace("name", name)
    #print(text);
    
    os.chdir("../")
    if os.path.exists(name):
        print("Project already exists")
        os.chdir(cwd)
        return
    
    os.mkdir(name)
    os.chdir(name)
    
    with open("index.html", "w") as file:
        file.write(text)
    if shouldcreatescript:
        file = open("script.js", "w")
    
    with open("style.css", "w") as file:
        file.write("")
        file.close()
        
    open_project([name], clr)

commands = {
    "create": create,
    "open": open_project
}


command_line.create_command_line(commands)