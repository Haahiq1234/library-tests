import sys;
sys.path.append("E:/Python")
import command_line
import os
#import webbrowser
from datetime import date;
import time
import shutil
    
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
                script_text = file2.read().replace("name", args[0].replace(".js", ""))
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

def build(args, clr):
    if len(args) > 0:
        name = args[0]
        if os.path.exists("../" + name):
            os.chdir("../" + name)
        else:
            print(f"Project {name} does not exist")
    with open("index.html") as file:
        text = file.read()
    text = replace_all_tags(text, "<script src=\"", "\"></script>", "<script>", "</script>");
    text = replace_all_tags(text, "<link rel=\"stylesheet\" href=\"", "\" />", "<style>", "</style>");
    os.chdir(cwd)
    os.chdir("../Built")
    with open(clr.data[1] + ".html", "w") as file:
        file.write(text)
    os.chdir("../" + clr.data[1])
    
def replace_all_tags(text, tag_start, tag_end, actual_tag_start, actual_tag_end):
    tag_start_len = len(tag_start)
    tag_end_len = len(tag_end)
    start_indices = find_all_instances(text, tag_start)
    end_indices = find_all_instances(text, tag_end)
    print(start_indices, end_indices)
    new_tags = []
    prev_tags = []
    for i in range(len(start_indices)):
        prev_tag = text[start_indices[i]: end_indices[i] + tag_end_len]
        file_name = text[start_indices[i] + tag_start_len: end_indices[i]]
        print(file_name)
        with open(file_name) as file:
            file_text = file.read().replace("\n", "\n        ")
        new_tag = actual_tag_start + "\n        " + file_text + "\n    " + actual_tag_end
        new_tags.append(new_tag)
        prev_tags.append(prev_tag)
    for i in range(len(prev_tags)):
        text = text.replace(prev_tags[i], new_tags[i])
    return text
    pass

def find_all_instances(string:str, sub_string:str):
    sub_string_len = len(sub_string);
    i = 0
    indices = []
    while True:        
        index = string.find(sub_string, i);
        if index == -1:
            break;
        else:
            indices.append(index);
            i = index + sub_string_len - 1
    return indices;
    
def open_project_in_vscode(args, clr):
    os.system("code .");
    pass

def open_project(args, clr):
    if not os.path.exists("../" + args[0]):
        print(f"Project {args[0]} does not exist.")
        return
    os.chdir("../" + args[0])      
    command_line.create_command_line({"add": add, "open": open_project_in_vscode, "build": build}, 
                                     exit_function=exit_project, 
                                     command_line_data=[clr, args[0]]) 
def copy_files_to_directory(src, dest):
    for file_name in os.listdir(src):
        source = src + "/" + file_name
        destination = dest + "/" + file_name
        print(source, destination)
        if os.path.isfile(source):
            shutil.copy(source, destination)
            print('copied', file_name)


def copy(args, clr):
    os.chdir("../")
    src = args[0]
    dest = args[1]
    os.mkdir(dest)
    copy_files_to_directory(src, dest)
    os.chdir(dest)
    with open("index.html") as file:
        text = file.read().replace(src, dest)
    with open("index.html", "w") as file:
        file.write(text)

    os.chdir(cwd)

def create(args, clr):
    if len(args)==0:
        print("create [Project Name]")
        return
    name = args[0]
    
    with open("index.html", "r") as file:
        index_text = file.read().replace("name", name)
    
    with open("script.js", "r") as file:
        script_text = file.read()
        
    os.chdir("../")
    if os.path.exists(name):
        if os.path.exists(name + "/index.html"):
            print("Project already exists")
            os.chdir(cwd)
            return
    else:
        os.mkdir(name)
    os.chdir(name)
    
    with open("index.html", "w") as file:
        file.write(index_text)
    
    with open("script.js", "w") as file:
        file.write(script_text)
    
    with open("style.css", "w") as file:
        file.write("")
        
    open_project([name], clr)

def build_project(args, clr):
    if len(args) == 0:
        print("build [Project Name]")
        return
    if not os.path.exists("../" + args[0]):
        print(f"Project {args[0]} does not exist.")
        return
    os.chdir("../" + args[0])
    clr.data = [0, args[0]];
    build(args, clr)
    clr.data = []
    os.chdir(cwd)

def git(args, clr):
    if "push" in args:
        td = date.today()
        dt = str(td.day) + "/" + str(td.month) + "/" + str(td.year) + " " + time.strftime("%H:%M:%S")
        os.system("git add --all")
        os.system("git commit -m \"Update " + dt + "\"")
        os.system("git push")
    pass

commands = {
    "create": create,
    "open": open_project,
    "build": build_project,
    "git": git,
    "copy":copy
}


command_line.create_command_line(commands)