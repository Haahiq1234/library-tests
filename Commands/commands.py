import sys
import json

sys.path.append("C:/dev/Python")
import command_line
import os

# import webbrowser
from datetime import date
import time
import shutil

cwd = os.getcwd()


def add(args, clr):
    if len(args) == 0:
        print("Command: add [Filename] [Properties]")
        return
    if ".js" in args[0]:
        add_js_file(args, clr)
    if not "." in args[0] and not os.path.exists(args[0]):
        os.mkdir(args[0])
        print(f"Created Folder {args[0]}")


def add_js_file(args, clr):
    canvas_text = '<script src="../Canvas.js"></script>'
    script_tag = f'<script src="{args[0]}"></script>'

    with open("index.html") as file:
        text = file.read()

    classname = args[0].replace(".js", "").split("/")[-1]
    if len(args) > 1:
        if args[1] == "grid":
            with open(cwd + "/gridclassscript.js") as file:
                script_text = file.read()
        elif args[1] == "main":
            with open(cwd + "/mainclassscript.js") as file:
                script_text = file.read()
        with open("script.js") as file:
            script_file_text = file.read()
        with open("script.js", "w") as file:
            file.write(
                "const "
                + classname.lower()
                + " = new "
                + classname
                + "();\n"
                + script_file_text
            )
    else:
        with open(cwd + "/classscript.js") as file:
            script_text = file.read()
    with open(args[0], "w") as file:
        file.write(
            script_text.replace("upperName", classname).replace(
                "lowerName", classname.lower()
            )
        )
        pass
    if script_tag in text:
        return

    text = text.replace(canvas_text, canvas_text + "\n    " + script_tag)
    with open("index.html", "w") as file:
        file.write(text)


def link(args, clr):
    if len(args) == 0:
        print("Command: link [Filename]")
        return

    if ".js" in args[0]:
        link_js(args, clr)


def link_js(args, clr):
    canvas_text = '<script src="../Canvas.js"></script>'
    script_tag = f'<script src="{args[0]}"></script>'

    with open("index.html") as file:
        text = file.read()

    if script_tag in text:
        return

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
            return
    else:
        name = clr.data[1]
    with open("index.html") as file:
        text = file.read()
    text = replace_all_tags(
        text, '<script src="', '"></script>', "<script>", "</script>"
    )
    text = replace_all_tags(
        text, '<link rel="stylesheet" href="', '" />', "<style>", "</style>"
    )
    os.chdir(cwd)
    os.chdir("../Built")
    with open(name + ".html", "w") as file:
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
        prev_tag = text[start_indices[i] : end_indices[i] + tag_end_len]
        file_name = text[start_indices[i] + tag_start_len : end_indices[i]]
        print(file_name)
        with open(file_name) as file:
            file_text = file.read().replace("\n", "\n        ")
        new_tag = (
            actual_tag_start + "\n        " + file_text + "\n    " + actual_tag_end
        )
        new_tags.append(new_tag)
        prev_tags.append(prev_tag)
    for i in range(len(prev_tags)):
        text = text.replace(prev_tags[i], new_tags[i])
    return text
    pass


def find_all_instances(string: str, sub_string: str):
    sub_string_len = len(sub_string)
    i = 0
    indices = []
    while True:
        index = string.find(sub_string, i)
        if index == -1:
            break
        else:
            indices.append(index)
            i = index + sub_string_len - 1
    return indices


def open_project_in_vscode(args, clr):
    args_str = "".join([" " + elem for elem in args])
    print("opening ." + args_str)
    os.system("code ." + args_str)
    pass


def open_project(args, clr):
    if not os.path.exists("../" + args[0]):
        print(f"Project {args[0]} does not exist.")
        return
    os.chdir("../" + args[0])
    command_line.create_command_line(
        {"add": add, "open": open_project_in_vscode, "build": build, "link": link},
        exit_function=exit_project,
        command_line_data=[clr, args[0]],
    )


def copy_files_to_directory(src, dest):
    for file_name in os.listdir(src):
        source = src + "/" + file_name
        destination = dest + "/" + file_name
        print(source, destination)
        if os.path.isfile(source):
            shutil.copy(source, destination)
            print("copied", file_name)


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
    if len(args) == 0:
        print("create [Project Name]")
        return
    name = args[0]

    with open("index_template.html", "r") as file:
        index_text = file.read().replace("projectName", name)

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


    copy_files_to_directory(cwd + "/Files", os.getcwd())

    open_project([name], clr)


def build_project(args, clr):
    if len(args) == 0:
        print("build [Project Name]")
        return
    if not os.path.exists("../" + args[0]):
        print(f"Project {args[0]} does not exist.")
        return
    os.chdir("../" + args[0])
    clr.data = [0, args[0]]
    build(args, clr)
    clr.data = []
    os.chdir(cwd)


def git(args, clr):
    if "push" in args:
        index([], clr)
        if len(args) == 1:
            td = date.today()
            dt = (
                str(td.day)
                + "/"
                + str(td.month)
                + "/"
                + str(td.year)
                + " "
                + time.strftime("%H:%M:%S")
            )
            message = "Update: " + dt
        else:
            message = args[1]
        os.system("git add --all")
        os.system('git commit -m "' + message + '"')
        os.system("git push")
        return
    elif "pull" in args:
        os.system("git fetch")
        os.system("git pull")


# def tree_printer(root):
#     for root, dirs, files in os.walk(root):
#         for d in dirs:
#             print os.path.join(root, d)
#         for f in files:
#             print os.path.join(root, f)
# tree_printer('.')


def index(args, clr):
    os.chdir("../")
    nfiles = os.listdir(os.getcwd())
    files = []
    folders = []
    i = 0
    while i < len(nfiles):
        file = nfiles[i]
        if (not file[0] == ".") and (".html" in file or "." not in file):
            if os.path.isfile(file):
                files.append(file)
            elif os.path.isdir(file) and os.path.exists(
                os.path.join(file, "index.html")
            ):
                folders.append(file)
        i += 1

    data = {"folders": folders, "files": files}
    with open("index.json", "w") as file:
        json.dump(data, file)
    os.chdir(cwd)
    print("Indexed")
    pass


commands = {
    "create": create,
    "open": open_project,
    "build": build_project,
    "git": git,
    "copy": copy,
    "index": index,
}


command_line.create_command_line(commands)
